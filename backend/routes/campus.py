from flask import Blueprint, request, jsonify, send_file
from models import db, Location, Faculty, HostelMenu, Outpass, Student, Announcement

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

