import { UserProfile, Building, FacultyMember, CourseSubject, TimetableSlot, CampusEvent, Announcement, AcademicResource, FreshersItem, Classroom } from '../types';

export const OFFICIAL_DEPARTMENTS = [
  'All Departments',
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics'
] as const;

export const currentUser: UserProfile = {
  id: 'usr_001',
  name: 'Astrabyte',
  email: 'astrabyte@gmail.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  section: 'CSE-B',
  rollNumber: '21CS8042',
  cgpa: 8.92,
  attendancePct: 88.5,
  bio: 'AI Enthusiast | Full Stack Developer | ACM Student Chapter Vice Lead'
};

const deptsList = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics'
];

// ----------------------------------------------------
// 1. CLASSROOM BLUEPRINTS FOR BUILDINGS
// ----------------------------------------------------
export const cseClassrooms: Classroom[] = [
  { id: 'c_01', name: 'Seminar Hall A', code: 'AB1-001', floor: 0, type: 'Seminar Hall', capacity: 180, currentStatus: 'Orientation Session', instructor: 'Dean Student Affairs' },
  { id: 'c_02', name: 'CSE Reception & Helpdesk', code: 'AB1-002', floor: 0, type: 'Facility', capacity: 30, currentStatus: 'Open', instructor: 'Dept Staff' },
  { id: 'c_03', name: 'Lecture Hall 101 (Data Structures)', code: 'LH-101', floor: 1, type: 'Lecture Hall', capacity: 75, currentStatus: 'Ongoing: CS301 Lecture', instructor: 'Prof. Ananya Roy' },
  { id: 'c_04', name: 'Lecture Hall 102 (Operating Systems)', code: 'LH-102', floor: 1, type: 'Lecture Hall', capacity: 75, currentStatus: 'Available for Study', instructor: 'Free Slot' },
  { id: 'c_05', name: 'Computer Systems & C++ Lab', code: 'LAB-104', floor: 1, type: 'Lab', capacity: 45, currentStatus: 'Ongoing: C++ Bootcamp', instructor: 'Dr. Sanjay Verma' },
  { id: 'c_06', name: 'Lecture Hall 201 (AI & Neural Nets)', code: 'LH-201', floor: 2, type: 'Lecture Hall', capacity: 75, currentStatus: 'Ongoing: CS601 Lecture', instructor: 'Dr. Rajesh Sharma' },
  { id: 'c_07', name: 'Lecture Hall 202 (Database Systems)', code: 'LH-202', floor: 2, type: 'Lecture Hall', capacity: 75, currentStatus: 'Available for Study', instructor: 'Free Slot' },
  { id: 'c_08', name: 'High-Performance Computing Lab', code: 'HPC-204', floor: 2, type: 'Lab', capacity: 40, currentStatus: 'Ongoing: DBMS Project Session', instructor: 'Dr. Michael Chang' },
  { id: 'c_09', name: 'Dr. Rajesh Sharma HOD Cabin', code: 'HOD-301', floor: 3, type: 'Faculty Cabin', capacity: 10, currentStatus: 'In Cabin (Office Hours)', instructor: 'Dr. Rajesh Sharma' },
  { id: 'c_10', name: 'Prof. Ananya Roy Cabin', code: 'CAB-302', floor: 3, type: 'Faculty Cabin', capacity: 6, currentStatus: 'In Cabin', instructor: 'Prof. Ananya Roy' },
  { id: 'c_11', name: 'Lecture Hall 301 (Compiler Design)', code: 'LH-301', floor: 3, type: 'Lecture Hall', capacity: 75, currentStatus: 'Ongoing: CS602 Lecture', instructor: 'Prof. David Miller' },
  { id: 'c_12', name: 'Neural Networks & Agentic AI Lab', code: 'AI-304', floor: 3, type: 'Lab', capacity: 50, currentStatus: 'Research Session', instructor: 'AI Collective' },
  { id: 'c_13', name: 'Cybersecurity Cyber Vault Lab', code: 'SEC-401', floor: 4, type: 'Lab', capacity: 40, currentStatus: 'Ongoing: CTF Practice', instructor: 'Prof. David Miller' },
  { id: 'c_14', name: 'PG & PhD Research Studio', code: 'RES-402', floor: 4, type: 'Lab', capacity: 30, currentStatus: 'Restricted Entry', instructor: 'Research Scholars' }
];

