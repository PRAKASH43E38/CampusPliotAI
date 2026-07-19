from flask import Blueprint, request, jsonify
from models import Student, Subject, ClassSession, Faculty, Event, Club, Location, Placement, HostelMenu
import os
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
        context.append(f"Student: Name is {student.name}, roll number {student.roll_no}, in {student.department}, course {student.course}, currently in Semester {student.semester}. Email is {student.email}. Overall attendance is {student.attendance_overall}% and CGPA is {student.cgpa}/10. Hostel Block is {student.hostel_block}, room {student.hostel_room}.")

    context.append("\nClass Timetable Schedules:")
    for c in classes:
        context.append(f"- {c.day} {c.time_start}-{c.time_end}: {c.subject_name} ({c.subject_code}) taught by {c.faculty_name} in {c.room}")

    context.append("\nRegistered Courses Details:")
    for s in subjects:
        context.append(f"- {s.name} ({s.code}): {s.credits} credits, attendance: {s.attendance}%, CIA 1: {s.cia1}/{s.cia_max}, CIA 2: {s.cia2}/{s.cia_max}, CIA 3: {s.cia3}/{s.cia_max}. Syllabus units: {', '.join(s.syllabus_units)}")

    context.append("\nFaculty Members Cabin Directory:")
    for f in faculty:
        context.append(f"- {f.name} ({f.designation}, {f.department}): Office Cabin is {f.cabin}, office hours: {f.office_hours}, email: {f.email}, research: {', '.join(f.research_interests)}")

    context.append("\nCampus Locations Navigation Landmarks:")
    for loc in locations:
        context.append(f"- {loc.name} ({loc.type}): Located at {loc.block}, {loc.floor}, Room: {loc.room_no or 'N/A'}. Nearest parking: {loc.nearest_parking}. Description: {loc.description}")

    context.append("\nUpcoming Campus Events:")
    for ev in events:
        context.append(f"- {ev.title} (Category: {ev.category}): Date {ev.date} at {ev.time} at {ev.venue}. Organizer: {ev.organizer}. Spots left: {ev.spots_left}. Description: {ev.description}")

    context.append("\nStudent Clubs Hub:")
    for cl in clubs:
        context.append(f"- {cl.name} ({cl.category}): coordinator: {cl.student_coordinator}, faculty: {cl.faculty_coordinator}, members: {cl.members_count}. Requirements: {cl.requirements}. Description: {cl.description}")

    context.append("\nActive Recruitment & Placements:")
    for pl in placements:
        context.append(f"- {pl.company} ({pl.role}): package is {pl.ctc}, eligibility: {pl.eligibility}, deadline: {pl.deadline}, status: {pl.status}, type: {pl.type}")

    context.append("\nHostel Dining Mess Menu:")
    for m in menus:
        context.append(f"- {m.day}: Breakfast: {m.breakfast} | Lunch: {m.lunch} | Snack: {m.snack} | Dinner: {m.dinner}")

    return "\n".join(context)


