import uuid
import os
import time
from flask import Blueprint, request, jsonify, send_file
from models import db, Student, Resource, ResourceCategory, Subject, Department, Semester, AdminUser
from routes.auth import require_role, allowed_file

resources_bp = Blueprint('resources', __name__)

@resources_bp.route('/resources', methods=['GET'])
def get_resources():
    q = request.args.get('q')
    category_code = request.args.get('category')
    dept_name = request.args.get('department')
    sem_number = request.args.get('semester')
    
    query = Resource.query
    
    # Filtering
    if category_code and category_code != 'All':
        query = query.join(ResourceCategory).filter(ResourceCategory.code == category_code)
    if dept_name and dept_name != 'All':
        query = query.join(Department).filter((Department.name == dept_name) | (Department.code == dept_name))
    if sem_number and sem_number != 'All':
        query = query.join(Semester).filter(Semester.semester_number == int(sem_number))
        
    # Searching
    if q:
        search_query = f"%{q}%"
        query = query.filter(
            (Resource.title.like(search_query)) | 
            (Resource.description.like(search_query)) |
            (Resource.tags.like(search_query))
        )
        
    # Sorting
    sort_by = request.args.get('sort', 'date')
    if sort_by == 'title':
        query = query.order_by(Resource.title.asc())
    elif sort_by == 'downloads':
        query = query.order_by(Resource.download_count.desc())
    else:
        query = query.order_by(Resource.upload_date.desc())
        
    resources = query.all()
    return jsonify([res.to_dict() for res in resources])

@resources_bp.route('/resources', methods=['POST'])
@require_role('ADMIN')
def add_resource():
    # Supports JSON payload (simulated mock upload) AND multipart/form-data upload
    if request.is_json:
        data = request.get_json() or {}
        title = data.get('title')
        res_type = data.get('type')
        subject_code = data.get('subjectCode')
        subject_name = data.get('subjectName')
        semester = data.get('semester')
        file_size = data.get('fileSize', '1.5 MB')
        department_name = data.get('department', 'Computer Science & Engineering')
        description = data.get('description', '')
        tags = data.get('tags', '')
        file_url = data.get('fileUrl', '')
        
        file_name = file_url.split('/')[-1] if file_url else f"{title.replace(' ', '_').lower()}.pdf"
        file_path = file_url if file_url else f"/uploads/{file_name}"
        
        # Parse size string to bytes
        def parse_file_size(size_str):
            if not size_str:
                return 0
            try:
                size_str = size_str.upper().strip()
                if 'MB' in size_str:
                    return int(float(size_str.replace('MB', '').strip()) * 1024 * 1024)
                if 'KB' in size_str:
                    return int(float(size_str.replace('KB', '').strip()) * 1024)
                return int(float(size_str))
            except Exception:
                return 1024 * 1024
        file_size_bytes = parse_file_size(file_size)
        file_type = file_name.split('.')[-1].upper() if '.' in file_name else 'PDF'
    else:
        title = request.form.get('title')
        res_type = request.form.get('type')
        subject_code = request.form.get('subjectCode')
        subject_name = request.form.get('subjectName')
        semester = request.form.get('semester')
        department_name = request.form.get('department', 'Computer Science & Engineering')
        description = request.form.get('description', '')
        tags = request.form.get('tags', '')
        
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file part in request.'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No selected file.'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'success': False, 'message': 'Invalid file type.'}), 400
            
        from werkzeug.utils import secure_filename
        filename = secure_filename(file.filename)
        unique_filename = f"resource_{int(time.time())}_{filename}"
        
        uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
            
        file_path = os.path.join(uploads_dir, unique_filename)
        file.save(file_path)
        
        file_size_bytes = os.path.getsize(file_path)
        if file_size_bytes > 10 * 1024 * 1024:
            os.remove(file_path)
            return jsonify({'success': False, 'message': 'File size exceeds the 10MB limit.'}), 400
            
        file_name = filename
        file_type = file_name.split('.')[-1].upper() if '.' in file_name else 'PDF'
        file_url = f"/api/uploads/{unique_filename}"
        file_path = file_path

    if not title or not res_type or not subject_code or not subject_name or not semester:
        return jsonify({'success': False, 'message': 'Missing mandatory fields.'}), 400

    # Resolve Department
    dept = Department.query.filter_by(name=department_name).first()
    if not dept:
        dept_code = "".join([w[0] for w in department_name.split() if w.isalnum()]).upper()[:20]
        dept = Department(name=department_name, code=dept_code)
        db.session.add(dept)
        db.session.commit()

    # Resolve Semester
    sem = Semester.query.filter_by(semester_number=int(semester)).first()
    if not sem:
        sem = Semester(semester_number=int(semester), academic_year='2025-2026')
        db.session.add(sem)
        db.session.commit()

    # Resolve Subject
    subject = Subject.query.filter_by(code=subject_code).first()
    if not subject:
        subject = Subject(
            id=f"s-{uuid.uuid4().hex[:6]}",
            code=subject_code,
            name=subject_name,
            credits=3,
            department_id=dept.id,
            semester_id=sem.id
        )
        db.session.add(subject)
        db.session.commit()

    admin = AdminUser.query.first()
    uploaded_by_admin_id = admin.id if admin else 'ad-001'
    res_id = f"res-{uuid.uuid4().hex[:6]}"

    # Resolve ResourceCategory
    category = ResourceCategory.query.filter_by(code=res_type).first()
    if not category:
        category = ResourceCategory.query.filter_by(code='notes').first()
        if not category:
            category = ResourceCategory(name='Lecture Notes', code='notes')
            db.session.add(category)
            db.session.commit()

    resource = Resource(
        id=res_id,
        title=title,
        category_id=category.id,
        subject_id=subject.id,
        department_id=dept.id,
        semester_id=sem.id,
        file_name=file_name,
        file_path=file_path,
        file_size_bytes=file_size_bytes,
        file_type=file_type,
        download_count=0,
        uploaded_by_admin_id=uploaded_by_admin_id,
        description=description,
        tags=tags,
        status='APPROVED'
    )
    db.session.add(resource)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Resource added successfully.',
        'resource': resource.to_dict()
    }), 201

