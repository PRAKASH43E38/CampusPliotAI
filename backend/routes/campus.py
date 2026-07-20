from flask import Blueprint, request, jsonify, send_file
from models import db, Location, Faculty, HostelMenu, Outpass, Student, StudentProfile, Announcement, Event, Department, Semester, Notification
from routes.auth import require_role

campus_bp = Blueprint('campus', __name__)

@campus_bp.route('/map-image', methods=['GET'])
def get_map_image():
    import os
    paths_to_try = [
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'IMG', 'Screenshot From 2026-07-19 16-56-00.png'),
        os.path.join('..', 'IMG', 'Screenshot From 2026-07-19 16-56-00.png'),
        os.path.join('IMG', 'Screenshot From 2026-07-19 16-56-00.png')
    ]
    for path in paths_to_try:
        if os.path.exists(path):
            return send_file(path, mimetype='image/png')
    return jsonify({'error': 'Image file not found'}), 404

@campus_bp.route('/kml', methods=['GET'])
def get_kml():
    import os
    paths_to_try = [
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'Untitled KML file.kml'),
        'Untitled KML file.kml',
        '../Untitled KML file.kml'
    ]
    for path in paths_to_try:
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return f.read(), 200, {'Content-Type': 'application/xml'}
    return jsonify({'error': 'KML file not found'}), 404

@campus_bp.route('/locations', methods=['GET'])
def get_locations():
    locations = Location.query.all()
    return jsonify([loc.to_dict() for loc in locations])

@campus_bp.route('/faculty', methods=['GET'])
def get_faculty():
    dept_name = request.args.get('department')
    if dept_name:
        faculty_members = Faculty.query.join(Department).filter(Department.name == dept_name).all()
    else:
        faculty_members = Faculty.query.all()
    return jsonify([fac.to_dict() for fac in faculty_members])

@campus_bp.route('/hostel/menu', methods=['GET'])
def get_hostel_menu():
    day = request.args.get('day')
    if day:
        menu = HostelMenu.query.get(day)
        return jsonify(menu.to_dict() if menu else {})
    else:
        menus = HostelMenu.query.all()
        return jsonify({m.day: m.to_dict() for m in menus})

@campus_bp.route('/hostel/outpasses', methods=['GET'])
@require_role('STUDENT')
def get_outpasses():
    student_id = request.headers.get('X-Student-Id')
    outpasses = Outpass.query.filter_by(student_id=student_id).all()
    return jsonify([op.to_dict() for op in outpasses])

@campus_bp.route('/hostel/outpass', methods=['POST'])
@require_role('STUDENT')
def create_outpass():
    student_id = request.headers.get('X-Student-Id')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json() or {}
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    reason = data.get('reason')

    if not start_date or not end_date or not reason:
        return jsonify({'error': 'Missing outpass request fields'}), 400

    block = student.profile.hostel_block if student.profile else ''
    room = student.profile.hostel_room if student.profile else ''

    outpass = Outpass(
        student_id=student_id,
        block=block,
        room=room,
        start_date=start_date,
        end_date=end_date,
        reason=reason,
        status='PENDING'
    )
    db.session.add(outpass)
    db.session.commit()

    return jsonify({
        'success': True,
        'outpass': outpass.to_dict()
    }), 201

@campus_bp.route('/announcements', methods=['GET'])
def get_announcements():
    announcements = Announcement.query.all()
    return jsonify([ann.to_dict() for ann in announcements])

# ==========================================
# NOTIFICATIONS ENDPOINTS
# ==========================================

@campus_bp.route('/notifications', methods=['GET'])
@require_role('STUDENT')
def get_notifications():
    student_id = request.headers.get('X-Student-Id')
    notifications = Notification.query.filter_by(student_id=student_id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications])

@campus_bp.route('/notifications/read', methods=['POST'])
@require_role('STUDENT')
def mark_notification_read():
    student_id = request.headers.get('X-Student-Id')
    data = request.get_json() or {}
    notification_id = data.get('notificationId')
    
    if notification_id:
        notif = Notification.query.filter_by(id=notification_id, student_id=student_id).first()
        if notif:
            notif.is_read = True
            db.session.commit()
    else:
        # Mark all as read
        notifs = Notification.query.filter_by(student_id=student_id, is_read=False).all()
        for notif in notifs:
            notif.is_read = True
        db.session.commit()
        
    return jsonify({'success': True, 'message': 'Notifications marked as read.'})

@campus_bp.route('/admin/notifications', methods=['POST'])
@require_role('ADMIN')
def send_notification():
    data = request.get_json() or {}
    student_id = data.get('studentId')
    title = data.get('title')
    message = data.get('message')
    
    if not student_id or not title or not message:
        return jsonify({'success': False, 'message': 'Missing required fields.'}), 400
        
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'success': False, 'message': 'Student not found.'}), 404
        
    import uuid
    notif = Notification(
        id=f"notif-{uuid.uuid4().hex[:6]}",
        student_id=student_id,
        title=title,
        message=message,
        is_read=False
    )
    db.session.add(notif)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Notification dispatched successfully.',
        'data': notif.to_dict()
    }), 201

