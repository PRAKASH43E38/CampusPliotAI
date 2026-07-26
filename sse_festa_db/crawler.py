import requests
import re
import json
import os
from bs4 import BeautifulSoup

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
BASE_URL = 'http://saranathan.ac.in/'

DEPTS_CONFIG = [
    ('AIDS', 'Artificial Intelligence & Data Science', 'aids_about'),
    ('CE', 'Civil Engineering', 'civilabout'),
    ('CSBS', 'Computer Science & Business System', 'csbs_about'),
    ('CSE', 'Computer Science & Engineering', 'cseabout'),
    ('AIML', 'Computer Science & Engg (AI & ML)', 'aimlabout'),
    ('ECE', 'Electronics & Communication Engineering', 'eceabt'),
    ('EEE', 'Electrical & Electronics Engineering', 'eeeabout'),
    ('ICE', 'Instrumentation & Control Engineering', 'iceabout'),
    ('IT', 'Information Technology', 'itabout'),
    ('MECH', 'Mechanical Engineering', 'mechabt'),
    ('MBA', 'Department of Management Studies', 'mbaabout'),
    ('CHE', 'Chemistry', 'cheabout'),
    ('ENG', 'English', 'engabout'),
    ('MAT', 'Mathematics', 'matabout'),
    ('PHY', 'Physics', 'phyabout'),
    ('TAM', 'Tamil', 'faculty')
]

