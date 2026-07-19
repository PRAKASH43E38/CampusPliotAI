from flask import Blueprint, request, jsonify
from models import db, Student, Event, Club, Placement
import os
import google.generativeai as genai

engagement_bp = Blueprint('engagement', __name__)

@engagement_bp.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([ev.to_dict() for ev in events])

@engagement_bp.route('/events/register', methods=['POST'])
def register_event():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json() or {}
    event_id = data.get('eventId')
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    if event in student.registered_events:
        return jsonify({'message': 'Already registered for this event'}), 200

    if event.spots_left <= 0:
        return jsonify({'error': 'No spots left for this event'}), 400

    student.registered_events.append(event)
    event.spots_left -= 1
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Successfully registered for event',
        'student': student.to_dict(),
        'event': event.to_dict()
    })

@engagement_bp.route('/events/unregister', methods=['POST'])
def unregister_event():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json() or {}
    event_id = data.get('eventId')
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404

    if event not in student.registered_events:
        return jsonify({'message': 'Not registered for this event'}), 200

    student.registered_events.remove(event)
    event.spots_left += 1
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Successfully unregistered from event',
        'student': student.to_dict(),
        'event': event.to_dict()
    })

@engagement_bp.route('/clubs', methods=['GET'])
def get_clubs():
    clubs = Club.query.all()
    return jsonify([cl.to_dict() for cl in clubs])

@engagement_bp.route('/clubs/join', methods=['POST'])
def join_club():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json() or {}
    club_id = data.get('clubId')
    club = Club.query.get(club_id)
    if not club:
        return jsonify({'error': 'Club not found'}), 404

    if club in student.joined_clubs:
        return jsonify({'message': 'Already joined this club'}), 200

    student.joined_clubs.append(club)
    club.members_count += 1
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Successfully joined club',
        'student': student.to_dict(),
        'club': club.to_dict()
    })

@engagement_bp.route('/clubs/leave', methods=['POST'])
def leave_club():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json() or {}
    club_id = data.get('clubId')
    club = Club.query.get(club_id)
    if not club:
        return jsonify({'error': 'Club not found'}), 404

    if club not in student.joined_clubs:
        return jsonify({'message': 'Not a member of this club'}), 200

    student.joined_clubs.remove(club)
    club.members_count -= 1
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Successfully left club',
        'student': student.to_dict(),
        'club': club.to_dict()
    })

@engagement_bp.route('/placements', methods=['GET'])
def get_placements():
    placements = Placement.query.all()
    return jsonify([pl.to_dict() for pl in placements])

@engagement_bp.route('/placements/apply', methods=['POST'])
def apply_placement():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    student = Student.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    data = request.get_json() or {}
    placement_id = data.get('placementId')
    placement = Placement.query.get(placement_id)
    if not placement:
        return jsonify({'error': 'Placement opportunity not found'}), 404

    if placement in student.applied_placements:
        return jsonify({'message': 'Already applied to this drive'}), 200

    student.applied_placements.append(placement)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Successfully applied to drive',
        'student': student.to_dict()
    })

@engagement_bp.route('/placements/score-resume', methods=['POST'])
def score_resume():
    data = request.get_json() or {}
    resume_text = data.get('resumeText', '')
    
    if not resume_text.strip():
        return jsonify({'error': 'Resume content cannot be empty'}), 400

    api_key = os.environ.get('GEMINI_API_KEY', '')

    if api_key:
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')
            prompt = (
                "You are an expert ATS (Applicant Tracking System) reviewer and hiring manager. "
                "Analyze the following resume text. Output a JSON object only. Do not wrap it in markdown block. "
                "The JSON object must have keys: "
                "'score' (integer 0-100), "
                "'formatRating' (string: Excellent, Good, Fair, Poor), "
                "'keyStrengths' (list of strings, max 3), "
                "'improvements' (list of strings, max 3).\n\n"
                f"Resume Content:\n{resume_text}"
            )
            response = model.generate_content(prompt)
            # Remove any markdown backticks if returned
            text = response.text.strip()
            if text.startswith("```json"):
                text = text.split("```json")[1].split("```")[0].strip()
            elif text.startswith("```"):
                text = text.split("```")[1].split("```")[0].strip()
            
            import json
            result = json.loads(text)
            return jsonify(result)
        except Exception as e:
            print("Gemini resume audit error:", e)
            # Fallback to local analyzer if Gemini fails

    # Fallback/Rule-based scanner
    score = 70
    strengths = []
    improvements = []
    
    # Simple rule based checks
    lower_text = resume_text.lower()
    
    # Check sections
    has_projects = 'project' in lower_text
    has_skills = 'skill' in lower_text or 'technologies' in lower_text
    has_education = 'education' in lower_text or 'b.tech' in lower_text or 'university' in lower_text
    has_experience = 'experience' in lower_text or 'intern' in lower_text or 'work' in lower_text

    if has_projects:
        score += 10
        strengths.append("Contains project descriptions")
    else:
        improvements.append("Add a detailed Projects section with github/live links")

    if has_skills:
        score += 10
        strengths.append("Includes a dedicated Skills/Technical list")
    else:
        improvements.append("Group your technical skills explicitly (Languages, Frameworks, Tools)")

    if has_experience:
        score += 5
        strengths.append("Mentions practical experience / internships")
    else:
        improvements.append("Add internships or open-source contribution experience")

    if has_education:
        score += 5
    else:
        improvements.append("Add your Education timeline and current CGPA")

    # Keyword check
    keywords = ['react', 'python', 'sql', 'git', 'flask', 'javascript', 'docker', 'aws', 'ml', 'machine learning']
    keyword_count = sum(1 for kw in keywords if kw in lower_text)
    if keyword_count >= 4:
        score += 5
        strengths.append("Strong alignment with modern software engineering technologies")
    elif keyword_count > 0:
        score += 2
    else:
        improvements.append("Incorporate standard industry keywords (e.g. Git, REST APIs, Databases)")

    # Bound score
    score = min(max(score, 45), 98)
    
    if score >= 85:
        rating = "Excellent"
    elif score >= 70:
        rating = "Good"
    elif score >= 55:
        rating = "Fair"
    else:
        rating = "Poor"

    if not strengths:
        strengths = ["Correct contact formatting", "Standard readable font layout"]
    if not improvements:
        improvements = ["Add links to your professional Github/LinkedIn handles", "Quantify bullet points using standard metrics (e.g., improved load-times by 30%)"]

    return jsonify({
        'score': score,
        'formatRating': rating,
        'keyStrengths': strengths[:3],
        'improvements': improvements[:3]
    })
