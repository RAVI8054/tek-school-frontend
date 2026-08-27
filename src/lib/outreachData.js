// Realistic mock data for outreach: school authorities, HR contacts, page content, canvas templates.

const INSTITUTIONS = [
  "PES University", "RV College of Engineering", "BMS College of Engineering", "MS Ramaiah Institute",
  "Christ University", "Mount Carmel College", "Jain University", "Dayananda Sagar College",
  "St. Joseph's College", "New Horizon College", "Presidency College", "Kristu Jayanti College",
  "Alliance University", "Reva University", "NMKRV College", "CMR Institute of Technology",
  "Bangalore Institute of Technology", "Sir MVIT", "Nitte Meenakshi Institute", "Acharya Institute",
];

const FIRST = ["Ramesh","Sunitha","Prakash","Latha","Anil","Meena","Suresh","Kavitha","Girish","Padma","Ravi","Sudha","Mahesh","Deepa","Vinod","Anita","Naveen","Shobha","Kiran","Rekha"];
const LAST = ["Kulkarni","Rao","Iyer","Menon","Shetty","Bhat","Nair","Krishnan","Reddy","Gowda","Hegde","Prabhu","Pillai","Murthy","Desai","Kamath","Achar","Ballal","Rajan","Pai"];
const SEGMENTS = ["Principal","Dean","Placement Cell","HoD","Career Counselor"];
const ROLES = {
  "Principal": ["Principal","Vice Principal"],
  "Dean": ["Dean of Academics","Dean of Student Affairs","Associate Dean"],
  "Placement Cell": ["Head - Placements","Placement Officer","Training & Placement Officer"],
  "HoD": ["HoD - Computer Science","HoD - Information Science","HoD - AI & ML","HoD - Data Science"],
  "Career Counselor": ["Senior Career Counselor","Career Advisor","Student Counselor"],
};

function pick(a, i) { return a[i % a.length]; }
function phone(i) { return `+91 9${String(80000000 + i * 913127).slice(0, 9)}`; }

