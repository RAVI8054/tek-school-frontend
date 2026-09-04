// Realistic seed data for the TekSchool admin dashboard.
export const TRACKS = ['AI Engineering', 'Cloud Engineering', 'Software Engineering'];

const NAMES = [
  'Aarav Sharma','Ananya Rao','Rohit Menon','Priya Iyer','Karan Verma','Meera Suresh','Divya Pillai','Arjun Nair','Rhea Mehta','Faisal Khan',
  'Vikram Reddy','Sneha Kapoor','Ishaan Bose','Aditi Deshmukh','Nikhil Joshi','Kavya Krishnan','Rahul Patil','Tara Menon','Yash Agarwal','Neha Bhat',
  'Sanjay Chawla','Isha Malhotra','Aakash Rao','Pooja Shetty','Devansh Gupta','Riya Saxena','Harsh Patel','Anika Balaji','Kabir Singh','Zara Ali',
  'Sameer Kulkarni','Aditya Menon','Nisha Rao','Varun Bhaskar','Diya Prabhu','Om Prakash','Shivani Rao','Aryan Mishra','Lavanya Rao','Kunal Jain',
];

function pick(arr, i) { return arr[i % arr.length]; }

export const COHORTS = [
  { id: 'AI-01', name: "AI-01 · Jan '26", track: 'AI Engineering', start: '2026-01-06', end: '2026-12-15', capacity: 30, mentor: 'Ananya Rao' },
  { id: 'AI-02', name: "AI-02 · Mar '26", track: 'AI Engineering', start: '2026-03-03', end: '2027-02-10', capacity: 30, mentor: 'Rohit Menon' },
  { id: 'CE-01', name: "CE-01 · Feb '26", track: 'Cloud Engineering', start: '2026-02-04', end: '2026-11-20', capacity: 28, mentor: 'Priya Iyer' },
  { id: 'CE-02', name: "CE-02 · Apr '26", track: 'Cloud Engineering', start: '2026-04-07', end: '2027-01-15', capacity: 28, mentor: 'Sameer Kulkarni' },
  { id: 'SE-01', name: "SE-01 · Jan '26", track: 'Software Engineering', start: '2026-01-13', end: '2026-12-05', capacity: 32, mentor: 'Vikram Reddy' },
  { id: 'SE-02', name: "SE-02 · May '26", track: 'Software Engineering', start: '2026-05-05', end: '2027-02-25', capacity: 32, mentor: 'Kavya Krishnan' },
];

export const STUDENTS = NAMES.map((name, i) => {
  const cohort = pick(COHORTS, i);
  const attendance = 60 + ((i * 7) % 40);
  const completion = 45 + ((i * 11) % 55);
  const placementStages = ['Not started', 'Preparing', 'Interviewing', 'Offer', 'Placed'];
  return {
    id: `stu_${i + 1}`,
    name,
    email: name.toLowerCase().replace(/\s+/g, '.') + '@student.tek.school',
    track: cohort.track,
    cohort: cohort.name,
    enrolledAt: new Date(2026, (i % 6), 5 + (i % 20)).toISOString().slice(0, 10),
    attendance,
    completion,
    placement: pick(placementStages, i + 2),
    atRisk: attendance < 70 || completion < 55,
    phone: `+91 9${String(100000000 + i * 1234567).slice(0, 9)}`,
    city: pick(['Bengaluru','Hyderabad','Chennai','Mumbai','Pune','Kochi','Delhi'], i),
  };
});

export const ENQUIRIES = Array.from({ length: 24 }).map((_, i) => {
  const stages = ['New','Contacted','Demo Booked','Enrolled','Lost'];
  const nm = pick(NAMES, i + 3);
  return {
    id: `enq_${i+1}`, name: nm,
    phone: `+91 98${String(10000000 + i * 971).slice(0, 8)}`,
    email: nm.split(' ')[0].toLowerCase() + i + '@gmail.com',
    track: pick(TRACKS, i),
    source: pick(['Website','WhatsApp','Instagram','Referral'], i),
    createdAt: new Date(2026, 6, 1 + (i % 28)).toISOString().slice(0, 10),
    stage: pick(stages, i),
    counselor: pick(['Neha','Rahul','Isha'], i),
    notes: pick(['Wants weekend batch.','Family reviewing fees.','Booked demo for Fri.','Enrolled — payment pending.','Went with competitor.'], i),
  };
});