@campus_bp.route('/admin/notifications/<id>', methods=['DELETE'])
@require_role('ADMIN')
def delete_notification(id):
    notif = Notification.query.get(id)
    if not notif:
        return jsonify({'success': False, 'message': 'Notification not found.'}), 404
    db.session.delete(notif)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Notification deleted successfully.'})

# ==========================================
# ADMIN MANAGEMENT ENDPOINTS
# ==========================================

@campus_bp.route('/admin/students', methods=['GET'])
@require_role('ADMIN')
def admin_get_students():
    students = Student.query.all()
    return jsonify([st.to_dict() for st in students])

@campus_bp.route('/admin/students', methods=['POST'])
@require_role('ADMIN')
def admin_save_student():
    data = request.get_json() or {}
    student_id = data.get('id')
    student = Student.query.get(student_id) if student_id else None
    
    if not student:
        import uuid
        student = Student(
            id=f"st-{uuid.uuid4().hex[:6]}",
            password_hash="student123"
        )
        db.session.add(student)
        
    student.email = data.get('email', student.email if student_id else '')
    student.roll_no = data.get('rollNo', student.roll_no if student_id else '')
    
    # Resolve Department
    dept_name = data.get('department', 'Computer Science & Engineering')
    dept = Department.query.filter_by(name=dept_name).first()
    if not dept:
        dept_code = "".join([w[0] for w in dept_name.split() if w.isalnum()]).upper()[:20]
        dept = Department(name=dept_name, code=dept_code)
        db.session.add(dept)
        db.session.commit()
    student.department_id = dept.id

    # Resolve Semester
    sem_num = int(data.get('semester', 1))
    sem = Semester.query.filter_by(semester_number=sem_num).first()
    if not sem:
        sem = Semester(semester_number=sem_num, academic_year='2025-2026')
        db.session.add(sem)
        db.session.commit()
    student.semester_id = sem.id

    # Sync Profile
    if not student.profile:
        student.profile = StudentProfile(student_id=student.id)
        db.session.add(student.profile)
        
    student.profile.full_name = data.get('name', student.profile.full_name if student_id else 'New Student')
    student.profile.course = data.get('course', student.profile.course if student_id else '')
    student.profile.cgpa = float(data.get('cgpa', student.profile.cgpa if student_id else 8.0))
    student.profile.attendance = float(data.get('attendanceOverall', student.profile.attendance if student_id else 80.0))
    student.profile.hostel_block = data.get('hostelBlock', student.profile.hostel_block if student_id else '')
    student.profile.hostel_room = data.get('hostelRoom', student.profile.hostel_room if student_id else '')
    
    db.session.commit()
    return jsonify({'success': True, 'student': student.to_dict()})

@campus_bp.route('/admin/students/<id>', methods=['DELETE'])
@require_role('ADMIN')
def admin_delete_student(id):
    student = Student.query.get(id)
    if student:
        if student.profile:
            db.session.delete(student.profile)
        db.session.delete(student)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Student not found'}), 404

@campus_bp.route('/admin/faculty', methods=['POST'])
@require_role('ADMIN')
def admin_save_faculty():
    data = request.get_json() or {}
    fac_id = data.get('id')
    faculty = Faculty.query.get(fac_id) if fac_id else None
    
    if not faculty:
        import uuid
        faculty = Faculty(id=f"fac-{uuid.uuid4().hex[:6]}")
        db.session.add(faculty)
        
    faculty.name = data.get('name', faculty.name if fac_id else '')
    faculty.designation = data.get('designation', faculty.designation if fac_id else '')
    faculty.email = data.get('email', faculty.email if fac_id else '')
    faculty.cabin = data.get('cabin', faculty.cabin if fac_id else '')
    faculty.office_hours = data.get('officeHours', faculty.office_hours if fac_id else '09:00 AM - 04:30 PM')
    
    # Resolve Department
    dept_name = data.get('department', 'Computer Science & Engineering')
    dept = Department.query.filter_by(name=dept_name).first()
    if not dept:
        dept_code = "".join([w[0] for w in dept_name.split() if w.isalnum()]).upper()[:20]
        dept = Department(name=dept_name, code=dept_code)
        db.session.add(dept)
        db.session.commit()
    faculty.department_id = dept.id

    import json
    interests = data.get('researchInterests', [])
    if isinstance(interests, str):
        try:
            interests = json.loads(interests)
        except Exception:
            interests = [i.strip() for i in interests.split(',')]
            
    # Clear existing and add new
    faculty.interests = []
    from models import ResearchInterest
    for int_name in interests:
        ri = ResearchInterest.query.filter_by(interest_name=int_name).first()
        if not ri:
            ri = ResearchInterest(interest_name=int_name)
            db.session.add(ri)
            db.session.commit()
        faculty.interests.append(ri)
    
    db.session.commit()
    return jsonify({'success': True, 'faculty': faculty.to_dict()})

