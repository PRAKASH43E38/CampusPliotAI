# SSE FESTA Central Database (`sse_festa_db.sqlite`)

Production-grade, 3NF normalized centralized **SQLite3 database** populated entirely with real, publicly available data crawled from the official **Saranathan College of Engineering** website ([https://www.saranathan.ac.in](http://saranathan.ac.in)).

---

## 📌 Project Overview

This repository contains the complete **SQLite3 database solution** built for the **SSE FESTA** application. It provides structured SQLite DDL schema definitions, automated web crawlers, data seed generators, and database migration scripts with zero external server dependencies.

---

## 🗄️ Database Modules (13 Tables)

1. **`departments`**: Official department code, name, description, HOD name, email, phone, and source URL.
2. **`courses`**: UG/PG degree programs, duration, department ID, intake capacity, and program type.
3. **`faculty`**: Comprehensive list of faculty members across all 16 departments with designation, qualifications, research areas, and contact emails.
4. **`academic_calendar`**: Institutional reopening dates, semester assessment schedules (IAT-1, IAT-2), and practical exams.
5. **`exam_notices`**: Autonomous exam timetables, revaluation notices, and COE notifications.
6. **`timetables`**: Department-wise semester schedules and PDF links.
7. **`announcements`**: Official announcements, circulars, and TNEA allotment notices.
8. **`placement_drives`**: Recruiting companies (Zoho, IBM, Delphi TVS, Mallow Tech, etc.), packages, eligibility, and registration drives.
9. **`clubs`**: Campus cells & clubs (EDC, E-Yantra Robotics, WEC, NSS, YRC) with coordinators and activities.
10. **`research_centres`**: Recognized research labs (SCERC, IIPC, QIC) and departmental research wings.
11. **`gallery`**: Campus event photographs and press releases.
12. **`campus_buildings`**: Physical infrastructure blocks, central library, auditorium, hostels, and lab facilities.
13. **`contact_information`**: Official contact details for campus administrative offices, placement cell, and helpdesks.

---

## 📁 Directory Structure

```text
sse_festa_db/
├── sse_festa_db.sqlite            # Single-file SQLite3 database (Ready to use!)
├── 01_schema.sql                  # SQLite DDL script (13 normalized 3NF tables + FKs + Indexes)
├── 02_import.sh                   # Bash auto-import script
├── 03_seed_data.sql               # Seed SQL file with real extracted public data
├── crawler.py                     # Python web scraper for Saranathan College website
├── generate_seed_sql.py           # Python script converting extracted JSON to SQLite INSERT statements
├── import_data.py                 # Built-in Python SQLite import tool
├── ERD.md                         # Entity Relationship Diagram & Schema documentation
└── README.md                      # Complete setup & execution guide
```

---

## ⚙️ Prerequisites

* **Python** (v3.8+) - Includes native `sqlite3` module out-of-the-box!
* **Python Libraries**: `requests`, `beautifulsoup4`

To install Python web scraping dependencies:
```bash
pip install requests beautifulsoup4
```

---

## 🚀 Execution & Setup Guide

### Option A: Automatic Import via Python (Recommended)

Run the Python import script using standard library `sqlite3`:
```bash
python3 sse_festa_db/import_data.py
```

---

### Option B: Import via SQLite3 CLI Direct Command

```bash
# 1. Create Schema and Tables
sqlite3 sse_festa_db/sse_festa_db.sqlite < sse_festa_db/01_schema.sql

# 2. Populate Real Seed Data
sqlite3 sse_festa_db/sse_festa_db.sqlite < sse_festa_db/03_seed_data.sql
```

---

### Option C: Re-run Live Scraper to Refresh SQLite Database

To re-crawl the live website and generate fresh seed data whenever the college updates its website:

```bash
# 1. Execute live crawler
python3 sse_festa_db/crawler.py

# 2. Generate updated SQLite seeds
python3 sse_festa_db/generate_seed_sql.py

# 3. Import fresh data into SQLite
python3 sse_festa_db/import_data.py
```

---

## 🔍 Python Code Example

To query the database directly from Python:

```python
import sqlite3

conn = sqlite3.connect("sse_festa_db/sse_festa_db.sqlite")
cursor = conn.cursor()

# Get faculty members grouped by department
cursor.execute("""
    SELECT d.dept_code, f.faculty_name, f.designation, f.email
    FROM faculty f
    JOIN departments d ON f.dept_id = d.dept_id
    ORDER BY d.dept_code, f.faculty_id
""")

for row in cursor.fetchall():
    print(f"[{row[0]}] {row[1]} - {row[2]} ({row[3]})")

conn.close()
```

---

## 🛡️ Data Ethics & Compliance
* All extracted data is **100% public** and sourced from `https://www.saranathan.ac.in`.
* No login-protected pages, student private records, or sensitive credentials were accessed or extracted.
* Preserved original source URLs (`source_url`) for full data provenance auditability.