export const aiClassrooms: Classroom[] = [
  { id: 'ai_01', name: 'NVIDIA H100 AI GPU Cluster Lab', code: 'AI-101', floor: 1, type: 'Lab', capacity: 60, currentStatus: 'Ongoing: LLM Training', instructor: 'Dr. Michael Chang' },
  { id: 'ai_02', name: 'Computer Vision & Robotics Studio', code: 'AI-102', floor: 1, type: 'Lab', capacity: 45, currentStatus: 'Ongoing: Drone Navigation', instructor: 'Dr. Priya Venkatesh' },
  { id: 'ai_03', name: 'Lecture Hall 201 (Machine Learning)', code: 'AI-201', floor: 2, type: 'Lecture Hall', capacity: 75, currentStatus: 'Ongoing: ML Algorithmic Models', instructor: 'Dr. Sunita Agarwal' },
  { id: 'ai_04', name: 'Generative AI Innovation Lounge', code: 'AI-301', floor: 3, type: 'Facility', capacity: 40, currentStatus: 'Hackathon Ideation', instructor: 'ACM AI Team' }
];

// ----------------------------------------------------
// 2. DETAILED LANDMARK BUILDINGS (Aligned with Real Satellite Photo)
// ----------------------------------------------------
export const campusBuildings: Building[] = [
  {
    id: 'bldg_gate',
    name: 'Main Entrance Highway Gate 1 & Security HQ',
    code: 'GATE-1',
    category: 'gate',
    description: 'Primary campus entrance at the main highway with 24/7 security checkpoint, RFID student card scanner gates, and visitor registration desk.',
    floors: 1,
    image: '/college_map.png',
    coordinates: { x: 42, y: 88 },
    departments: ['Campus Security', 'Visitor Affairs'],
    facilities: ['RFID Smart Turnstiles', 'Visitor Pass Kiosk', 'Emergency Security Call Box', 'CCTV Control Room'],
    openingHours: '24/7 Access',
    status: 'Open'
  },
  {
    id: 'bldg_lib',
    name: 'Saranathan College Library & Digital Pods',
    code: 'LIB',
    category: 'facility',
    description: 'Central campus library equipped with over 120,000 digital & printed books, private 24/7 study pods, and IEEE reading lounge.',
    floors: 4,
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    coordinates: { x: 78, y: 22 },
    departments: ['All Departments'],
    facilities: ['24/7 Night Study Pods', 'Digital IEEE Reading Lounge', 'Book Bank Counter', 'Discussion Rooms'],
    contactPerson: 'Chief Librarian - Ext 104',
    openingHours: '24/7 Access',
    status: 'Open'
  },
  {
    id: 'bldg_cse',
    name: 'Alan Turing CSE & AI Quadrangle Block',
    code: 'AB-1',
    category: 'academic',
    description: 'Computer Science & Engineering and Artificial Intelligence block featuring lecture halls, software labs, and faculty cabins.',
    floors: 5,
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
    coordinates: { x: 74, y: 34 },
    departments: ['Computer Science & Engineering', 'Software Engineering'],
    facilities: ['Neural Networks Lab', 'HPC Computing Center', 'Cybersecurity Vault', 'Dr. Rajesh Sharma HOD Cabin'],
    classrooms: cseClassrooms,
    contactPerson: 'CSE Department Secretary - Ext 401',
    openingHours: '08:00 AM - 09:00 PM',
    status: 'Open'
  },
  {
    id: 'bldg_me',
    name: 'ME Block SCE (Mechanical Engineering)',
    code: 'ME-BLOCK',
    category: 'academic',
    description: 'Mechanical Engineering block, workshops, CAD/CAM design studios, thermodynamics labs, and CNC machining centers.',
    floors: 3,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    coordinates: { x: 48, y: 15 },
    departments: ['Mechanical Engineering', 'Civil Engineering'],
    facilities: ['3D Printing Workshop', 'CNC Machining Center', 'Structural Testing Rig', 'Wind Tunnel Lab'],
    contactPerson: 'Mech Workshop Superintendent - Ext 601',
    openingHours: '08:30 AM - 07:00 PM',
    status: 'Open'
  },
  {
    id: 'bldg_main_quad',
    name: 'Saranathan Main Academic Quadrangle',
    code: 'MAIN-QUAD',
    category: 'academic',
    description: 'Central academic building housing ECE, IT, EEE lecture halls, central administrative offices, and main examination halls.',
    floors: 4,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    coordinates: { x: 54, y: 46 },
    departments: ['Electronics & Communication', 'Information Technology', 'Electrical & Electronics'],
    facilities: ['VLSI Design Center', '5G Wireless Lab', 'IoT Hardware Studio', 'Embedded Systems Lab'],
    contactPerson: 'Main Quad Office - Ext 310',
    openingHours: '08:30 AM - 08:00 PM',
    status: 'Open'
  },
  {
    id: 'bldg_cricket',
    name: 'SCE Cricket Ground & Athletic Oval Track',
    code: 'CRICKET-G',
    category: 'sports',
    description: 'Full-size cricket ground with turf pitch, 400m athletic running track, and spectator pavilion.',
    floors: 1,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    coordinates: { x: 30, y: 35 },
    departments: ['Physical Education'],
    facilities: ['Turf Cricket Pitch', '400m Athletic Track', 'Spectator Pavilion', 'Night Floodlights'],
    contactPerson: 'Sports Director - Ext 750',
    openingHours: '06:00 AM - 08:30 PM',
    status: 'Open'
  },
  {
    id: 'bldg_bball',
    name: 'Outdoor Basketball Court & Sports Arena',
    code: 'BBALL-CT',
    category: 'sports',
    description: 'Synthetic acrylic outdoor basketball court, volleyball court, and badminton arena.',
    floors: 1,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
    coordinates: { x: 72, y: 62 },
    departments: ['Physical Education'],
    facilities: ['Synthetic Basketball Court', 'Volleyball Net', 'Badminton Court'],
    contactPerson: 'Sports Secretary',
    openingHours: '06:00 AM - 08:30 PM',
    status: 'Open'
  },
  {
    id: 'bldg_shuttle',
    name: 'E-Shuttle Station & Main Parking Zone',
    code: 'HUB-BUS',
    category: 'facility',
    description: 'Campus vehicle parking zone and electric buggy terminal connecting Main Gate to Academic Blocks.',
    floors: 1,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800',
    coordinates: { x: 22, y: 78 },
    departments: ['Campus Transport'],
    facilities: ['Covered Parking', 'Electric Buggy Dock', 'Bicycle Stand'],
    openingHours: '06:30 AM - 10:30 PM',
    status: 'Open'
  },
  {
    id: 'bldg_admin',
    name: 'Administrative & Admissions Block',
    code: 'ADM',
    category: 'admin',
    description: 'Registrar office, Controller of Exams, Single Window Helpdesk, Fee Counter, and Placement Cell.',
    floors: 3,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    coordinates: { x: 86, y: 74 },
    departments: ['Administration', 'Accounts', 'Placement Cell'],
    facilities: ['Single Window Counter', 'Fees Counter', 'RFID Card Desk'],
    contactPerson: 'Admin Officer - Ext 100',
    openingHours: '09:00 AM - 05:00 PM',
    status: 'Open'
  },
  {
    id: 'bldg_hostel',
    name: 'Saranathan Student Hostel Complex',
    code: 'HOSTEL-COMPLEX',
    category: 'hostel',
    description: 'Residential student hostels featuring single/double AC rooms, high-speed WiFi, and mess hall.',
    floors: 5,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    coordinates: { x: 80, y: 10 },
    departments: ['Hostel Administration'],
    facilities: ['Dining Mess', 'Laundry Center', 'Warden Office'],
    contactPerson: 'Senior Warden',
    openingHours: '24/7 Access',
    status: 'Restricted'
  }
];