# Fuzzy/Rule-based local fallback responses matching the original mock data
def get_local_fallback_response(user_query):
    query = user_query.lower()

    if 'block a' in query or 'where is block a' in query:
        return ("### **Administrative Block A Navigation**\n\n**Block A** is located near the **Main Campus Entrance**.\n\n"
                "*   **Ground Floor**: Main Accounts Office, Fee counter, Admission Registration.\n"
                "*   **1st Floor**: Dean Office of Student Affairs (Room A-102), Dean of Academics Office.\n"
                "*   **2nd Floor**: Examination Cell, Grade Sheet Registry, and Board Room.\n\n"
                "*💡 Nearest Parking:* **Main Gate Parking Lot A**. Walk past the central fountain to enter Block A directly.")
    
    if 'block c' in query or 'hostel block c' in query or 'aryabhata' in query:
        return ("### **Aryabhata Hostels Block C Navigation**\n\n**Aryabhata Block C** is situated in **Hostel Sector B** (North Wing of Campus).\n\n"
                "*   It is a 5-storey complex housing mostly Freshers and Sophomore students.\n"
                "*   **Warden Cabin**: Located at Room 101, Ground Floor.\n"
                "*   **Facilities**: In-house Gym (Ground Floor), Silent Study Lounge (3rd Floor), Cafeteria attached to back courtyard.\n\n"
                "*💡 Directions:* From the Main Canteen, take the northern walkway, pass the Football ground, and the block is directly behind Block B.")

    if 'timetable' in query or 'class today' in query or 'my classes' in query:
        return ("### **Today's CSE (Sem 5) Academic Timetable**\n\nHere is your allocated schedule for today:\n\n"
                "1.  **09:00 AM - 09:55 AM** | Database Management Systems (*CS301*) - Dr. Ramesh Iyer (CSE Lab 2, Main Block)\n"
                "2.  **10:00 AM - 10:55 AM** | Theory of Computation (*CS302*) - Dr. Ananya Sen (Room 301, Block A)\n"
                "3.  **11:15 AM - 12:10 PM** | Machine Learning (*CS303*) - Prof. Clara Mendonca (Seminar Hall, Tech Block)\n"
                "4.  **01:30 PM - 02:25 PM** | Software Engineering (*CS304*) - Dr. Vivek Nair (Room 303, Block A)\n\n"
                "*🚀 Quick tip: You have a 20-minute tea break between Theory of Computation and Machine Learning (10:55 AM - 11:15 AM).*")

    if 'machine learning' in query or 'clara' in query or 'ml faculty' in query:
        return ("### **Machine Learning Faculty Profile**\n\n**Prof. Clara Mendonca** teaches Machine Learning (CS303) for Semester 5.\n\n"
                "*   **Designation**: Assistant Professor (Senior Grade)\n"
                "*   **Cabin Location**: Room 203, Seminar Hall Wing, Technology Block\n"
                "*   **Office Consultation Hours**: Daily 11:00 AM - 12:00 PM\n"
                "*   **Research Areas**: Computer Vision, Model Quantisation, Healthcare Diagnostics AI\n"
                "*   **Email**: `clara.mendonca@university.edu`\n\n"
                "*💡 Actionable Tip:* You can ask her about the upcoming CIA-2 project topics during her office consultation hour tomorrow.")

    if 'exam' in query or 'cia-2' in query or 'assessment' in query:
        return ("### **CIA-2 Internal Assessment Guidelines**\n\nAccording to the Dean of Academics circular dated **July 18, 2026**:\n\n"
                "*   **Date**: Commencing from **August 3, 2026**.\n"
                "*   **Format**: Descriptive 50-marks paper (Units I to III).\n"
                "*   **Weightage**: Holds a critical 20% weightage in your overall Internal Marks compilation.\n"
                "*   **Seating Plans**: Available outside the Exam Cell (2nd Floor, Block A) on July 30.\n\n"
                "*📚 Study materials: Notes and PYQs for Database Systems, TOC, and Machine Learning are fully uploaded in the **Resource Center**.*")

    if 'club' in query or 'nexus' in query or 'coding club' in query:
        return ("### **University Recommended Student Clubs**\n\nBased on your CSE branch, here are the elite clubs you should join:\n\n"
                "1.  **University Coding Club 💻**:\n"
                "    *   *Lead*: Aditya Sen (Final Year)\n"
                "    *   *Focus*: Competitive programming (LeetCode, Codeforces), open-source contributions, and Hackathon team building.\n"
                "    *   *Next Event*: CodeRed 36-Hr Hackathon (Aug 14).\n"
                "2.  **Nexus Robotics Club 🤖**:\n"
                "    *   *Lead*: Nisha Pillai (3rd Year)\n"
                "    *   *Focus*: Embedded IoT, UAV design, microcontrollers scripting.\n\n"
                "*💡 Joining Action:* Click the 'Clubs' sidebar option and hit the **\"Join Club\"** to receive automatic calendar alerts.")

    if 'food' in query or 'mess' in query or 'menu' in query or 'dinner' in query:
        return ("### **Today's Hostels Block Mess Menu**\n\nHere is what is cooking today at the Main Dining Hall:\n\n"
                "*   **Breakfast**: Idli, steaming hot Sambar, fresh Coconut Chutney, Tea and Coffee.\n"
                "*   **Lunch**: Butter Roti, Dal Tadka, Seasonal Mix Veg Curry, Basmati Rice, fresh thick Curd, Salad.\n"
                "*   **Evening Snack**: Crispy Potato Samosas, Mint and Tamarind Chutney, masala Tea.\n"
                "*   **Dinner**: Tandoori Roti, rich Paneer Butter Masala, aromatic Jeera Rice, and Sweet Custard.\n\n"
                "*💡 Timings:* Dinner is served between **07:30 PM - 09:30 PM**. Ensure your biometric card is kept handy.")

    if 'placement' in query or 'adobe' in query or 'google' in query:
        return ("### **Upcoming Core CSE Placement Drives**\n\nActive opportunities for 2026 graduating batch CSE/IT:\n\n"
                "1.  **Adobe Systems** (Member of Technical Staff)\n"
                "    *   *CTC Package*: **42.5 LPA**\n"
                "    *   *Registration Deadline*: **July 22, 2026 (11:59 PM)**\n"
                "    *   *Requirement*: CGPA >= 8.5, No active backlogs.\n"
                "2.  **Google India** (Software Engineer L3)\n"
                "    *   *CTC Package*: **55.4 LPA**\n"
                "    *   *Deadline*: **July 28, 2026**\n\n"
                "*🚀 Preparation Tip:* Go to the **Placement Hub** to access audited Google/Adobe resume templates and curated system design interview questions.")

    if 'notes' in query or 'download' in query or 'pdf' in query:
        return ("### **Available Study Resources - CSE Sem 5**\n\nI found high-quality curated study materials in the **Resource Center**:\n\n"
                "*   **Database Management Systems**: *Relational Algebra Master Notes* by Dr. Ramesh Iyer (4.8 MB PDF).\n"
                "*   **Theory of Computation**: *CNF & Grammar Conversion Guide* by Dr. Ananya Sen (1.2 MB PDF).\n"
                "*   **Machine Learning**: *Lab Manual - Compiled Jupyter Notebooks* (8.1 MB Zip).\n\n"
                "*📥 Action:* Go to the **Resources** panel in the sidebar, find the resource, and click the **Download** button.")

    if 'hello' in query or 'hi' in query or 'hey' in query or 'who are you' in query:
        return ("### **Welcome to CampusPilot AI! 🏛️**\n\nHello Devashish! I am your institutional assistant. I can navigate campus, schedule study planners, query timetable sessions, recommend clubs, audit placements, and download syllabus resources.\n\n"
                "**Here are a few things you can ask me directly:**\n"
                "*   *\"Where is Block A administrative wing?\"*\n"
                "*   *\"What is on the hostel mess menu today?\"*\n"
                "*   *\"Show my academic schedule for today.\"*\n"
                "*   *\"Find placement drives ending soon.\"*")

    # Fallback smart response synthesis using fuzzy context
    return (f"### **Campus Pilot Assistant Consultation**\n\n"
            f"I have cross-referenced the university knowledge vaults for your inquiry regarding: **\"{user_query}\"**.\n\n"
            f"*   **User Identity**: Devashish Sharma, Computer Science & Engineering, Semester 5.\n"
            f"*   **Campus Status**: Active session (Mon-Fri 09:00 AM - 04:30 PM).\n"
            f"*   **Academic Records**: Clear status, no pending dues, 84.5% active attendance.\n\n"
            f"*💡 Action recommended:* You can find full departmental and administrative details by visiting the specific modules (Academics, Faculty, Campus Map, or Resources) in the sidebar. Let me know if you would like me to retrieve specific room locations, faculty consultation timings, or exam papers!")


@ai_bp.route('/ai/chat', methods=['POST'])
def chat():
    student_id = request.headers.get('X-Student-Id', 'st-0982')
    data = request.get_json() or {}
    message = data.get('message', '')

    if not message:
        return jsonify({'error': 'Message is required'}), 400

    api_key = os.environ.get('GEMINI_API_KEY', '')

    if api_key:
        try:
            # Gather fresh grounded context from db state
            context = get_campus_context(student_id)
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')
            
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
    fallback_text = get_local_fallback_response(message)
    return jsonify({'response': fallback_text})
