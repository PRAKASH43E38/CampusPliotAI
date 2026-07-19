from flask import Blueprint, request, jsonify, send_file
from models import db, Location, Faculty, HostelMenu, Outpass, Student, Announcement, Event

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
    dept = request.args.get('department')
    if dept:
        faculty_members = Faculty.query.filter_by(department=dept).all()
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
def get_outpasses():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    outpasses = Outpass.query.filter_by(student_id=student_id).all()
    return jsonify([op.to_dict() for op in outpasses])

@campus_bp.route('/hostel/outpass', methods=['POST'])
def create_outpass():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json() or {}
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    reason = data.get('reason')

    if not start_date or not end_date or not reason:
        return jsonify({'error': 'Missing outpass request fields'}), 400

    outpass = Outpass(
        student_id=student_id,
        block=student.hostel_block,
        room=student.hostel_room,
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

# ----------------------------------------------------
# ADMIN MANAGEMENT ENDPOINTS
# ----------------------------------------------------
@campus_bp.route('/admin/students', methods=['GET'])
def admin_get_students():
    students = Student.query.all()
    return jsonify([st.to_dict() for st in students])

@campus_bp.route('/admin/students', methods=['POST'])
def admin_save_student():
    data = request.get_json() or {}
    student_id = data.get('id')
    student = Student.query.get(student_id) if student_id else None
    
    if not student:
        import uuid
        student = Student(id=f"st-{uuid.uuid4().hex[:6]}")
        db.session.add(student)
        
    student.name = data.get('name', student.name if student_id else 'New Student')
    student.roll_no = data.get('rollNo', student.roll_no if student_id else '')
    student.department = data.get('department', student.department if student_id else '')
    student.course = data.get('course', student.course if student_id else '')
    student.semester = int(data.get('semester', student.semester if student_id else 1))
    student.email = data.get('email', student.email if student_id else '')
    student.attendance_overall = float(data.get('attendanceOverall', student.attendance_overall if student_id else 80.0))
    student.cgpa = float(data.get('cgpa', student.cgpa if student_id else 8.0))
    student.hostel_block = data.get('hostelBlock', student.hostel_block if student_id else '')
    student.hostel_room = data.get('hostelRoom', student.hostel_room if student_id else '')
    
    db.session.commit()
    return jsonify({'success': True, 'student': student.to_dict()})

@campus_bp.route('/admin/students/<id>', methods=['DELETE'])
def admin_delete_student(id):
    student = Student.query.get(id)
    if student:
        db.session.delete(student)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Student not found'}), 404

@campus_bp.route('/admin/faculty', methods=['POST'])
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
    faculty.department = data.get('department', faculty.department if fac_id else '')
    faculty.email = data.get('email', faculty.email if fac_id else '')
    faculty.cabin = data.get('cabin', faculty.cabin if fac_id else '')
    faculty.office_hours = data.get('officeHours', faculty.office_hours if fac_id else '09:00 AM - 04:30 PM')
    faculty._research_interests = '[]' # Setup dummy json string
    faculty.research_interests = data.get('researchInterests', faculty.research_interests if fac_id else [])
    
    db.session.commit()
    return jsonify({'success': True, 'faculty': faculty.to_dict()})

@campus_bp.route('/admin/faculty/<id>', methods=['DELETE'])
def admin_delete_faculty(id):
    faculty = Faculty.query.get(id)
    if faculty:
        db.session.delete(faculty)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Faculty not found'}), 404

@campus_bp.route('/admin/announcements', methods=['POST'])
def admin_save_announcement():
    data = request.get_json() or {}
    import uuid
    ann = Announcement(
        id=f"ann-{uuid.uuid4().hex[:6]}",
        title=data.get('title'),
        category=data.get('category', 'general'),
        date=data.get('date'),
        content=data.get('content'),
        author=data.get('author'),
        priority=data.get('priority', 'normal')
    )
    db.session.add(ann)
    db.session.commit()
    return jsonify({'success': True, 'announcement': ann.to_dict()})

@campus_bp.route('/admin/announcements/<id>', methods=['DELETE'])
def admin_delete_announcement(id):
    ann = Announcement.query.get(id)
    if ann:
        db.session.delete(ann)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Announcement not found'}), 404

@campus_bp.route('/admin/events', methods=['POST'])
def admin_save_event():
    data = request.get_json() or {}
    import uuid
    ev = Event(
        id=f"ev-{uuid.uuid4().hex[:6]}",
        title=data.get('title'),
        category=data.get('category'),
        date=data.get('date'),
        time=data.get('time'),
        location=data.get('location'),
        spots_left=int(data.get('spotsLeft', 100)),
        total_spots=int(data.get('totalSpots', 100)),
        description=data.get('description'),
        organizer=data.get('organizer'),
        cover_image=data.get('coverImage', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80')
    )
    db.session.add(ev)
    db.session.commit()
    return jsonify({'success': True, 'event': ev.to_dict()})

@campus_bp.route('/admin/events/<id>', methods=['DELETE'])
def admin_delete_event(id):
    ev = Event.query.get(id)
    if ev:
        db.session.delete(ev)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Event not found'}), 404