// ----------------------------------------------------
// 3. FACULTY MEMBERS (60 items department-wise)
// ----------------------------------------------------
const firstNames = ['Rajesh', 'Ananya', 'Michael', 'Priya', 'David', 'Sunita', 'Vikram', 'Neha', 'Arun', 'Kavita', 'Sanjay', 'Pooja', 'Rohan', 'Swati', 'Amit', 'Meera', 'Karan', 'Deepa', 'Nikhil', 'Divya'];
const lastNames = ['Sharma', 'Roy', 'Chang', 'Venkatesh', 'Miller', 'Agarwal', 'Singh', 'Gupta', 'Kumar', 'Nair', 'Verma', 'Joshi', 'Mehta', 'Rao', 'Deshmukh', 'Chawla', 'Patel', 'Reddy', 'Bhat', 'Saxena'];

export const facultyMembers: FacultyMember[] = Array.from({ length: 60 }).map((_, i) => {
  const fname = firstNames[i % firstNames.length];
  const lname = lastNames[(i + 4) % lastNames.length];
  const dept = deptsList[i % deptsList.length];
  const statuses: ('In Cabin' | 'In Class' | 'On Leave' | 'Busy')[] = ['In Cabin', 'In Class', 'Busy', 'In Cabin'];

  const specializationsByDept: Record<string, string[]> = {
    'Computer Science & Engineering': ['Deep Learning', 'Algorithms', 'Distributed Systems'],
    'Artificial Intelligence & Data Science': ['LLM Architectures', 'Computer Vision', 'Data Mining'],
    'Electronics & Communication': ['VLSI Design', 'Embedded IoT', '5G Wireless'],
    'Information Technology': ['Cloud DevOps', 'Cyber Security', 'Full Stack Architecture'],
    'Mechanical Engineering': ['Robotics', 'CAD/CAM', 'Thermodynamics'],
    'Civil Engineering': ['Structural Engineering', 'GIS Mapping', 'Environmental Tech'],
    'Electrical & Electronics': ['Power Electronics', 'Smart Grids', 'Renewable Energy']
  };

  return {
    id: `fac_${i + 1}`,
    name: `Dr. ${fname} ${lname}`,
    designation: i % 5 === 0 ? 'Head of Department (HOD)' : i % 2 === 0 ? 'Senior Professor' : 'Associate Professor',
    department: dept,
    email: `${fname.toLowerCase()}.${lname.toLowerCase()}@campuspilot.edu`,
    phone: `+91 98765 ${50000 + i}`,
    cabin: `${dept.split(' ')[0]}-Block Room ${(i % 4) + 1}0${(i % 9) + 1}`,
    officeHours: i % 2 === 0 ? 'Mon & Wed: 02:00 PM - 04:00 PM' : 'Tue & Thu: 11:00 AM - 01:00 PM',
    avatar: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
    ][i % 5],
    specialization: specializationsByDept[dept] || ['General Engineering'],
    rating: Number((4.6 + (i % 5) * 0.08).toFixed(2)),
    researchArea: `Advanced research in ${dept} paradigms and industry applications`,
    status: statuses[i % statuses.length]
  };
});