@campus_bp.route('/admin/faculty/<id>', methods=['DELETE'])
@require_role('ADMIN')
def admin_delete_faculty(id):
    faculty = Faculty.query.get(id)
    if faculty:
        db.session.delete(faculty)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Faculty not found'}), 404

@campus_bp.route('/admin/announcements', methods=['POST'])
@require_role('ADMIN')
def admin_save_announcement():
    data = request.get_json() or {}
    import uuid
    from models import AdminUser
    admin = AdminUser.query.first()
    author_admin_id = admin.id if admin else 'ad-001'

    ann = Announcement(
        id=f"ann-{uuid.uuid4().hex[:6]}",
        title=data.get('title'),
        category=data.get('category', 'general'),
        date=data.get('date'),
        content=data.get('content'),
        author_admin_id=author_admin_id,
        priority=data.get('priority', 'normal')
    )
    db.session.add(ann)
    db.session.commit()
    return jsonify({'success': True, 'announcement': ann.to_dict()})

@campus_bp.route('/admin/announcements/<id>', methods=['PUT'])
@require_role('ADMIN')
def admin_update_announcement(id):
    ann = Announcement.query.get(id)
    if not ann:
        return jsonify({'success': False, 'message': 'Announcement not found.'}), 404
        
    data = request.get_json() or {}
    ann.title = data.get('title', ann.title)
    ann.category = data.get('category', ann.category)
    ann.date = data.get('date', ann.date)
    ann.content = data.get('content', ann.content)
    ann.priority = data.get('priority', ann.priority)
    
    db.session.commit()
    return jsonify({'success': True, 'announcement': ann.to_dict()})

@campus_bp.route('/admin/announcements/<id>', methods=['DELETE'])
@require_role('ADMIN')
def admin_delete_announcement(id):
    ann = Announcement.query.get(id)
    if ann:
        db.session.delete(ann)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Announcement not found'}), 404

@campus_bp.route('/admin/events', methods=['POST'])
@require_role('ADMIN')
def admin_save_event():
    data = request.get_json() or {}
    import uuid
    ev = Event(
        id=f"ev-{uuid.uuid4().hex[:6]}",
        title=data.get('title'),
        category=data.get('category'),
        date=data.get('date'),
        time=data.get('time'),
        venue=data.get('location') or data.get('venue') or 'Campus Auditorium',
        spots_left=int(data.get('spotsLeft', 100)),
        description=data.get('description'),
        organizer=data.get('organizer') or 'University Club',
        image_url=data.get('coverImage') or data.get('image') or 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
    )
    db.session.add(ev)
    db.session.commit()
    return jsonify({'success': True, 'event': ev.to_dict()})

@campus_bp.route('/admin/events/<id>', methods=['PUT'])
@require_role('ADMIN')
def admin_update_event(id):
    ev = Event.query.get(id)
    if not ev:
        return jsonify({'success': False, 'message': 'Event not found.'}), 404
        
    data = request.get_json() or {}
    ev.title = data.get('title', ev.title)
    ev.category = data.get('category', ev.category)
    ev.date = data.get('date', ev.date)
    ev.time = data.get('time', ev.time)
    ev.venue = data.get('location') or data.get('venue') or ev.venue
    ev.spots_left = int(data.get('spotsLeft', ev.spots_left))
    ev.description = data.get('description', ev.description)
    ev.organizer = data.get('organizer', ev.organizer)
    ev.image_url = data.get('coverImage') or data.get('image') or ev.image_url
    
    db.session.commit()
    return jsonify({'success': True, 'event': ev.to_dict()})

@campus_bp.route('/admin/events/<id>', methods=['DELETE'])
@require_role('ADMIN')
def admin_delete_event(id):
    ev = Event.query.get(id)
    if ev:
        db.session.delete(ev)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Event not found'}), 404

# ==========================================
# ADMIN DASHBOARD STATS
# ==========================================

@campus_bp.route('/admin/dashboard/stats', methods=['GET'])
@require_role('ADMIN')
def get_dashboard_stats():
    from models import Student, Department, Subject, Resource, Announcement, Event, SystemSetting
    
    student_count = Student.query.count()
    dept_count = Department.query.count()
    subject_count = Subject.query.count()
    resource_count = Resource.query.count()
    announcement_count = Announcement.query.count()
    event_count = Event.query.count()
    
    total_downloads = db.session.query(db.func.sum(Resource.download_count)).scalar() or 0
    settings = {s.config_key: s.config_value for s in SystemSetting.query.all()}
    
    return jsonify({
        'success': True,
        'message': 'Dashboard statistics loaded successfully.',
        'data': {
            'studentsCount': student_count,
            'departmentsCount': dept_count,
            'subjectsCount': subject_count,
            'resourcesCount': resource_count,
            'announcementsCount': announcement_count,
            'eventsCount': event_count,
            'totalDownloads': total_downloads,
            'systemSettings': settings
        }
    })
