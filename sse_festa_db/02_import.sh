#!/usr/bin/env bash
# ==============================================================================
# Import Script for SSE FESTA SQLite3 Database (sse_festa_db.sqlite)
# Executes schema migration and populates seed data into SQLite.
# ==============================================================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DB_FILE="${SCRIPT_DIR}/sse_festa_db.sqlite"

echo "============================================================"
echo "🚀 Starting SQLite Database Setup: ${DB_FILE}"
echo "============================================================"

if command -v sqlite3 &> /dev/null; then
    echo "1️⃣  Step 1: Running DDL Schema script (01_schema.sql)..."
    sqlite3 "${DB_FILE}" < "${SCRIPT_DIR}/01_schema.sql"
    echo "✅ Schema created/verified successfully!"

    echo ""
    echo "2️⃣  Step 2: Running Seed Data script (03_seed_data.sql)..."
    sqlite3 "${DB_FILE}" < "${SCRIPT_DIR}/03_seed_data.sql"
    echo "✅ Seed data populated successfully!"
else
    echo "ℹ️  sqlite3 CLI not found in PATH, running via Python..."
    python3 "${SCRIPT_DIR}/import_data.py"
fi

echo ""
echo "============================================================"
echo "🎉 Database import process complete for ${DB_FILE}!"
echo "============================================================"