// ----------------------------------------------------
// 4. ACADEMIC SUBJECTS (56 items)
// ----------------------------------------------------
const subjectTemplates = [
  'Data Structures & Algorithms', 'Artificial Intelligence & Neural Networks', 'Computer Networks & Security',
  'Database Management Systems', 'Cloud Computing & DevOps', 'Operating Systems & Kernel Design',
  'Software Engineering & Agile', 'Compiler Design', 'Web Technologies & Full Stack',
  'Machine Learning Models', 'Deep Learning & Vision', 'Natural Language Processing',
  'Cyber Security & Cryptography', 'Blockchain & Smart Contracts', 'Big Data Analytics & Spark',
  'Embedded Systems & Microcontrollers', 'VLSI Circuit Design', 'Digital Signal Processing',
  'Wireless Sensor Networks', 'Robotics & Control Systems', 'Mechatronics & Sensor Fusion',
  'Object Oriented C++', 'Java Enterprise Architecture', 'Python for AI & Data Science',
  'Discrete Mathematics & Graphs', 'Linear Algebra for Machine Learning', 'Probability & Random Processes',
  'Computer Organization', 'Theory of Automata', 'Information Security & Privacy',
  'Human Computer Interaction', 'Mobile App Development', 'Internet of Things Systems',
  'AR/VR Spatial Computing', 'High Performance Computing', 'Distributed Microservices',
  'Computer Graphics & Shaders', 'Digital Image Processing', 'Reinforcement Learning Agents',
  'Bioinformatics Computing', 'Quantum Computing Fundamentals', 'Finite Element Analysis',
  'Thermodynamics & Heat Flow', 'Fluid Dynamics & Hydraulics', 'Structural Analysis & Design',
  'Environmental Engineering', 'Engineering Physics', 'Engineering Chemistry',
  'Professional Ethics & IP', 'Tech Entrepreneurship & Strategy', 'Power Systems & Grids',
  'Renewable Energy Systems', 'Control Theory & Automation', 'Electric Vehicle Tech',
  'Signal Integrity & EMC', 'Construction Management'
];

export const academicSubjects: CourseSubject[] = subjectTemplates.map((title, i) => {
  const dept = deptsList[i % deptsList.length];
  const faculty = facultyMembers.find(f => f.department === dept) || facultyMembers[i % facultyMembers.length];
  const totalCls = 40 + (i % 8);
  const attendedCls = totalCls - (i % 6);

  return {
    id: `sub_${i + 1}`,
    code: `${dept.split(' ').map(w => w[0]).join('')}${300 + i + 1}`,
    name: `${title}`,
    credits: (i % 3) + 2,
    department: dept,
    semester: (i % 8) + 1,
    facultyName: faculty.name,
    facultyCabin: faculty.cabin,
    totalClasses: totalCls,
    attendedClasses: attendedCls,
    grade: ['O', 'A+', 'A', 'B+', 'B'][i % 5],
    syllabusUrl: '#'
  };
});

// ----------------------------------------------------
// 5. TIMETABLE SLOTS (54 items)
// ----------------------------------------------------
const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];
const times = [
  '09:00 AM - 10:00 AM', '10:15 AM - 11:15 AM', '11:30 AM - 12:30 PM',
  '01:30 PM - 02:30 PM', '02:45 PM - 03:45 PM', '04:00 PM - 05:00 PM'
];

