import os
import json
from config import Config
from flask import Blueprint, request, jsonify
from models import db, Student, Subject, ClassSession, Faculty, Event, Club, Location, Placement, HostelMenu, Department, Semester
import google.generativeai as genai

ai_bp = Blueprint('ai', __name__)

def get_campus_context(student_id):
    """
    Gather campus database states to ground the Gemini AI models.
    """
    student = Student.query.get(student_id)
    subjects = Subject.query.all()
    classes = ClassSession.query.all()
    faculty = Faculty.query.all()
    events = Event.query.all()
    clubs = Club.query.all()
    locations = Location.query.all()
    placements = Placement.query.all()
    menus = HostelMenu.query.all()

    context = []
    
    if student:
        profile_name = student.profile.full_name if student.profile else 'New Student'
        dept_name = student.department.name if student.department else ''
        course_name = student.profile.course if student.profile else ''
        sem_num = student.semester.semester_number if student.semester else 1
        attendance = student.profile.attendance if student.profile else 0.0
        cgpa = student.profile.cgpa if student.profile else 0.0
        block = student.profile.hostel_block if student.profile else ''
        room = student.profile.hostel_room if student.profile else ''
        
        context.append(f"Student: Name is {profile_name}, roll number {student.roll_no}, in {dept_name}, course {course_name}, currently in Semester {sem_num}. Email is {student.email}. Overall attendance is {attendance}% and CGPA is {cgpa}/10. Hostel Block is {block}, room {room}.")

    context.append("\nClass Timetable Schedules:")
    for c in classes:
        # Resolve subject name/code from relation
        subject = Subject.query.get(c.subject_id) if c.subject_id else None
        sub_name = subject.name if subject else 'N/A'
        sub_code = subject.code if subject else 'N/A'
        fac_name = c.faculty.name if c.faculty else 'N/A'
        context.append(f"- {c.day} {c.time_start}-{c.time_end}: {sub_name} ({sub_code}) taught by {fac_name} in {c.room}")

    context.append("\nRegistered Courses Details:")
    for s in subjects:
        s_data = s.to_dict(student_id=student_id)
        cia = s_data['ciaMarks']
        context.append(f"- {s_data['name']} ({s_data['code']}): {s_data['credits']} credits, attendance: {s_data['attendance']}%, CIA 1: {cia['cia1']}/{cia['max']}, CIA 2: {cia['cia2']}/{cia['max']}, CIA 3: {cia['cia3']}/{cia['max']}. Syllabus units: {', '.join(s_data['syllabusUnits'])}")

    context.append("\nFaculty Members Cabin Directory:")
    for f in faculty:
        dept = Department.query.get(f.department_id) if f.department_id else None
        dept_name = dept.name if dept else 'N/A'
        interests_str = ', '.join([i.interest_name for i in f.interests])
        context.append(f"- {f.name} ({f.designation}, {dept_name}): Office Cabin is {f.cabin}, office hours: {f.office_hours}, email: {f.email}, research: {interests_str}")

    context.append("\nCampus Locations Navigation Landmarks:")
    for loc in locations:
        context.append(f"- {loc.name} ({loc.type}): Located at {loc.block}, {loc.floor}, Room: {loc.room_no or 'N/A'}. Nearest parking: {loc.nearest_parking}. Description: {loc.description}")

    context.append("\nUpcoming Campus Events:")
    for ev in events:
        context.append(f"- {ev.title} (Category: {ev.category}): Date {ev.date} at {ev.time} at {ev.venue}. Organizer: {ev.organizer}. Spots left: {ev.spots_left}. Description: {ev.description}")

    context.append("\nStudent Clubs Hub:")
    for cl in clubs:
        fac_coord = cl.faculty_coordinator.name if cl.faculty_coordinator else 'N/A'
        context.append(f"- {cl.name} ({cl.category}): coordinator: {cl.student_coordinator}, faculty: {fac_coord}, members: {len(cl.members)}. Requirements: {cl.requirements}. Description: {cl.description}")

    context.append("\nActive Recruitment & Placements:")
    for pl in placements:
        context.append(f"- {pl.company} ({pl.role}): package is {pl.ctc}, eligibility: {pl.eligibility}, deadline: {pl.deadline}, status: {pl.status}, type: {pl.type}")

    context.append("\nHostel Dining Mess Menu:")
    for m in menus:
        context.append(f"- {m.day}: Breakfast: {m.breakfast} | Lunch: {m.lunch} | Snack: {m.snack} | Dinner: {m.dinner}")

    return "\n".join(context)


# Fuzzy/Rule-based local fallback responses grounded in MySQL (PRD requirement)
def get_local_fallback_response(user_query, student_id='st-0982'):
    from models import AIKnowledgeBase, Student
    query = user_query.lower()
    
    # Try to find a trigger key in the AIKnowledgeBase table
    kb_items = AIKnowledgeBase.query.all()
    for item in kb_items:
        if item.trigger_key.lower() in query:
            return item.response

    # Fallback to database-driven student context summary
    student = Student.query.get(student_id)
    if student:
        profile_name = student.profile.full_name if student.profile else 'Student'
        dept_name = student.department.name if student.department else 'N/A'
        sem_num = student.semester.semester_number if student.semester else 1
        cgpa = student.profile.cgpa if student.profile else 0.0
        attendance = student.profile.attendance if student.profile else 0.0
        
        return (f"### **Campus Pilot Assistant Consultation**\n\n"
                f"I have cross-referenced the university knowledge vaults for your inquiry regarding: **\"{user_query}\"**.\n\n"
                f"*   **User Identity**: {profile_name}, {dept_name}, Semester {sem_num}.\n"
                f"*   **Campus Status**: Active session (Mon-Fri 09:00 AM - 04:30 PM).\n"
                f"*   **Academic Records**: CGPA {cgpa}/10, active attendance {attendance}%.\n\n"
                f"*💡 Action recommended:* You can find full departmental and administrative details by visiting the specific modules (Academics, Faculty, Campus Map, or Resources) in the sidebar. Let me know if you would like me to retrieve specific room locations, faculty consultation timings, or exam papers!")

    return f"I have received your inquiry: \"{user_query}\". Currently, Gemini API is offline, and I could not match this query to a local database knowledge entry. Please ask about classes, locations, faculty, or hostel menu."


@ai_bp.route('/ai/chat', methods=['POST'])
def chat():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    data = request.get_json() or {}
    message = data.get('message', '')

    if not message:
        return jsonify({'error': 'Message is required'}), 400

    api_key = Config.GEMINI_API_KEY

    if api_key:
        try:
            # Gather fresh grounded context from db state
            context = get_campus_context(student_id)
            
            genai.configure(api_key=api_key, transport='rest')
            model = genai.GenerativeModel('gemini-1.5-pro')
            
            prompt = (
                "You are CampusPilot AI, a professional, institutional-level AI campus companion for a university. "
                "You are helping a student named Devashish Sharma. Answer their questions accurately based on "
                "the grounding campus database context provided below. Keep your responses concise, highly structured, "
                "formal, and use markdown formatted lists or bullet points.\n\n"
                "Grounding Database Context:\n"
                f"{context}\n\n"
                f"User Inquiry: {message}"
            )
            response = model.generate_content(prompt)
            return jsonify({'response': response.text})
        except Exception as e:
            print("Gemini API call failed, falling back to local analyzer:", e)
            
    # Local fallback
    fallback_text = get_local_fallback_response(message, student_id)
    return jsonify({'response': fallback_text})
