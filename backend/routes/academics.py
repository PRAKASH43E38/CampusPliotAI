from flask import Blueprint, request, jsonify
from models import Subject, ClassSession

academics_bp = Blueprint('academics', __name__)

@academics_bp.route('/subjects', methods=['GET'])
def get_subjects():
    subjects = Subject.query.all()
    return jsonify([sub.to_dict() for sub in subjects])

@academics_bp.route('/timetable', methods=['GET'])
def get_timetable():
    day = request.args.get('day')
    if day:
        classes = ClassSession.query.filter_by(day=day).all()
    else:
        classes = ClassSession.query.all()
    return jsonify([cls.to_dict() for cls in classes])