export const timetableSlots: TimetableSlot[] = Array.from({ length: 54 }).map((_, i) => {
  const sub = academicSubjects[i % academicSubjects.length];
  const bldg = campusBuildings[i % campusBuildings.length];
  const fac = facultyMembers[i % facultyMembers.length];

  return {
    id: `tt_${i + 1}`,
    day: days[i % days.length],
    time: times[i % times.length],
    subjectCode: sub.code,
    subjectName: sub.name,
    building: bldg.name,
    room: `${sub.department.split(' ')[0]}-Hall ${200 + (i % 15)}`,
    facultyName: fac.name,
    type: i % 4 === 0 ? 'Lab' : i % 5 === 0 ? 'Tutorial' : 'Lecture'
  };
});

// ----------------------------------------------------
// 6. CAMPUS EVENTS (50 items)
// ----------------------------------------------------
const eventCategories: ('Hackathon' | 'Workshop' | 'Cultural' | 'Technical' | 'Seminar' | 'Sports')[] = [
  'Hackathon', 'Workshop', 'Cultural', 'Technical', 'Seminar', 'Sports'
];

const eventTitles = [
  'HackCampus 2026: 36-Hour National AI Hackathon', 'Generative AI & LLM Agents Masterclass',
  'Technovate 2026 Annual Cultural Fest', 'RoboWars & Autonomous Drone Race',
  'CyberSecurity Capture The Flag (CTF) Challenge', 'International IEEE Quantum Computing Summit',
  'Inter-College E-Sports Valorant & CS2 Arena', 'Google Cloud & DevOps Hands-on Bootcamp',
  'Full Stack Web3 & Decentralized Apps Workshop', 'Startup Incubation Pitch Competition 2026',
  'Annual Sports Meet & Swimming Championship', 'TedX Campus: Next Gen AI Innovators',
  'CodeSprint 2026 Competitive Programming Contest', 'AI Music & Digital Arts Showcase',
  'Robotics Mechatronics Expo & Drone Flying Zone', 'Data Science & Big Data Career Fair',
  'Women in Tech Leadership Symposium', 'Open Source Hacktoberfest Edition',
  'AR/VR Metaverse Development Masterclass', 'Autonomous Electric Vehicle Design Challenge',
  'VLSI Semiconductor Chip Design Conference', 'Biotech & Neural Interface Workshop',
  'Fintech & Algorithmic Trading Bootcamp', 'Clean Energy & Sustainability Hackathon',
  'University Band Night & Live Concert', 'Campus Fashion Show & Drama Fest',
  'Battle of the Bands Inter-College Competition', 'Stand-up Comedy & Celebrity Night',
  'Photography & Short Film Festival', 'Literary Debate & Model United Nations (MUN)',
  'Chess & Strategy Championship', 'Badminton & Squash League Tournament',
  'Basketball & Volleyball Inter-Department Cup', 'Marathon 10K Run for Green Campus',
  'Yoga & Mindful Wellness Workshop', 'AI Ethics & Responsible Tech Seminar',
  'Machine Learning Model Deployment Sprint', 'Android 15 App Development Challenge',
  'Swift & iOS Spatial Computing Workshop', 'Rust Systems Programming Bootcamp',
  'Golang Microservices & Distributed Architecture', 'Docker & Kubernetes Containerization Workshop',
  'Linux Kernel Hacking & Driver Workshop', 'Embedded Systems & Arduino Expo',
  'Raspberry Pi Smart Home IoT Hackathon', 'Space Tech & CubeSat Design Workshop',
  'Astronomy Night & Stargazing Session', 'Alumni Placement Mentorship Summit',
  'Google Summer of Code (GSoC) Prep Session', 'ACM ICPC Regional Warmup Contest'
];

const eventImages = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800'
];

export const campusEvents: CampusEvent[] = eventTitles.map((title, i) => {
  const cat = eventCategories[i % eventCategories.length];
  const deptAssigned = deptsList[i % deptsList.length];
  const bldg = campusBuildings[i % campusBuildings.length];

  return {
    id: `evt_${i + 1}`,
    title,
    organizer: `${deptAssigned} Student Association`,
    category: cat,
    date: `August ${10 + (i % 20)}, 2026`,
    time: i % 2 === 0 ? '09:00 AM - 05:00 PM' : '05:00 PM - 09:00 PM',
    location: bldg.name,
    description: `Organized by ${deptAssigned}. Participate in ${title}, gain hands-on experience, connect with industry leaders, and earn official university certificates.`,
    image: eventImages[i % eventImages.length],
    tags: [cat, deptAssigned.split(' ')[0], 'Certificates', 'Campus Event'],
    registeredCount: 150 + (i * 20),
    maxCapacity: 300 + (i * 25),
    isRegistered: i % 3 === 0,
    featured: i % 5 === 0
  };
});

