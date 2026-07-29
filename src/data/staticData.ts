import { Classroom, CourseSubject, TimetableSlot, AcademicResource, FreshersItem } from '../types';

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

const deptsList = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics'
];

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
  const totalCls = 40 + (i % 8);
  const attendedCls = totalCls - (i % 6);

  return {
    id: `sub_${i + 1}`,
    code: `${dept.split(' ').map(w => w[0]).join('')}${300 + i + 1}`,
    name: `${title}`,
    credits: (i % 3) + 2,
    department: dept,
    semester: (i % 8) + 1,
    facultyName: 'Senior Department Faculty',
    facultyCabin: 'AB1-102',
    totalClasses: totalCls,
    attendedClasses: attendedCls,
    grade: ['O', 'A+', 'A', 'B+', 'B'][i % 5],
    syllabusUrl: '#'
  };
});

const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];
const times = [
  '09:00 AM - 10:00 AM', '10:15 AM - 11:15 AM', '11:30 AM - 12:30 PM',
  '01:30 PM - 02:30 PM', '02:45 PM - 03:45 PM', '04:00 PM - 05:00 PM'
];

export const timetableSlots: TimetableSlot[] = Array.from({ length: 54 }).map((_, i) => {
  const sub = academicSubjects[i % academicSubjects.length];

  return {
    id: `tt_${i + 1}`,
    day: days[i % days.length],
    time: times[i % times.length],
    subjectCode: sub.code,
    subjectName: sub.name,
    building: 'Alan Turing CSE Block',
    room: `${sub.department.split(' ')[0]}-Hall ${200 + (i % 15)}`,
    facultyName: 'Dr. Department Faculty',
    type: i % 4 === 0 ? 'Lab' : i % 5 === 0 ? 'Tutorial' : 'Lecture'
  };
});

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