export const JOB_POSTS = [
  { id: 'job_1', role: 'AI Engineer — LLM Products', company: 'Razorpay', track: 'AI Engineering', location: 'Bengaluru · Hybrid', salary: '₹18–24 LPA', postedDays: 2, applicants: 14, status: 'Open' },
  { id: 'job_2', role: 'ML Engineer, Search', company: 'Meesho', track: 'AI Engineering', location: 'Bengaluru', salary: '₹16–22 LPA', postedDays: 4, applicants: 22, status: 'Open' },
  { id: 'job_3', role: 'Cloud SRE', company: 'Zerodha', track: 'Cloud Engineering', location: 'Bengaluru', salary: '₹15–20 LPA', postedDays: 5, applicants: 11, status: 'Open' },
  { id: 'job_4', role: 'Backend Engineer', company: 'Cred', track: 'Software Engineering', location: 'Bengaluru', salary: '₹18–26 LPA', postedDays: 6, applicants: 30, status: 'Open' },
  { id: 'job_5', role: 'DevOps Engineer', company: 'Freshworks', track: 'Cloud Engineering', location: 'Chennai', salary: '₹14–18 LPA', postedDays: 8, applicants: 9, status: 'Closed' },
  { id: 'job_6', role: 'Full-stack Engineer', company: 'Postman', track: 'Software Engineering', location: 'Remote', salary: '₹16–22 LPA', postedDays: 10, applicants: 17, status: 'Open' },
];

export const PLACEMENTS = STUDENTS.slice(0, 22).map((s, i) => ({
  id: `plc_${i+1}`, student: s.name, company: pick(['Razorpay','Meesho','Cred','Zerodha','Freshworks','Postman','Swiggy','Zomato'], i),
  role: pick(['AI Engineer','ML Engineer','Backend Engineer','SRE','DevOps','Cloud Engineer','Data Engineer'], i),
  stage: pick(['Applied','Screening','Interview','Offer','Placed'], i),
  updatedDays: (i % 10) + 1,
}));

export const HIRING_PARTNERS = [
  { id: 'hp_1', company: 'Razorpay', contact: 'Priyank Nair', email: 'priyank@razorpay.com', activeRoles: 2, hires: 7, track: 'AI Engineering' },
  { id: 'hp_2', company: 'Meesho', contact: 'Anjali Rao', email: 'anjali@meesho.com', activeRoles: 1, hires: 4, track: 'AI Engineering' },
  { id: 'hp_3', company: 'Cred', contact: 'Suresh Patel', email: 'suresh@cred.club', activeRoles: 2, hires: 5, track: 'Software Engineering' },
  { id: 'hp_4', company: 'Zerodha', contact: 'Ritika Sharma', email: 'ritika@zerodha.com', activeRoles: 1, hires: 3, track: 'Cloud Engineering' },
];

export const INSTRUCTORS = [
  { id: "ins_1", name: "Ananya Rao", track: "AI Engineering", cohorts: ["AI-01","AI-02"], upcomingSessions: 4, rating: 4.8, bio: "Ex-Google Brain. Leads applied AI." },
  { id: "ins_2", name: "Rohit Menon", track: "AI Engineering", cohorts: ["AI-02"], upcomingSessions: 3, rating: 4.7, bio: "MLOps at scale — ex-Flipkart." },
  { id: "ins_3", name: "Priya Iyer", track: "Cloud Engineering", cohorts: ["CE-01"], upcomingSessions: 5, rating: 4.9, bio: "AWS Hero. Ex-Amazon SDE-III." },
  { id: "ins_4", name: "Sameer Kulkarni", track: "Cloud Engineering", cohorts: ["CE-02"], upcomingSessions: 3, rating: 4.6, bio: "Kubernetes contributor." },
  { id: "ins_5", name: "Vikram Reddy", track: "Software Engineering", cohorts: ["SE-01"], upcomingSessions: 4, rating: 4.8, bio: "Staff engineer at Cred." },
  { id: "ins_6", name: "Kavya Krishnan", track: "Software Engineering", cohorts: ["SE-02"], upcomingSessions: 5, rating: 4.9, bio: "System design specialist." },
];