// ----------------------------------------------------
// 7. ANNOUNCEMENTS (56 items)
// ----------------------------------------------------
const annCategories: ('Academic' | 'Exam' | 'Placement' | 'Emergency' | 'General')[] = [
  'Academic', 'Exam', 'Placement', 'Emergency', 'General'
];

const annTitles = [
  'Official Mid-Semester Examination Schedule Released',
  'Google & Microsoft Campus Placement Drive Registration Open',
  'Central Library 24/7 Reading Room Extension',
  'Tuition Fee Payment Deadline Notice for Monsoon Semester',
  'Campus High-Speed WiFi Infrastructure Upgrade Maintenance',
  'Hostel Curfew & Entry Rules Verification Notice',
  'Department Executive Committee Nominations Open',
  'Industrial Visit Registration for Engineering Students',
  'Scholarship Application Window Extended for Merit Students',
  'National Cyber Security Awareness Week & Quiz',
  'Vice Chancellor Address to Incoming Freshers Batch 2026',
  'Blood Donation Camp & Medical Health Checkup',
  'Semester Project Submission Guidelines & Rubric',
  'End-Sem Practical Examination Date Sheet Uploaded',
  'Campus E-Shuttle Bus Route Timetable Revisions',
  'Inter-College Sports Tournament Team Trials',
  'Central Canteen Food Quality & Hygiene Inspection Report',
  'IEEE Student Branch Paper Presentation Contest',
  'Guest Lecture on Quantum Computing by Visiting MIT Scholar',
  'Code of Conduct & Attendance Minimum Rule Enforcement',
  'Remedial & Extra Tutorial Classes Schedule',
  'Campus Incubation Seed Fund Grant Announcement',
  'Student Exchange Program Applications for European Universities',
  'Library Book Bank Clearance Window Notice',
  'Hostel Mess Menu Revision & Student Survey',
  'University Cultural Fest Volunteer Recruitment Drive',
  'Microsoft Learn Student Ambassador Orientation',
  'Placement Cell Resume Workshop & Mock Interview Schedule',
  'Emergency Advisory: Campus Road Resurfacing Near Gate 2',
  'Free Health & Dental Checkup Drive at Campus Clinic',
  'Alumni Mentorship Cell Registration Form Open',
  'Winter Internship Fair Company List Released',
  'Robotics Club Mechatronics Component Issue Counter Open',
  'Zero Tolerance Ragging Policy Advisory Notice',
  'NPTEL Online Course Certificate Verification Portal',
  'Campus Swimming Pool Annual Maintenance Closure',
  'University Gym Equipment Upgrade & New Trainer Induction',
  'National Science Day Project Exhibition Registrations',
  'Departmental Library Book Return Reminder',
  'Final Year Capstone Project Defense Dates',
  'Graduate Aptitude Test in Engineering (GATE) Prep Classes',
  'Campus Cleanliness & Plastic-Free Drive',
  'Student Grievance Redressal Committee Meeting Notice',
  'Digital Identity Card Re-issuance Counter Timings',
  'Free AWS Cloud Vouchers Distribution for Seniors',
  'Inter-Departmental Debate Competition Topics Announced',
  'Language & Communication Skills Training Registration',
  'Campus Shuttle Night Buggy Service Extension',
  'Hostel Room Allotment List for Next Academic Year',
  'University Convocation Ceremony Date & Costume Rules',
  'IEEE Student Chapter Innovation Challenge',
  'ACM Programming Contest Prelims Schedule',
  'Center for AI & Data Science Open House Seminar',
  'CAD/CAM Design Workshop for Mechanical Engineers',
  'Structural Health Monitoring Workshop for Civil Engineers',
  'Power Electronics & Electric Vehicle Systems Seminar'
];

export const announcements: Announcement[] = annTitles.map((title, i) => {
  const cat = annCategories[i % annCategories.length];
  const deptAssigned = i % 4 === 0 ? 'All Departments' : deptsList[i % deptsList.length];
  const priorities: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];

  return {
    id: `ann_${i + 1}`,
    title,
    content: `${title}. Issued specifically for ${deptAssigned}. All concerned students must comply with posted instructions before the deadline.`,
    category: cat,
    date: `July ${25 - (i % 20)}, 2026`,
    author: i % 3 === 0 ? 'Controller of Examinations' : `HOD - ${deptAssigned.split(' ')[0]} Office`,
    isPinned: i % 7 === 0,
    department: deptAssigned,
    priority: priorities[i % priorities.length]
  };
});

// ----------------------------------------------------
// 8. ACADEMIC RESOURCES (56 items)
// ----------------------------------------------------
const resTypes: ('Notes' | 'PYQ' | 'Lab Manual' | 'E-Book' | 'Syllabus' | 'Cheatsheet')[] = [
  'Notes', 'PYQ', 'Lab Manual', 'E-Book', 'Syllabus', 'Cheatsheet'
];