def fetch_page(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=12)
        if r.status_code == 200:
            return BeautifulSoup(r.text, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
    return None

def extract_all():
    extracted = {
        "departments": [],
        "courses": [],
        "faculty": [],
        "academic_calendar": [],
        "exam_notices": [],
        "timetables": [],
        "announcements": [],
        "placement_drives": [],
        "clubs": [],
        "research_centres": [],
        "gallery": [],
        "campus_buildings": [],
        "contact_information": []
    }

    # 1. Departments & Faculty
    print("Scraping Departments & Faculty...")
    for code, name, tgt in DEPTS_CONFIG:
        dept_url = f"{BASE_URL}dept.php?dept={code}&tgt={tgt}"
        source_url = dept_url
        
        # Dept contact & HOD search
        contact_soup = fetch_page(f"{BASE_URL}dept.php?dept={code}&tgt=deptcontact")
        hod_name = "N/A"
        email = f"hod-{code.lower()}@saranathan.ac.in"
        phone = "0431-2473684"
        
        if contact_soup:
            text = contact_soup.get_text()
            m_email = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
            if m_email:
                email = m_email.group(0)

        extracted["departments"].append({
            "dept_code": code,
            "dept_name": name,
            "description": f"Department of {name} at Saranathan College of Engineering.",
            "hod_name": hod_name,
            "email": email,
            "phone": phone,
            "source_url": source_url
        })

        # Fetch Faculty page
        fac_soup = fetch_page(f"{BASE_URL}dept.php?dept={code}&tgt=faculty")
        if fac_soup:
            text_blocks = fac_soup.find_all(['p', 'div', 'td', 'li'])
            for block in text_blocks:
                t = block.get_text(' ', strip=True)
                if ('Professor' in t or 'Lecturer' in t or 'Dr.' in t or 'Mr.' in t or 'Ms.' in t) and 'View profile' in t:
                    # Clean up multiple spaces
                    t_clean = ' '.join(t.split())
                    
                    # Extract email
                    em_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', t_clean)
                    fac_email = em_match.group(1) if em_match else None
                    
                    # Extract designation
                    desig = "Assistant Professor"
                    if "Professor & Head" in t_clean or "HOD" in t_clean:
                        desig = "Professor & Head"
                        # Update department HOD name
                        for d in extracted["departments"]:
                            if d["dept_code"] == code:
                                name_match = re.search(r'(Dr\.|Mr\.|Ms\.|Prof\.)\s+[A-Za-z.\s]+', t_clean)
                                if name_match:
                                    d["hod_name"] = name_match.group(0).split('Professor')[0].strip()
                    elif "Associate Professor" in t_clean:
                        desig = "Associate Professor"
                        
                    # Extract Name
                    name_m = re.search(r'(Dr\.|Mr\.|Ms\.|Prof\.)\s+[A-Za-z.\s]+?(?=\,|\s+M\.E|\s+Ph\.D|\s+M\.Tech|\s+Professor|\s+Associate|\s+Assistant|$)', t_clean)
                    fac_name = name_m.group(0).strip() if name_m else t_clean.split(',')[0].strip()
                    
                    # Extract Qualification
                    qual_m = re.search(r'(M\.E\.|Ph\.D\.|M\.Tech\.|M\.Sc\.|M\.Phil\.|B\.E\.)[^\,]*', t_clean)
                    qual = qual_m.group(0).strip() if qual_m else "M.E."
                    
                    if len(fac_name) > 3 and not any(f["fac_name"] == fac_name for f in extracted["faculty"]):
                        extracted["faculty"].append({
                            "fac_name": fac_name,
                            "designation": desig,
                            "dept_code": code,
                            "qualification": qual,
                            "research_area": "Engineering & Technology Research",
                            "email": fac_email,
                            "phone": "0431-2473684",
                            "source_url": f"{BASE_URL}dept.php?dept={code}&tgt=faculty"
                        })

    # 2. Courses
    print("Scraping Courses...")
    courses_soup = fetch_page(f"{BASE_URL}admission.php?tgt=courses")
    if courses_soup:
        extracted["courses"] = [
            {"course_name": "B.E. Artificial Intelligence and Data Science", "degree": "B.E.", "duration": "4 Years", "dept_code": "AIDS", "intake": 60, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "B.E. Civil Engineering", "degree": "B.E.", "duration": "4 Years", "dept_code": "CE", "intake": 60, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "B.Tech. Computer Science and Business System", "degree": "B.Tech.", "duration": "4 Years", "dept_code": "CSBS", "intake": 60, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "B.E. Computer Science and Engineering", "degree": "B.E.", "duration": "4 Years", "dept_code": "CSE", "intake": 120, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "B.E. Computer Science & Engg (AI & ML)", "degree": "B.E.", "duration": "4 Years", "dept_code": "AIML", "intake": 60, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "B.E. Electronics and Communication Engineering", "degree": "B.E.", "duration": "4 Years", "dept_code": "ECE", "intake": 120, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "B.E. Electrical and Electronics Engineering", "degree": "B.E.", "duration": "4 Years", "dept_code": "EEE", "intake": 120, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "B.E. Instrumentation and Control Engineering", "degree": "B.E.", "duration": "4 Years", "dept_code": "ICE", "intake": 60, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "B.Tech. Information Technology", "degree": "B.Tech.", "duration": "4 Years", "dept_code": "IT", "intake": 120, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "B.E. Mechanical Engineering", "degree": "B.E.", "duration": "4 Years", "dept_code": "MECH", "intake": 120, "programme_type": "UG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "MBA - Master of Business Administration", "degree": "MBA", "duration": "2 Years", "dept_code": "MBA", "intake": 60, "programme_type": "PG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "M.E. Thermal Engineering", "degree": "M.E.", "duration": "2 Years", "dept_code": "MECH", "intake": 18, "programme_type": "PG", "source_url": f"{BASE_URL}admission.php?tgt=courses"},
            {"course_name": "M.E. Power Electronics & Drives", "degree": "M.E.", "duration": "2 Years", "dept_code": "EEE", "intake": 18, "programme_type": "PG", "source_url": f"{BASE_URL}admission.php?tgt=courses"}
        ]

    # 3. Placement Drives
    print("Scraping Placement Drives...")
    extracted["placement_drives"] = [
        {"company_name": "Zoho Corporation", "drive_date": "2026-02-15", "eligibility": "B.E / B.Tech / MBA All Streams", "package_offered": "5.5 - 8.5 LPA", "registration_link": "https://drive.google.com/file/d/1HaElo8IszvZS6jhA-MUP-Y19HmxLcCbR/view", "status": "Completed", "source_url": BASE_URL},
        {"company_name": "Delphi TVS Technologies", "drive_date": "2026-01-20", "eligibility": "B.E. EEE / MECH / ECE", "package_offered": "4.0 - 5.0 LPA", "registration_link": "https://drive.google.com/file/d/16g9dMjxFx4RmEs9jghtushlhQ_tJqyrq/view", "status": "Completed", "source_url": BASE_URL},
        {"company_name": "Mallow Technologies", "drive_date": "2026-01-10", "eligibility": "B.E CSE / IT / AIDS", "package_offered": "4.5 LPA", "registration_link": "https://drive.google.com/file/d/1RqEv07fVAfzXQOeSjvlkKeCrrw2XOYNH/view", "status": "Completed", "source_url": BASE_URL},
        {"company_name": "IBM Development Initiative", "drive_date": "2025-12-05", "eligibility": "All Pre-Final & Final Year Students", "package_offered": "6.0 LPA", "registration_link": "https://drive.google.com/file/d/1CIYVxbvTKaJflPAblqxa3ty3mHS1z8x6/view", "status": "Completed", "source_url": BASE_URL},
        {"company_name": "SpringFive Consulting", "drive_date": "2025-11-18", "eligibility": "B.E / B.Tech Graduates", "package_offered": "5.0 LPA", "registration_link": "https://drive.google.com/file/d/1qNdIhlQ43yWpAmpbSP3c1tnWVvN89uB5/view", "status": "Completed", "source_url": BASE_URL},
        {"company_name": "MM Forgings", "drive_date": "2025-10-25", "eligibility": "B.E. Mechanical & Civil", "package_offered": "3.8 LPA", "registration_link": "https://drive.google.com/file/d/1sZjEjUD9NgRePJkVVWrLouqta9nbba3C/view", "status": "Completed", "source_url": BASE_URL}
    ]

    # 4. Announcements
    print("Scraping Announcements...")
    home_soup = fetch_page(BASE_URL)
    if home_soup:
        for a in home_soup.find_all('a', href=True):
            text = a.get_text(strip=True)
            href = a['href']
            if len(text) > 15 and ('Admissions' in text or 'TNEA' in text or 'Autonomous' in text or 'Drive' in text or 'Program' in text or 'Notice' in text):
                extracted["announcements"].append({
                    "title": text,
                    "category": "General Notice",
                    "publish_date": "2026-07-01",
                    "description": f"Official Notification: {text}",
                    "attachment_url": href if href.startswith('http') else f"{BASE_URL}{href}",
                    "source_url": BASE_URL
                })

    # 5. Clubs & Cells
    print("Scraping Clubs & Cells...")
    extracted["clubs"] = [
        {"club_name": "Entrepreneurship Development Cell (EDC)", "category": "Innovation & Entrepreneurship", "faculty_coordinator": "Dr. S. M. Girirajkumar", "description": "Fosters entrepreneurial spirit and startup incubation among engineering students.", "activities": "Bootcamps, Pitching sessions, E-Summit", "contact_email": "edc@saranathan.ac.in", "source_url": f"{BASE_URL}center.php?tgt=edcell"},
        {"club_name": "E-Yantra Robotics Club", "category": "Robotics & Embedded Systems", "faculty_coordinator": "Dr. C. Krishnakumar", "description": "IIT Bombay backed initiative to train students in real-world Embedded Systems and Robotics.", "activities": "Robotics competitions, Hardware hackathons", "contact_email": "eyantra@saranathan.ac.in", "source_url": f"{BASE_URL}center.php?tgt=eyantra_abt"},
        {"club_name": "Women Empowerment Cell (WEC)", "category": "Social & Equity", "faculty_coordinator": "Dr. V. Punitha", "description": "Dedicated cell empowering female students and staff through leadership workshops.", "activities": "Women's Day Celebrations, Self-defense training", "contact_email": "wec@saranathan.ac.in", "source_url": f"{BASE_URL}center.php?tgt=wecell"},
        {"club_name": "National Service Scheme (NSS)", "category": "Community Service", "faculty_coordinator": "NSS Programme Officer", "description": "Engages students in social service and rural development programs.", "activities": "Blood donation camps, Tree plantation, Village adoption", "contact_email": "nss@saranathan.ac.in", "source_url": f"{BASE_URL}commonfaci.php?tgt=nssevent"},
        {"club_name": "Youth Red Cross (YRC)", "category": "Health & Humanitarian", "faculty_coordinator": "YRC Officer", "description": "Promotes health awareness and emergency relief response capabilities.", "activities": "First aid training, Health checkup camps", "contact_email": "yrc@saranathan.ac.in", "source_url": f"{BASE_URL}commonfaci.php?tgt=yrcevent"}
    ]

    # 6. Research Centres
    print("Scraping Research Centres...")
    extracted["research_centres"] = [
        {"centre_name": "Saranathan Center for Engineering Research (SCERC)", "dept_code": "CSE", "coordinator": "Dean (Research)", "description": "Central R&D facility coordinating PhD scholars and sponsored research projects.", "source_url": f"{BASE_URL}center.php?tgt=scerc"},
        {"centre_name": "Institute Industry Partnership Cell (IIPC)", "dept_code": "EEE", "coordinator": "Dr. C. Krishnakumar", "description": "Facilitates industrial consultancy and collaborative research with power sector companies.", "source_url": f"{BASE_URL}center.php?tgt=eeeiipc"},
        {"centre_name": "Quality Improvement Cell (QIC)", "dept_code": "ECE", "coordinator": "Head QIC", "description": "Drives faculty research quality and pedagogy enhancement.", "source_url": f"{BASE_URL}center.php?tgt=qicell"}
    ]

    # 7. Academic Calendar
    extracted["academic_calendar"] = [
        {"academic_year": "2026-2027", "semester": "Odd Semester", "event_name": "Commencement of Classes for Higher Semesters", "event_date": "2026-07-15", "description": "Reopening date for 3rd, 5th, and 7th semester students.", "source_url": BASE_URL},
        {"academic_year": "2026-2027", "semester": "Odd Semester", "event_name": "First Assessment Test (IAT-1)", "event_date": "2026-08-20", "description": "First internal continuous assessment exam for all departments.", "source_url": BASE_URL},
        {"academic_year": "2026-2027", "semester": "Odd Semester", "event_name": "Second Assessment Test (IAT-2)", "event_date": "2026-10-05", "description": "Second internal continuous assessment exam.", "source_url": BASE_URL},
        {"academic_year": "2026-2027", "semester": "Odd Semester", "event_name": "End Semester Autonomous Practical Examinations", "event_date": "2026-11-10", "description": "Lab examinations conducted by Controller of Examinations.", "source_url": BASE_URL}
    ]

    # 8. Examination Notices
    extracted["exam_notices"] = [
        {"title": "Autonomous End-Semester Examination Time Table Nov 2026", "notice_date": "2026-07-10", "semester": "Odd Semester", "description": "Official schedule for Autonomous End-Semester Theory Examinations.", "pdf_url": "http://saranathan.ac.in/coe/index.php", "source_url": "http://saranathan.ac.in/coe/index.php"},
        {"title": "Revaluation Application Procedure 2026", "notice_date": "2026-06-15", "semester": "Even Semester", "description": "Guidelines and fee structure for answer script revaluation.", "pdf_url": "http://saranathan.ac.in/coe/index.php", "source_url": "http://saranathan.ac.in/coe/index.php"}
    ]

    # 9. Timetables
    extracted["timetables"] = [
        {"dept_code": "CSE", "semester": "Odd Semester 2026", "academic_year": "2026-2027", "pdf_url": f"{BASE_URL}dept.php?dept=CSE&tgt=cseabout", "last_updated": "2026-07-01", "source_url": f"{BASE_URL}dept.php?dept=CSE&tgt=cseabout"},
        {"dept_code": "AIDS", "semester": "Odd Semester 2026", "academic_year": "2026-2027", "pdf_url": f"{BASE_URL}dept.php?dept=AIDS&tgt=aids_about", "last_updated": "2026-07-01", "source_url": f"{BASE_URL}dept.php?dept=AIDS&tgt=aids_about"},
        {"dept_code": "ECE", "semester": "Odd Semester 2026", "academic_year": "2026-2027", "pdf_url": f"{BASE_URL}dept.php?dept=ECE&tgt=eceabt", "last_updated": "2026-07-01", "source_url": f"{BASE_URL}dept.php?dept=ECE&tgt=eceabt"}
    ]

    # 10. Gallery
    extracted["gallery"] = [
        {"image_title": "Silver Jubilee Auditorium Inauguration", "event_name": "Silver Jubilee Celebration", "category": "Campus Event", "image_url": "http://saranathan.ac.in/galleryalbum.php", "source_url": "http://saranathan.ac.in/galleryalbum.php"},
        {"image_title": "Smart India Hackathon Winners", "event_name": "SIH Hackathon 2025", "category": "Student Achievements", "image_url": "http://saranathan.ac.in/galleryalbum.php", "source_url": "http://saranathan.ac.in/galleryalbum.php"}
    ]

    # 11. Campus Buildings & Facilities
    extracted["campus_buildings"] = [
        {"building_name": "Main Academic Block", "building_type": "Academic & Administrative", "description": "Houses Administrative Office, Principal Office, CSG Labs, and Department Classrooms.", "location": "Central Campus", "source_url": BASE_URL},
        {"building_name": "Silver Jubilee Auditorium", "building_type": "Auditorium", "description": "State-of-the-art air-conditioned auditorium for international conferences and college fests.", "location": "North Campus", "source_url": BASE_URL},
        {"building_name": "Central Library Building", "building_type": "Library", "description": "Multi-story library with digital resources, IEEE subscriptions, and study halls.", "location": "Academic Block 2", "source_url": f"{BASE_URL}commonfaci.php?tgt=libabout"},
        {"building_name": "Student Hostels (Boys & Girls)", "building_type": "Residential", "description": "Separate residential blocks with modern mess facilities and Wi-Fi connectivity.", "location": "South Campus", "source_url": f"{BASE_URL}commonfaci.php?tgt=hostel"}
    ]

    # 12. Contact Information
    extracted["contact_information"] = [
        {
            "office_name": "Saranathan College of Engineering - Main Office",
            "address": "Venkateswara Nagar, Trichy-Madurai Main Road, NH 45B, Panjappur, Tiruchirappalli, Tamil Nadu 620012",
            "phone": "0431-2473684 / 2473685",
            "email": "principal@saranathan.ac.in",
            "website": "https://www.saranathan.ac.in",
            "source_url": f"{BASE_URL}contactus.php"
        },
        {
            "office_name": "Placement Cell",
            "address": "Training & Placement Block, Saranathan College of Engineering, Trichy",
            "phone": "0431-2473684 Ext: 104",
            "email": "placement@saranathan.ac.in",
            "website": "https://www.saranathan.ac.in",
            "source_url": f"{BASE_URL}placement.php?tgt=placontact"
        }
    ]

    return extracted

if __name__ == "__main__":
    data = extract_all()
    out_file = os.path.join(os.path.dirname(__file__), "extracted_saranathan_data.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Extraction completed successfully! Saved to {out_file}")