export const ADMIN_ASSIGNMENTS = [
  { id: "asg_1", title: "Mini RAG over arXiv abstracts", module: "Applied AI · Week 5", cohort: "AI-02", dueDate: "2026-07-22", submitted: 18, pending: 6, graded: 12 },
  { id: "asg_2", title: "LoRA fine-tune write-up", module: "Applied AI · Week 6", cohort: "AI-02", dueDate: "2026-07-29", submitted: 4, pending: 20, graded: 0 },
  { id: "asg_3", title: "Kubernetes HPA lab", module: "Cloud · Week 4", cohort: "CE-01", dueDate: "2026-07-21", submitted: 22, pending: 6, graded: 15 },
  { id: "asg_4", title: "Distributed cache design doc", module: "Systems · Week 8", cohort: "SE-01", dueDate: "2026-07-30", submitted: 10, pending: 22, graded: 0 },
];

export const FINANCE = STUDENTS.slice(0, 24).map((s, i) => ({
  student: s.name, track: s.track,
  plan: pick(["Upfront","EMI 3","EMI 6","EMI 12"], i),
  total: 240000, paid: 240000 - ((i * 13) % 100000),
  dueIn: (i % 30),
}));

export const KPIS = {
  activeStudents: { value: 164, delta: 12 },
  newEnquiriesMonth: { value: 48, delta: 8 },
  conversionRate: { value: 34, delta: 3 },
  placementRate: { value: 94, delta: 2 },
  revenueMonth: { value: 4800000, delta: 18 },
};

export const ENROLLMENT_TREND = [38,42,45,40,52,58,61,55,68,72,78,85];
export const TRACK_POPULARITY = [
  { track: 'AI Eng', count: 72 },
  { track: 'Cloud Eng', count: 48 },
  { track: 'Software Eng', count: 44 },
];
export const ENQUIRY_FUNNEL = [
  { label: 'Leads', value: 480 },
  { label: 'Contacted', value: 312 },
  { label: 'Demo', value: 184 },
  { label: 'Enrolled', value: 48 },
];
export const ATTENTION = [
  { label: '3 students below 60% attendance — cohort AI-01', to: '/admin/students', cta: 'Review students' },
  { label: '5 assignments ungraded for > 7 days', to: '/admin/assignments', cta: 'Grade now' },
  { label: '2 enquiries not contacted in 48 hrs', to: '/admin/enquiries', cta: 'Follow up' },
  { label: 'Revenue vs target: 82% — 3 days left', to: '/admin/finance', cta: 'See finance' },
];
export const AUDIT = [
  { id: 1, when: '10:24 AM', who: 'Neha', action: 'Added student Aryan Mishra to CE-02' },
  { id: 2, when: '9:58 AM', who: 'Rahul', action: 'Updated enquiry enq_14 to Demo Booked' },
  { id: 3, when: '9:32 AM', who: 'Admin', action: 'Published 3 assignments for AI-01' },
];
export const ROLE_ACCESS = {
  admin: ['overview','students','cohorts','instructors','salesteam','assignments','content','workshops','enquiries','enquiries-admission','enquiries-tekcampus','placements','outreach','pages','canvas','marketing','community','finance','settings'],
  admissions: ['enquiries','enquiries-admission','enquiries-tekcampus','placements'],
  salesteam: ['overview','enquiries','enquiries-admission','enquiries-tekcampus'],
  instructor: ['students','assignments','content'],
  finance: ['finance'],
};
