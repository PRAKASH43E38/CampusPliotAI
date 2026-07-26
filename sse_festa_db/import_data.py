#!/usr/bin/env python3
"""
Python Data Import Tool for SSE FESTA Central Database (SQLite3).
Populates sse_festa_db.sqlite using 01_schema.sql and 03_seed_data.sql.
"""

import sqlite3
import os

def run_import():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    db_file = os.path.join(script_dir, "sse_festa_db.sqlite")
    schema_sql_path = os.path.join(script_dir, "01_schema.sql")
    seed_sql_path = os.path.join(script_dir, "03_seed_data.sql")

    print(f"Connecting to SQLite database at '{db_file}'...")
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()

    # Step 1: Execute Schema
    print("1️⃣  Executing 01_schema.sql DDL...")
    with open(schema_sql_path, "r", encoding="utf-8") as f:
        schema_sql = f.read()
        cursor.executescript(schema_sql)
    print("✅ Schema created successfully!")

    # Step 2: Execute Seed Data
    print("2️⃣  Populating seed data from 03_seed_data.sql...")
    with open(seed_sql_path, "r", encoding="utf-8") as f:
        seed_sql = f.read()
        cursor.executescript(seed_sql)
    print("✅ Seed data populated successfully!")

    conn.commit()
    conn.close()
    print("🎉 SQLite Database setup complete!")

if __name__ == "__main__":
    run_import()