@resources_bp.route('/admin/resources/<id>', methods=['PUT'])
@require_role('ADMIN')
def edit_resource(id):
    resource = Resource.query.get(id)
    if not resource:
        return jsonify({'success': False, 'message': 'Resource not found.'}), 404
        
    data = request.get_json() or {}
    resource.title = data.get('title', resource.title)
    
    if 'type' in data:
        cat = ResourceCategory.query.filter_by(code=data['type']).first()
        if cat:
            resource.category_id = cat.id
            
    if 'fileSize' in data:
        def parse_file_size(size_str):
            if not size_str:
                return 0
            try:
                size_str = size_str.upper().strip()
                if 'MB' in size_str:
                    return int(float(size_str.replace('MB', '').strip()) * 1024 * 1024)
                if 'KB' in size_str:
                    return int(float(size_str.replace('KB', '').strip()) * 1024)
                return int(float(size_str))
            except Exception:
                return 1024 * 1024
        resource.file_size_bytes = parse_file_size(data['fileSize'])
        
    resource.description = data.get('description', resource.description)
    resource.tags = data.get('tags', resource.tags)
    
    if 'fileUrl' in data:
        file_url = data['fileUrl']
        resource.file_path = file_url
        resource.file_name = file_url.split('/')[-1] if file_url else resource.file_name
        resource.file_type = resource.file_name.split('.')[-1].upper() if '.' in resource.file_name else resource.file_type

    if 'department' in data:
        dept = Department.query.filter_by(name=data['department']).first()
        if not dept:
            dept_code = "".join([w[0] for w in data['department'].split() if w.isalnum()]).upper()[:20]
            dept = Department(name=data['department'], code=dept_code)
            db.session.add(dept)
            db.session.commit()
        resource.department_id = dept.id

    if 'semester' in data:
        sem = Semester.query.filter_by(semester_number=int(data['semester'])).first()
        if not sem:
            sem = Semester(semester_number=int(data['semester']), academic_year='2025-2026')
            db.session.add(sem)
            db.session.commit()
        resource.semester_id = sem.id

    if 'subjectCode' in data or 'subjectName' in data:
        sub_code = data.get('subjectCode', Subject.query.get(resource.subject_id).code if resource.subject_id else '')
        sub_name = data.get('subjectName', Subject.query.get(resource.subject_id).name if resource.subject_id else '')
        
        subject = Subject.query.filter_by(code=sub_code).first()
        if not subject:
            subject = Subject(
                id=f"s-{uuid.uuid4().hex[:6]}",
                code=sub_code,
                name=sub_name,
                credits=3,
                department_id=resource.department_id,
                semester_id=resource.semester_id
            )
            db.session.add(subject)
            db.session.commit()
        resource.subject_id = subject.id
    
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Resource updated successfully.',
        'resource': resource.to_dict()
    })

@resources_bp.route('/admin/resources/<id>', methods=['DELETE'])
@require_role('ADMIN')
def delete_resource(id):
    resource = Resource.query.get(id)
    if not resource:
        return jsonify({'success': False, 'message': 'Resource not found.'}), 404
        
    db.session.delete(resource)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Resource deleted successfully.'})

@resources_bp.route('/resources/save', methods=['POST'])
@require_role('STUDENT')
def save_resource():
    student_id = request.headers.get('X-Student-Id')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'success': False, 'message': 'Student not found.'}), 404

    data = request.get_json() or {}
    resource_id = data.get('resourceId')
    resource = Resource.query.get(resource_id)
    if not resource:
        return jsonify({'success': False, 'message': 'Resource not found.'}), 404

    if resource in student.saved_resources:
        student.saved_resources.remove(resource)
        message = 'Removed bookmark'
    else:
        student.saved_resources.append(resource)
        message = 'Saved bookmark'

    db.session.commit()
    return jsonify({
        'success': True,
        'message': message,
        'student': student.to_dict()
    })

@resources_bp.route('/resources/download/<id>', methods=['GET'])
def download_resource(id):
    resource = Resource.query.get(id)
    if not resource:
        return jsonify({'success': False, 'message': 'Resource not found.'}), 404
        
    resource.download_count += 1
    db.session.commit()
    
    # Path traversal protection
    if '..' in resource.file_name or resource.file_name.startswith('/') or resource.file_name.startswith('\\'):
        return jsonify({'success': False, 'message': 'Forbidden file path.'}), 403
        
    if os.path.exists(resource.file_path):
        return send_file(resource.file_path, as_attachment=True, download_name=resource.file_name)
        
    # Serve mock if it's a browser request that isn't backed by a physical file yet
    return jsonify({
        'success': True,
        'message': f"Downloading {resource.file_name}",
        'fileUrl': resource.file_path
    })
