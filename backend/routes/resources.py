from flask import Blueprint, request, jsonify
from models import db, Student, Resource

resources_bp = Blueprint('resources', __name__)

@resources_bp.route('/resources', methods=['GET'])
def get_resources():
    resources = Resource.query.all()
    return jsonify([res.to_dict() for res in resources])

@resources_bp.route('/resources', methods=['POST'])
def add_resource():
    data = request.get_json() or {}
    title = data.get('title')
    res_type = data.get('type')
    subject_code = data.get('subjectCode')
    subject_name = data.get('subjectName')
    semester = data.get('semester')
    file_size = data.get('fileSize', '1.5 MB')
    added_by = data.get('addedBy', 'Academic Admin')
    department = data.get('department')
    description = data.get('description')
    tags = data.get('tags')
    file_url = data.get('fileUrl')

    if not title or not res_type or not subject_code or not subject_name or not semester:
        return jsonify({'error': 'Missing resource fields'}), 400

    # Auto-generate resource ID
    import uuid
    res_id = f"res-{uuid.uuid4().hex[:6]}"

    resource = Resource(
        id=res_id,
        title=title,
        type=res_type,
        subject_code=subject_code,
        subject_name=subject_name,
        semester=int(semester),
        file_size=file_size,
        download_count=0,
        added_by=added_by,
        department=department,
        description=description,
        tags=tags,
        file_url=file_url
    )
    db.session.add(resource)
    db.session.commit()

    return jsonify({
        'success': True,
        'resource': resource.to_dict()
    }), 201

@resources_bp.route('/admin/resources/<id>', methods=['PUT'])
def edit_resource(id):
    resource = Resource.query.get(id)
    if not resource:
        return jsonify({'error': 'Resource not found'}), 404
        
    data = request.get_json() or {}
    resource.title = data.get('title', resource.title)
    resource.type = data.get('type', resource.type)
    resource.subject_code = data.get('subjectCode', resource.subject_code)
    resource.subject_name = data.get('subjectName', resource.subject_name)
    resource.semester = int(data.get('semester', resource.semester))
    resource.department = data.get('department', resource.department)
    resource.description = data.get('description', resource.description)
    resource.tags = data.get('tags', resource.tags)
    resource.file_url = data.get('fileUrl', resource.file_url)
    
    db.session.commit()
    return jsonify({
        'success': True,
        'resource': resource.to_dict()
    })

@resources_bp.route('/admin/resources/<id>', methods=['DELETE'])
def delete_resource(id):
    resource = Resource.query.get(id)
    if not resource:
        return jsonify({'error': 'Resource not found'}), 404
        
    db.session.delete(resource)
    db.session.commit()
    return jsonify({'success': True})

@resources_bp.route('/resources/save', methods=['POST'])
def save_resource():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json() or {}
    resource_id = data.get('resourceId')
    resource = Resource.query.get(resource_id)
    if not resource:
        return jsonify({'error': 'Resource not found'}), 404

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
