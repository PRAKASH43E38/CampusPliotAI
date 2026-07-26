#!/usr/bin/env python3
import sqlite3
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(SCRIPT_DIR, "sse_festa_db.sqlite")

def seed_student_database():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Read and execute schema
    schema_path = os.path.join(SCRIPT_DIR, "04_student_profiles.sql")
    with open(schema_path, "r") as f:
        cursor.executescript(f.read())

    try:
        cursor.execute("ALTER TABLE student_profiles ADD COLUMN profile_completed BOOLEAN DEFAULT 1;")
    except Exception:
        pass

    # Sample realistic students
    sample_students = [
        (
            "Astrabyte Student", "astrabyte@gmail.com", "+91 98401 23456", "Male", "2004-05-14", "Trichy, Tamil Nadu",
            "21CS8042", "Computer Science & Engineering", "2022-2026", "3rd Year", 6, "B",
            "R. Murugan", "Senior Accountant", "₹3.5 Lakhs", 1, 1,
            json.dumps(["Python", "JavaScript", "C Programming", "React", "HTML", "CSS"]),
            json.dumps(["Artificial Intelligence", "Web Development", "Competitive Programming"]),
            json.dumps(["Hackathons", "Coding Competitions", "Clubs", "Technical Events"]),
            1, 1, 1, 1, "High",
            "Passion for software engineering and problem solving.",
            "Deep Learning models and Full Stack Web Architectures.",
            "Agentic AI frameworks & Cloud Architecture",
            100
        ),
        (
            "Priya Shanmugam", "priya.s@saranathan.ac.in", "+91 94432 10987", "Female", "2005-08-22", "Kumbakonam, Tamil Nadu",
            "22AI9015", "Artificial Intelligence & Data Science", "2023-2027", "2nd Year", 4, "A",
            "S. Shanmugam", "Agricultural Supervisor", "₹2.2 Lakhs", 1, 1,
            json.dumps(["Python", "Data Analysis", "SQL", "Pandas", "Matplotlib", "Canva"]),
            json.dumps(["Data Science", "Machine Learning", "UI/UX", "Robotics"]),
            json.dumps(["Workshops", "Guest Lectures", "Cultural Events", "Sports"]),
            1, 1, 0, 1, "Medium",
            "Fascinated by data algorithms and AI applications in healthcare.",
            "Building predictive ML models and neural networks.",
            "TensorFlow & Computer Vision",
            95
        ),
        (
            "Karthik Raja", "karthik.r@saranathan.ac.in", "+91 98765 43210", "Male", "2003-11-05", "Madurai, Tamil Nadu",
            "20EC7089", "Electronics & Communication", "2021-2025", "4th Year", 8, "C",
            "M. Rajendran", "Business Owner", "₹6.0 Lakhs", 0, 0,
            json.dumps(["C++", "Embedded Systems", "IoT", "MATLAB", "Circuit Design"]),
            json.dumps(["IoT", "Robotics", "Electronics", "Cloud"]),
            json.dumps(["Technical Events", "NSS Activities", "Innovation & Startup Cell"]),
            1, 1, 1, 0, "High",
            "Love hardware-software integration and robotics.",
            "Autonomous drone design and VLSI testing.",
            "FPGA Programming & Embedded Linux",
            100
        ),
        (
            "Ananya Senthil", "ananya.s@saranathan.ac.in", "+91 91234 56789", "Female", "2006-02-18", "Thanjavur, Tamil Nadu",
            "23IT1002", "Information Technology", "2024-2028", "1st Year", 2, "A",
            "V. Senthilkumar", "School Teacher", "₹2.8 Lakhs", 1, 1,
            json.dumps(["HTML", "CSS", "Python", "Beginner", "MS Office"]),
            json.dumps(["Web Development", "Cyber Security", "UI/UX", "Music"]),
            json.dumps(["Clubs", "Cultural Events", "Dance", "Seminars"]),
            1, 1, 0, 1, "Medium",
            "Want to build modern applications that help rural communities.",
            "Web application design and cybersecurity basics.",
            "Full Stack Web Development with React",
            90
        ),
        (
            "Vignesh Kumar", "vignesh.k@saranathan.ac.in", "+91 97890 12345", "Male", "2004-09-30", "Pudukkottai, Tamil Nadu",
            "21ME5033", "Mechanical Engineering", "2022-2026", "3rd Year", 6, "A",
            "K. Ramanathan", "Farmer", "₹1.5 Lakhs", 1, 1,
            json.dumps(["AutoCAD", "SolidWorks", "Python", "C Programming"]),
            json.dumps(["Robotics", "Entrepreneurship", "Sports", "NCC"]),
            json.dumps(["Sports", "NCC Activities", "Innovation & Startup Cell"]),
            0, 1, 1, 1, "Medium",
            "Interested in EV vehicle design and CAD modelling.",
            "Electric vehicle powertrains and thermal analysis.",
            "ANSYS Simulation & Python for Automation",
            85
        )
    ]

    for s in sample_students:
        try:
            cursor.execute("""
                INSERT INTO student_profiles (
                    full_name, college_email, phone_number, gender, dob, address,
                    register_number, department, batch, year, semester, section,
                    parent_name, parent_occupation, family_income, first_graduate, scholarship_required,
                    current_skills, areas_of_interest, campus_interests,
                    communication_skills, teamwork, leadership, problem_solving, confidence_level,
                    reason_for_department, excited_to_learn, new_skill_first_year,
                    profile_completed, profile_completion_pct
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
            """, s)
        except sqlite3.IntegrityError:
            pass # Already exists

    conn.commit()
    conn.close()
    print("✅ Student database initialized and seeded successfully!")

if __name__ == "__main__":
    seed_student_database()
