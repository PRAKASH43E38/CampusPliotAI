import json
import os

json_path = os.path.join(os.path.dirname(__file__), "extracted_saranathan_data.json")
sql_path = os.path.join(os.path.dirname(__file__), "03_seed_data.sql")

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

def clean(val):
    if val is None:
        return "NULL"
    val_str = str(val).replace("'", "''").replace("\\", "\\\\")
    return f"'{val_str}'"

sql_lines = [
    "-- ============================================================================",
    "-- SQLite3 Seed Data for sse_festa_db (Extracted from Saranathan College Website)",
    "-- Database File: sse_festa_db.sqlite",
    "-- ============================================================================",
    "",
    "PRAGMA foreign_keys = OFF;",
    "DELETE FROM faculty;",
    "DELETE FROM courses;",
    "DELETE FROM timetables;",
    "DELETE FROM research_centres;",
    "DELETE FROM departments;",
    "DELETE FROM academic_calendar;",
    "DELETE FROM exam_notices;",
    "DELETE FROM announcements;",
    "DELETE FROM placement_drives;",
    "DELETE FROM clubs;",
    "DELETE FROM gallery;",
    "DELETE FROM campus_buildings;",
    "DELETE FROM contact_information;",
    "PRAGMA foreign_keys = ON;",
    ""
]

# 1. Departments
sql_lines.append("-- 1. Insert Departments")
for d in data["departments"]:
    sql = f"INSERT INTO departments (dept_code, dept_name, description, hod_name, email, phone, source_url) VALUES ({clean(d['dept_code'])}, {clean(d['dept_name'])}, {clean(d['description'])}, {clean(d['hod_name'])}, {clean(d['email'])}, {clean(d['phone'])}, {clean(d['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# Helper subquery for dept_code -> dept_id
dept_map_sql = "(SELECT dept_id FROM departments WHERE dept_code = {})"

# 2. Courses
sql_lines.append("-- 2. Insert Courses")
for c in data["courses"]:
    d_code = clean(c['dept_code'])
    sql = f"INSERT INTO courses (course_name, degree, duration, dept_id, intake, programme_type, source_url) VALUES ({clean(c['course_name'])}, {clean(c['degree'])}, {clean(c['duration'])}, {dept_map_sql.format(d_code)}, {c['intake'] if c['intake'] else 'NULL'}, {clean(c['programme_type'])}, {clean(c['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 3. Faculty
sql_lines.append("-- 3. Insert Faculty")
for fac in data["faculty"]:
    d_code = clean(fac['dept_code'])
    sql = f"INSERT INTO faculty (faculty_name, designation, dept_id, qualification, research_area, email, phone, source_url) VALUES ({clean(fac['fac_name'])}, {clean(fac['designation'])}, {dept_map_sql.format(d_code)}, {clean(fac['qualification'])}, {clean(fac['research_area'])}, {clean(fac['email'])}, {clean(fac['phone'])}, {clean(fac['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 4. Academic Calendar
sql_lines.append("-- 4. Insert Academic Calendar")
for cal in data["academic_calendar"]:
    sql = f"INSERT INTO academic_calendar (academic_year, semester, event_name, event_date, description, source_url) VALUES ({clean(cal['academic_year'])}, {clean(cal['semester'])}, {clean(cal['event_name'])}, {clean(cal['event_date'])}, {clean(cal['description'])}, {clean(cal['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 5. Exam Notices
sql_lines.append("-- 5. Insert Examination Notices")
for ex in data["exam_notices"]:
    sql = f"INSERT INTO exam_notices (notice_title, notice_date, semester, description, pdf_link, source_url) VALUES ({clean(ex['title'])}, {clean(ex['notice_date'])}, {clean(ex['semester'])}, {clean(ex['description'])}, {clean(ex['pdf_url'])}, {clean(ex['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 6. Timetables
sql_lines.append("-- 6. Insert Timetables")
for tt in data["timetables"]:
    d_code = clean(tt['dept_code'])
    sql = f"INSERT INTO timetables (dept_id, semester, academic_year, pdf_url, last_updated, source_url) VALUES ({dept_map_sql.format(d_code)}, {clean(tt['semester'])}, {clean(tt['academic_year'])}, {clean(tt['pdf_url'])}, {clean(tt['last_updated'])}, {clean(tt['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 7. Announcements
sql_lines.append("-- 7. Insert Announcements")
for ann in data["announcements"]:
    sql = f"INSERT INTO announcements (title, category, publish_date, description, attachment_url, source_url) VALUES ({clean(ann['title'])}, {clean(ann['category'])}, {clean(ann['publish_date'])}, {clean(ann['description'])}, {clean(ann['attachment_url'])}, {clean(ann['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 8. Placement Drives
sql_lines.append("-- 8. Insert Placement Drives")
for pd in data["placement_drives"]:
    sql = f"INSERT INTO placement_drives (company_name, drive_date, eligibility, package_offered, registration_link, status, source_url) VALUES ({clean(pd['company_name'])}, {clean(pd['drive_date'])}, {clean(pd['eligibility'])}, {clean(pd['package_offered'])}, {clean(pd['registration_link'])}, {clean(pd['status'])}, {clean(pd['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 9. Clubs
sql_lines.append("-- 9. Insert Clubs & Cells")
for cl in data["clubs"]:
    sql = f"INSERT INTO clubs (club_name, category, faculty_coordinator, description, activities, contact_email, source_url) VALUES ({clean(cl['club_name'])}, {clean(cl['category'])}, {clean(cl['faculty_coordinator'])}, {clean(cl['description'])}, {clean(cl['activities'])}, {clean(cl['contact_email'])}, {clean(cl['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 10. Research Centres
sql_lines.append("-- 10. Insert Research Centres")
for rc in data["research_centres"]:
    d_code = clean(rc['dept_code']) if rc.get('dept_code') else 'NULL'
    d_sql = dept_map_sql.format(d_code) if d_code != 'NULL' else 'NULL'
    sql = f"INSERT INTO research_centres (centre_name, dept_id, coordinator, description, source_url) VALUES ({clean(rc['centre_name'])}, {d_sql}, {clean(rc['coordinator'])}, {clean(rc['description'])}, {clean(rc['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 11. Gallery
sql_lines.append("-- 11. Insert Gallery Images")
for g in data["gallery"]:
    sql = f"INSERT INTO gallery (image_title, event_name, category, image_url, source_url) VALUES ({clean(g['image_title'])}, {clean(g['event_name'])}, {clean(g['category'])}, {clean(g['image_url'])}, {clean(g['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 12. Campus Buildings
sql_lines.append("-- 12. Insert Campus Buildings")
for b in data["campus_buildings"]:
    sql = f"INSERT INTO campus_buildings (building_name, building_type, description, location, source_url) VALUES ({clean(b['building_name'])}, {clean(b['building_type'])}, {clean(b['description'])}, {clean(b['location'])}, {clean(b['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

# 13. Contact Information
sql_lines.append("-- 13. Insert Contact Information")
for ci in data["contact_information"]:
    sql = f"INSERT INTO contact_information (office_name, address, phone, email, website, source_url) VALUES ({clean(ci['office_name'])}, {clean(ci['address'])}, {clean(ci['phone'])}, {clean(ci['email'])}, {clean(ci['website'])}, {clean(ci['source_url'])});"
    sql_lines.append(sql)
sql_lines.append("")

with open(sql_path, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

print(f"Generated SQLite seed data SQL at {sql_path} with {len(sql_lines)} lines!")