const resourceTitles = [
  'Artificial Intelligence Complete Lecture Notes & Solved PYQs (2021-2025)',
  'Data Structures & Algorithms Master Cheatsheet (C++ & Python)',
  'Database Management Systems Official Lab Manual & SQL Queries',
  'Computer Networks Top 100 Solved Numerical Problems',
  'Operating Systems Kernel Architecture & System Calls Guide',
  'Compiler Design Lexical & Syntax Analysis Solved Papers',
  'Full Stack Web Development MERN Stack Notes',
  'Machine Learning Mathematics & Linear Algebra Notes',
  'Deep Learning Backpropagation & CNN Cheatsheet',
  'Cyber Security Ethical Hacking & Network Recon Manual',
  'Software Engineering Agile & UML Diagram Solutions',
  'Cloud Computing AWS & Azure DevOps Architecture Guide',
  'Blockchain Smart Contracts Solidity & Ethereum E-Book',
  'Big Data Analytics Apache Spark & Hadoop Solved Papers',
  'Discrete Mathematics Graph Theory & Proofs Cheatsheet',
  'Object Oriented Programming Java Core Concepts Manual',
  'Python for Data Analysis Pandas & NumPy Master Notes',
  'VLSI System Design CMOS Circuit Solved PYQs',
  'Embedded Systems Microcontroller C Programming Notes',
  'Digital Signal Processing Fourier Transform Formulas',
  'Robotics Kinematics & Inverse Kinematics Formula Sheet',
  'Theory of Computation Automata & Turing Machines Notes',
  'Human Computer Interaction UX Heuristics Guide',
  'Mobile App Development Flutter & React Native Notes',
  'Internet of Things Sensor Node Hardware Lab Manual',
  'AR/VR Unity Shader & Spatial Math Cheatsheet',
  'High Performance Computing MPI & OpenMP Solved Papers',
  'Computer Graphics OpenGL Pipeline & Shader Notes',
  'Digital Image Processing Edge Detection & Filters Manual',
  'Reinforcement Learning Agents',
  'Finite Element Method Engineering Stress Analysis',
  'Thermodynamics Solved Numerical Formula Booklet',
  'Fluid Mechanics Bernoulli & Pipe Flow Problems',
  'Structural Mechanics Beam Deflection & Trusses Notes',
  'Environmental Science Ecosystems & Green Tech Guide',
  'Engineering Physics Quantum & Wave Optics Solved PYQs',
  'Engineering Chemistry Polymer & Corrosion Notes',
  'Linear Algebra Vector Spaces & Eigenvalues Manual',
  'Probability & Statistics Random Variables Cheatsheet',
  'Algorithm Design Dynamic Programming & Greedy Solved Papers',
  'Graph Theory Shortest Path & Flow Network Notes',
  'Cryptographic Hash Functions & RSA Encryption Guide',
  'Docker & Kubernetes Microservices Deployment Cheatsheet',
  'Linux Command Line & Bash Scripting Cheat Sheet',
  'Git & GitHub Version Control Collaboration Manual',
  'LeetCode Top 150 Interview Questions & Code Solutions',
  'System Design Interview Scalability Architecture Guide',
  'Computer Architecture RISC-V Instruction Set Manual',
  'Assembly Language x86 Programming Lab Manual',
  'Numerical Methods Newton-Raphson & Integration Notes',
  'Signals & Systems Z-Transform & Laplace Cheatsheet',
  'Control Systems Bode Plot & Nyquist Stability Guide',
  'Power Electronics Inverters & Converters Manual',
  'Analog Communication FM & AM Modulation Notes',
  'Digital Electronics Logic Gates & Flip-Flops PYQ',
  'Construction Material Testing & Civil Engineering Lab Manual'
];

export const academicResources: AcademicResource[] = resourceTitles.map((title, i) => {
  const type = resTypes[i % resTypes.length];
  const dept = deptsList[i % deptsList.length];
  const sub = academicSubjects.find(s => s.department === dept) || academicSubjects[i % academicSubjects.length];

  return {
    id: `res_${i + 1}`,
    title,
    subject: sub.name,
    department: dept,
    semester: (i % 8) + 1,
    type,
    author: `${dept.split(' ')[0]} Faculty & Toppers Union`,
    uploadedDate: `July ${22 - (i % 18)}, 2026`,
    downloads: 450 + (i * 90),
    rating: Number((4.6 + (i % 5) * 0.08).toFixed(1)),
    fileSize: `${(3.2 + (i * 0.7)).toFixed(1)} MB`,
    format: i % 4 === 0 ? 'DOCX' : 'PDF',
    tags: [type, dept.split(' ')[0], 'Exam Vault', 'Verified'],
    previewUrl: '#'
  };
});

