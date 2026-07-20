from flask import Blueprint, request, jsonify
from models import Subject, ClassSession, Department, Semester, db
from routes.auth import require_role

academics_bp = Blueprint('academics', __name__)

@academics_bp.route('/departments', methods=['GET'])
def get_departments():
    depts = Department.query.all()
    return jsonify([d.to_dict() for d in depts])

@academics_bp.route('/semesters', methods=['GET'])
def get_semesters():
    sems = Semester.query.all()
    return jsonify([s.to_dict() for s in sems])

@academics_bp.route('/academics/subjects', methods=['GET'])
def get_subjects():
    dept_param = request.args.get('department')
    sem_param = request.args.get('semester')
    
    query = Subject.query
    if dept_param:
        query = query.join(Department).filter((Department.name == dept_param) | (Department.code == dept_param))
    if sem_param:
        query = query.join(Semester).filter(Semester.semester_number == int(sem_param))
        
    subjects = query.all()
    return jsonify([sub.to_dict() for sub in subjects])

@academics_bp.route('/academics/subjects/<id>', methods=['GET'])
def get_subject_detail(id):
    sub = Subject.query.get(id)
    if not sub:
        return jsonify({'success': False, 'message': 'Subject not found.'}), 404
    return jsonify(sub.to_dict())

@academics_bp.route('/academics/timetable', methods=['GET'])
def get_timetable():
    day = request.args.get('day')
    if day:
        classes = ClassSession.query.filter_by(day=day).all()
    else:
        classes = ClassSession.query.all()
    return jsonify([cls.to_dict() for cls in classes])

# ==========================================
# ADMIN CRUD FOR SUBJECTS
# ==========================================

@academics_bp.route('/admin/subjects', methods=['POST'])
@require_role('ADMIN')
def create_subject():
    data = request.get_json() or {}
    code = data.get('code')
    name = data.get('name')
    credits = data.get('credits')
    subject_type = data.get('subjectType', 'Core')
    dept_name = data.get('department')
    sem_number = data.get('semester')
    description = data.get('description', '')
    outcomes = data.get('learningOutcomes', '')
    books = data.get('referenceBooks', '')

    if not code or not name or credits is None or not dept_name or not sem_number:
        return jsonify({'success': False, 'message': 'Missing required fields.', 'errors': {}}), 400

    # Check duplicate code
    if Subject.query.filter_by(code=code).first():
        return jsonify({'success': False, 'message': 'Subject code already exists.', 'errors': {}}), 400

    # Resolve Dept
    dept = Department.query.filter_by(name=dept_name).first()
    if not dept:
        dept = Department.query.filter_by(code=dept_name).first()
    if not dept:
        # Auto-create dept
        dept_code = "".join([w[0] for w in dept_name.split() if w.isalnum()]).upper()[:20]
        dept = Department(name=dept_name, code=dept_code)
        db.session.add(dept)
        db.session.commit()

    # Resolve Sem
    sem = Semester.query.filter_by(semester_number=int(sem_number)).first()
    if not sem:
        sem = Semester(semester_number=int(sem_number), academic_year='2025-2026')
        db.session.add(sem)
        db.session.commit()

    import uuid
    sub_id = f"s-{uuid.uuid4().hex[:6]}"
    sub = Subject(
        id=sub_id,
        code=code,
        name=name,
        credits=int(credits),
        subject_type=subject_type,
        department_id=dept.id,
        semester_id=sem.id,
        description=description,
        learning_outcomes=outcomes,
        reference_books=books
    )
    db.session.add(sub)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Subject created successfully.',
        'data': sub.to_dict()
    }), 201

@academics_bp.route('/admin/subjects/<id>', methods=['PUT'])
@require_role('ADMIN')
def update_subject(id):
    sub = Subject.query.get(id)
    if not sub:
        return jsonify({'success': False, 'message': 'Subject not found.', 'errors': {}}), 404

    data = request.get_json() or {}
    
    if 'code' in data:
        code = data['code']
        # Check duplicate
        existing = Subject.query.filter_by(code=code).first()
        if existing and existing.id != sub.id:
            return jsonify({'success': False, 'message': 'Subject code already exists.', 'errors': {}}), 400
        sub.code = code
        
    if 'name' in data:
        sub.name = data['name']
    if 'credits' in data:
        sub.credits = int(data['credits'])
    if 'subjectType' in data:
        sub.subject_type = data['subjectType']
    if 'description' in data:
        sub.description = data['description']
    if 'learningOutcomes' in data:
        sub.learning_outcomes = data['learningOutcomes']
    if 'referenceBooks' in data:
        sub.reference_books = data['referenceBooks']

    if 'department' in data:
        dept_name = data['department']
        dept = Department.query.filter_by(name=dept_name).first()
        if not dept:
            dept = Department.query.filter_by(code=dept_name).first()
        if not dept:
            dept_code = "".join([w[0] for w in dept_name.split() if w.isalnum()]).upper()[:20]
            dept = Department(name=dept_name, code=dept_code)
            db.session.add(dept)
            db.session.commit()
        sub.department_id = dept.id

    if 'semester' in data:
        sem_number = int(data['semester'])
        sem = Semester.query.filter_by(semester_number=sem_number).first()
        if not sem:
            sem = Semester(semester_number=sem_number, academic_year='2025-2026')
            db.session.add(sem)
            db.session.commit()
        sub.semester_id = sem.id

    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Subject updated successfully.',
        'data': sub.to_dict()
    })

@academics_bp.route('/admin/subjects/<id>', methods=['DELETE'])
@require_role('ADMIN')
def delete_subject(id):
    sub = Subject.query.get(id)
    if not sub:
        return jsonify({'success': False, 'message': 'Subject not found.'}), 404
    db.session.delete(sub)
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Subject deleted successfully.'
    })