export const AUTHORITIES = Array.from({ length: 48 }).map((_, i) => {
  const seg = pick(SEGMENTS, i);
  const roles = ROLES[seg];
  const first = pick(FIRST, i + 3);
  const last = pick(LAST, i + 7);
  const inst = pick(INSTITUTIONS, i);
  const slug = inst.toLowerCase().replace(/[^a-z]+/g, "");
  return {
    id: `auth_${i + 1}`,
    name: `Dr. ${first} ${last}`,
    role: pick(roles, i),
    institution: inst,
    city: pick(["Bengaluru","Bengaluru","Bengaluru","Mysuru","Hubballi","Mangaluru"], i),
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${slug}.ac.in`,
    phone: phone(i + 11),
    segment: seg,
    lastContacted: i % 4 === 0 ? `${(i % 21) + 1}d ago` : undefined,
    tags: i % 3 === 0 ? ["hot lead"] : i % 5 === 0 ? ["responsive"] : [],
  };
});

export const HR_CONTACTS = [
  { id: "hr_1", name: "Priyank Nair", title: "Talent Acquisition Lead", company: "Razorpay", email: "priyank.n@razorpay.com", phone: "+91 98450 21123", linkedin: "linkedin.com/in/priyanknair", hiringFor: ["AI Engineer","ML Engineer"], confidence: 94, source: "LinkedIn · Company careers page" },
  { id: "hr_2", name: "Anjali Rao", title: "Sr. HR Business Partner", company: "Meesho", email: "anjali.rao@meesho.com", phone: "+91 99012 44518", linkedin: "linkedin.com/in/anjalirao", hiringFor: ["ML Engineer, Search"], confidence: 89, source: "LinkedIn · Verified" },
  { id: "hr_3", name: "Vishal Iyer", title: "Engineering Recruiter", company: "Cred", email: "vishal@cred.club", phone: "+91 98801 09912", linkedin: "linkedin.com/in/vishaliyer", hiringFor: ["Backend Engineer","Full-stack"], confidence: 92, source: "Company careers · LinkedIn" },
  { id: "hr_4", name: "Kailash Ravindran", title: "Head of People", company: "Zerodha", email: "kailash@zerodha.com", phone: "+91 98860 55401", linkedin: "linkedin.com/in/kailashr", hiringFor: ["Cloud SRE","DevOps"], confidence: 87, source: "LinkedIn" },
  { id: "hr_5", name: "Divya Menon", title: "Talent Partner - Tech", company: "Freshworks", email: "divya.m@freshworks.com", phone: "+91 99724 11238", linkedin: "linkedin.com/in/divyamenon", hiringFor: ["DevOps Engineer"], confidence: 82, source: "LinkedIn" },
  { id: "hr_6", name: "Rahul Bansal", title: "Recruiting Manager", company: "Postman", email: "rahul.bansal@postman.com", phone: "+91 98192 77014", linkedin: "linkedin.com/in/rahulbansal", hiringFor: ["Full-stack Engineer"], confidence: 90, source: "LinkedIn · Verified" },
  { id: "hr_7", name: "Neha Agarwal", title: "Sr. Recruiter", company: "Swiggy", email: "neha.a@swiggy.in", phone: "+91 96329 08822", linkedin: "linkedin.com/in/nehaagarwal", hiringFor: ["Backend","Data Engineer"], confidence: 85, source: "LinkedIn" },
  { id: "hr_8", name: "Arjun Malhotra", title: "Head - University Hiring", company: "Zomato", email: "arjun.m@zomato.com", phone: "+91 99872 55016", linkedin: "linkedin.com/in/arjunm", hiringFor: ["SDE-1","AI Engineer"], confidence: 88, source: "Careers page" },
  { id: "hr_9", name: "Sneha Kapoor", title: "Talent Acquisition", company: "PhonePe", email: "sneha.k@phonepe.com", phone: "+91 98456 33127", linkedin: "linkedin.com/in/snehakapoor", hiringFor: ["Backend Engineer"], confidence: 91, source: "LinkedIn" },
  { id: "hr_10", name: "Karthik Reddy", title: "Engineering Recruiter", company: "Groww", email: "karthik@groww.in", phone: "+91 90192 47708", linkedin: "linkedin.com/in/karthikreddy", hiringFor: ["Frontend","Full-stack"], confidence: 86, source: "LinkedIn · Verified" },
];

export const SITE_PAGES = [
  { slug: "home", title: "Home", path: "/", status: "Live", updatedAt: "2d ago", editor: "Neha",
    blocks: [
      { id: "b1", kind: "hero", heading: "Give wings to your career", subheading: "Industry-grade programmes in AI, Cloud & Software Engineering — built with hiring partners in Bengaluru.", ctaLabel: "Explore programmes", ctaHref: "/courses" },
      { id: "b2", kind: "stat", label: "Placement rate", value: "87%", note: "across 2025 cohorts" },
      { id: "b3", kind: "cta", heading: "Talk to an advisor", body: "One 20-minute call. Real fit assessment.", ctaLabel: "Book a call", ctaHref: "/contact" },
    ] },
  { slug: "about", title: "About Us", path: "/about", status: "Live", updatedAt: "6d ago", editor: "Rahul",
    blocks: [
      { id: "b1", kind: "hero", heading: "We teach the way work actually happens.", subheading: "Small cohorts, real projects, faculty from Google / Cred / Amazon.", ctaLabel: "Meet the team", ctaHref: "/instructors" },
      { id: "b2", kind: "text", heading: "Our mission", body: "Close the gap between college and top engineering roles — with mentorship, projects, and a real placement engine." },
    ] },
  { slug: "programs-ai", title: "AI Engineering", path: "/programs/ai-engineering", status: "Live", updatedAt: "1d ago", editor: "Ananya",
    blocks: [
      { id: "b1", kind: "hero", heading: "Ship AI products, not toy notebooks.", subheading: "12-month programme with 3-month paid internship.", ctaLabel: "Apply now", ctaHref: "/contact" },
      { id: "b2", kind: "stat", label: "Median offer", value: "₹18 LPA", note: "across last 3 cohorts" },
    ] },
  { slug: "gallery", title: "Gallery", path: "/gallery", status: "Draft", updatedAt: "4h ago", editor: "Neha", blocks: [] },
];

export const CANVAS_TEMPLATES = [
  { id: "t1", name: "Cohort Announcement", category: "Instagram Post", aspect: "1:1", palette: ["#1E1B4B","#5BA4E8","#F4A261"], usage: 24 },
  { id: "t2", name: "Placement Win", category: "Instagram Post", aspect: "1:1", palette: ["#1E1B4B","#F4A261"], usage: 41 },
  { id: "t3", name: "Weekend Workshop", category: "Story", aspect: "9:16", palette: ["#2D5FA8","#D4C4E8"], usage: 12 },
  { id: "t4", name: "Open House Poster", category: "Poster", aspect: "A4", palette: ["#1E1B4B","#5BA4E8"], usage: 7 },
  { id: "t5", name: "AMA — Faculty", category: "WhatsApp Status", aspect: "9:16", palette: ["#F4A261","#1E1B4B"], usage: 18 },
  { id: "t6", name: "Course Trailer", category: "YouTube Thumb", aspect: "16:9", palette: ["#2D5FA8","#F4A261"], usage: 9 },
];

export const OUTREACH_RUNS = [
  { id: "r1", when: "Yesterday · 4:12 PM", channel: "Email", audience: "Placement Cell · Bengaluru", recipients: 42, delivered: 41, replies: 6, subject: "TekSchool 2026 hiring drive — 168 job-ready engineers" },
  { id: "r2", when: "3d ago · 11:02 AM", channel: "WhatsApp", audience: "Principals · Karnataka", recipients: 28, delivered: 27, replies: 4, subject: "Campus AI workshop — free 90-min session" },
  { id: "r3", when: "1w ago · 6:20 PM", channel: "SMS", audience: "Career Counselors", recipients: 34, delivered: 33, replies: 2, subject: "AI Engineering cohort — scholarship deadline" },
];

export function draftMessage(opts) {
  const { channel, segment, goal, tone } = opts;
  const opener = tone === "Formal"
    ? "Dear {{name}},"
    : tone === "Direct"
    ? "Hi {{name}} —"
    : "Hi {{name}}, hope you're well!";

  const pitch =
    goal.toLowerCase().includes("hiring") || goal.toLowerCase().includes("placement")
      ? "We've got 168 job-ready engineers from our AI, Cloud, and Software Engineering cohorts graduating this quarter. Median offer last cohort was ₹18 LPA. Open to a 15-min intro call this week?"
      : goal.toLowerCase().includes("workshop") || goal.toLowerCase().includes("event")
      ? "We'd love to run a free 90-minute AI Engineering workshop for your students — no strings, faculty-led, hands-on. Can I share two possible dates?"
      : goal.toLowerCase().includes("partner")
      ? "TekSchool partners with 40+ colleges in Karnataka for guest lectures, hackathons, and placement pipelines. Would love to explore what fits {{institution}} best."
      : `Quick note about ${goal}. Would love your thoughts.`;

  const closer =
    tone === "Formal" ? "Warm regards,\nTeam TekSchool" : tone === "Direct" ? "— TekSchool" : "Cheers,\nNeha · TekSchool Partnerships";

  const subject =
    goal.toLowerCase().includes("hiring") ? "168 job-ready engineers — TekSchool 2026" :
    goal.toLowerCase().includes("workshop") ? `Free AI workshop for {{institution}}` :
    goal.toLowerCase().includes("partner") ? `TekSchool × {{institution}} — quick chat?` :
    `TekSchool — ${goal}`;

  if (channel === "SMS") {
    return { subject: "", body: `TekSchool: ${pitch.slice(0, 140)} Reply YES to connect. Opt-out: STOP` };
  }
  if (channel === "WhatsApp") {
    return { subject: "", body: `${opener}\n\n${pitch}\n\n${closer}` };
  }
  return {
    subject,
    body: `${opener}\n\nWriting from TekSchool — we work with the ${segment.toLowerCase()} community across Karnataka.\n\n${pitch}\n\n${closer}`,
  };
}