// ----------------------------------------------------
// 9. FRESHERS GUIDE ITEMS (50 items)
// ----------------------------------------------------
const freshersCategories: ('Checklist' | 'Rules' | 'Contacts' | 'Navigation' | 'FAQ')[] = [
  'Checklist', 'Rules', 'Contacts', 'Navigation', 'FAQ'
];

const freshersTitles = [
  'First-Week Administrative Survival Checklist',
  'Campus Conduct, Curfew & Code of Ethics',
  '24/7 Campus Emergency & Medical Helplines',
  'Campus Navigation, E-Shuttle Buggies & Bus Routes',
  'How to Register for High-Speed Campus WiFi Network?',
  'Procedure to Collect Physical Student RFID Identity Card',
  'Library Book Bank & Digital Reading Kiosk Membership',
  'Biometric Attendance Rules & Minimum 75% Requirement',
  'Hostel Room Allocation, Mess Timings & Laundry Rules',
  'Anti-Ragging Helpline & Student Welfare Contact Details',
  'How to Apply for Bonafide Student Certificate Online?',
  'Procedure to Book Private 24/7 Library Study Pods',
  'Hostel Leave Permission & Parent OTP Night Gate Pass',
  'How to Join Official University WhatsApp & Discord Channels?',
  'Campus Canteen Food Court Digital Payment Registration',
  'Bicycle Rental & Eco-Friendly Campus Mobility Scheme',
  'How to Reserve Sports Arena Badminton & Squash Courts?',
  'Procedure to Join Student Technical & Cultural Clubs',
  'Campus Health Clinic Doctor Availability & Pharmacy Hours',
  'How to Report IT Helpdesk Network & Hardware Issues?',
  'Scholarship Application & Financial Assistance Helpdesk',
  'Lost and Found Counter Location & Claim Procedure',
  'Campus ATM, Bank Branch & Single Window Fee Counters',
  'Hostel Visitor Rules & Guest Accommodation Booking',
  'How to Access IEEE Xplore & Springer Digital Research Papers?',
  'University Exam Fee Payment Portal Guide',
  'Grade Point Average (GPA) & CGPA Calculation System',
  'How to Request Subject Elective Changes in Semester 3?',
  'Campus Auditorium Event Booking & Ticket Reservations',
  'Procedure for Duplicate RFID ID Card Re-issuance',
  'University Swimming Pool Pass & Timings for Boys/Girls',
  'Gymnasium Registration & Personal Fitness Trainer Hours',
  'Campus Innovation Hub & Startup Incubator Access Policy',
  'How to Apply for International Student Exchange Program?',
  'Departmental HOD Office Hours & Mentorship Allotment',
  'Class Representative (CR) Election Procedure & Rules',
  'Campus Green Environment & Single-Use Plastic Ban Rules',
  'Emergency Fire Evacuation Routes & Assembly Points',
  'How to Submit Medical Leave Certificate for Attendance Exemption?',
  'Campus Printing & Photocopy Center Locations and Charges',
  'How to Access University Email on Mobile Phone Outlook?',
  'Plagiarism Policy & Turnitin Checker Access for Assignments',
  'How to Form a Hackathon Team via SCE FIESTA?',
  'Placement Cell Training Registration for 5th Semester',
  'Alumni Network Connection & Professional Guidance',
  'Campus Cafe & Smoothie Bar Timings & Student Discounts',
  'Music Room & Cultural Instrument Issue Rules',
  'Robotics Lab Component Issue & Safety Guidelines',
  'University Transport Pass for Day Scholar City Bus Routes',
  'Freshers Orientation Week Master Schedule & Welcome Party'
];

export const freshersGuideItems: FreshersItem[] = freshersTitles.map((title, i) => {
  const cat = freshersCategories[i % freshersCategories.length];
  return {
    id: `fr_${i + 1}`,
    category: cat,
    title,
    description: `Official handbook procedures and guidelines regarding ${title.toLowerCase()} for university students.`,
    details: [
      `Step 1: Open SCE FIESTA portal and select your respective Department.`,
      'Step 2: Verify your student credentials and RFID smart card number.',
      'Step 3: Complete online form submission or visit designated department desk.',
      'Step 4: Contact 24/7 campus helpdesk at Ext 100 for immediate assistance.'
    ],
    urgent: i % 6 === 0,
    contactNumber: i % 4 === 0 ? '+91 98765 00000' : undefined
  };
});

export const samplePrompts = [
  "Where is my next class right now and how do I reach there?",
  "Plan my complete first day on campus with map and faculty list!",
  "Find me technical clubs and upcoming hackathons in CSE & AI depts.",
  "What is the procedure to apply for hostel leave or bonafide certificate?",
  "Show me my current CGPA breakdown and attendance risk report."
];
