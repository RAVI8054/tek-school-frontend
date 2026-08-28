// Realistic mock data for the student dashboard. Track: AI Engineering.










































































// Dates relative to "today" for a realistic feel.
const now = new Date();
const iso = (dayOffset, hour = 18) => {
  const d = new Date(now);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const CLASSES = [
{ id: "c1", topic: "Transformers from scratch — attention head walkthrough", instructor: "Ananya Rao", date: iso(0, 19), duration: "90 min", module: "Applied AI · Week 5", status: "upcoming", joinUrl: "#" },
{ id: "c2", topic: "RAG pipelines: chunking, embeddings, retrieval scoring", instructor: "Rohit Menon", date: iso(2, 19), duration: "90 min", module: "Applied AI · Week 5", status: "upcoming", joinUrl: "#" },
{ id: "c3", topic: "Fine-tuning with LoRA on a domain corpus", instructor: "Ananya Rao", date: iso(4, 19), duration: "120 min", module: "Applied AI · Week 6", status: "upcoming", joinUrl: "#" },
{ id: "c4", topic: "Deep learning fundamentals — backprop deep dive", instructor: "Priya Iyer", date: iso(-3, 19), duration: "90 min", module: "Core ML · Week 4", status: "completed", progress: 100 },
{ id: "c5", topic: "Weights & Biases: experiment tracking in practice", instructor: "Rohit Menon", date: iso(-5, 19), duration: "60 min", module: "Core ML · Week 4", status: "completed", progress: 100 },
{ id: "c6", topic: "Data engineering with pandas — real datasets", instructor: "Priya Iyer", date: iso(-7, 19), duration: "90 min", module: "Foundations · Week 3", status: "missed", progress: 0 },
{ id: "c7", topic: "Modern PyTorch — building your first training loop", instructor: "Ananya Rao", date: iso(-10, 19), duration: "120 min", module: "Foundations · Week 2", status: "completed", progress: 72 },
{ id: "c8", topic: "Vector databases: Pinecone, Weaviate, pgvector compared", instructor: "Rohit Menon", date: iso(-12, 19), duration: "75 min", module: "Applied AI · Week 4", status: "missed", progress: 0 },
{ id: "c9", topic: "Prompt engineering patterns for production LLMs", instructor: "Ananya Rao", date: iso(-14, 19), duration: "60 min", module: "Applied AI · Week 3", status: "missed", progress: 0 },
{ id: "c10", topic: "Guest talk — MLOps at Razorpay", instructor: "Priyank G. (Razorpay)", date: iso(-16, 20), duration: "60 min", module: "Guest series", status: "missed", progress: 0 },
{ id: "c11", topic: "Evaluation harnesses: BLEU, ROUGE, LLM-as-judge", instructor: "Priya Iyer", date: iso(-18, 19), duration: "90 min", module: "Core ML · Week 3", status: "missed", progress: 0 }];


export const ASSIGNMENTS = [
{ id: "a1", title: "Build a mini RAG over 500 arXiv abstracts", module: "Applied AI · Week 5", dueDate: iso(1, 23), status: "due", submissionType: "Code repo" },
{ id: "a2", title: "Attention math worksheet", module: "Applied AI · Week 5", dueDate: iso(3, 23), status: "due", submissionType: "File upload" },
{ id: "a3", title: "Backprop by hand — 3-layer MLP", module: "Core ML · Week 4", dueDate: iso(-2, 23), status: "submitted", submissionType: "File upload" },
{ id: "a4", title: "W&B experiment: MNIST hyperparam sweep", module: "Core ML · Week 4", dueDate: iso(-4, 23), status: "reviewed", submissionType: "Code repo", grade: "A", feedback: "Great sweep design. Add a validation curve plot next time — it made your best-model justification thin." },
{ id: "a5", title: "Pandas cleaning drill — messy retail dataset", module: "Foundations · Week 3", dueDate: iso(-8, 23), status: "reviewed", submissionType: "Code repo", grade: "B+", feedback: "Solid. Watch for chained assignment — a couple of your fillna calls were silently no-ops on views." },
{ id: "a6", title: "Linear algebra checkpoint quiz", module: "Foundations · Week 1", dueDate: iso(-14, 23), status: "overdue", submissionType: "Quiz" }];



export const JOBS = [
{ id: "j1", role: "AI Engineer — LLM Products", company: "Razorpay", location: "Bengaluru · Hybrid", matchTrack: "AI Engineering", postedDays: 2, salary: "₹18–24 LPA", logoDomain: "razorpay.com", seniority: "Mid-level (2–4 yrs)", team: "AI Platform",
  about: "Razorpay is India's leading full-stack payments and financial solutions company. The AI Platform team builds LLM-powered products across support, risk, and merchant experience.",
  responsibilities: ["Design and ship RAG pipelines over merchant + policy corpora", "Own eval harnesses for hallucination, retrieval quality, latency", "Partner with product on 2 net-new LLM features per quarter"],
  requirements: ["Strong Python + PyTorch, comfortable reading transformer papers", "Shipped at least one production LLM feature end-to-end", "Solid grasp of vector search, chunking strategies, prompt engineering"],
  benefits: ["Top-of-market ESOPs", "Learning budget ₹1L/yr", "Flexible hybrid — 3 days in office"] },
{ id: "j2", role: "ML Engineer, Search & Ranking", company: "Meesho", location: "Bengaluru · On-site", matchTrack: "AI Engineering", postedDays: 4, salary: "₹16–22 LPA", logoDomain: "meesho.com", seniority: "Mid-level", team: "Discovery",
  about: "Meesho is India's largest true-marketplace for the next billion users. Search & Ranking powers every product a user sees.",
  responsibilities: ["Improve query understanding for low-resource Indic languages", "Build learning-to-rank models on real click-stream data", "A/B test at 100M+ user scale"],
  requirements: ["Two-tower / cross-encoder retrieval experience", "Comfortable with PyTorch, Airflow, Spark", "Product intuition — you can define your own success metric"] },
{ id: "j3", role: "Applied AI Engineer (Fresher)", company: "Freshworks", location: "Chennai · Hybrid", matchTrack: "AI Engineering", postedDays: 6, salary: "₹14–18 LPA", logoDomain: "freshworks.com", seniority: "Entry level", team: "Freddy AI",
  about: "Freshworks builds delightful business software. Freddy AI is the LLM copilot embedded across support, sales, and marketing.",
  responsibilities: ["Prototype LLM features in weekly sprints", "Own evaluation datasets for a product area", "Ship one production feature within your first 90 days"],
  requirements: ["CS/Engineering fresher, strong CS fundamentals", "Portfolio with at least one ML project you built end-to-end", "Comfortable writing Python and reading production code"] },
{ id: "j4", role: "AI Platform Engineer", company: "CRED", location: "Bengaluru · On-site", matchTrack: "AI Engineering", postedDays: 8, salary: "₹20–28 LPA", logoDomain: "cred.club", seniority: "Senior", team: "Platform",
  about: "CRED is a members-only club for India's most trustworthy and creditworthy individuals. The AI Platform team owns the internal tooling every ML/LLM team ships on.",
  responsibilities: ["Own model serving infra (Triton, vLLM) at low-latency SLAs", "Build the org-wide feature store + eval platform", "Mentor 2–3 mid-level engineers"],
  requirements: ["5+ yrs in ML infra / distributed systems", "Deep Kubernetes + observability experience", "Have run inference at >1k QPS in production"] }];


export const APPLICATIONS = [
{ id: "p1", role: "AI Engineer — LLM Products", company: "Razorpay", stage: "Interview", lastUpdate: "2 days ago" },
{ id: "p2", role: "ML Engineer, Search & Ranking", company: "Meesho", stage: "Screening", lastUpdate: "4 days ago" },
{ id: "p3", role: "Applied AI Engineer", company: "Postman", stage: "Applied", lastUpdate: "1 day ago" },
{ id: "p4", role: "AI Platform Engineer", company: "Zerodha", stage: "Offer", lastUpdate: "just now" }];


export const EVENTS = [
{ id: "e1", title: "Resume clinic with placement team", date: iso(3, 17), kind: "Resume clinic" },
{ id: "e2", title: "Mock interview — system design", date: iso(5, 15), kind: "Mock interview" },
{ id: "e3", title: "Recruiter meet: Razorpay + Cred", date: iso(9, 16), kind: "Recruiter meet" },
{ id: "e4", title: "Portfolio review — 1:1 with Ananya", date: iso(11, 14), kind: "Portfolio review" }];


export const COHORT = [
{ name: "Meera S.", role: "Ex-analyst · switching to AI", initials: "MS", online: true, photo: "https://randomuser.me/api/portraits/women/44.jpg" },
{ name: "Karan V.", role: "Backend eng · 3 yrs", initials: "KV", online: true, photo: "https://randomuser.me/api/portraits/men/32.jpg" },
{ name: "Divya P.", role: "Fresher · CS grad", initials: "DP", online: false, photo: "https://randomuser.me/api/portraits/women/68.jpg" },
{ name: "Arjun N.", role: "Data scientist", initials: "AN", online: true, photo: "https://randomuser.me/api/portraits/men/41.jpg" },
{ name: "Rhea M.", role: "PM to engineer", initials: "RM", online: false, photo: "https://randomuser.me/api/portraits/women/25.jpg" },
{ name: "Faisal K.", role: "Full-stack · self-taught", initials: "FK", online: true, photo: "https://randomuser.me/api/portraits/men/76.jpg" }];


export const MENTORS = [
{ name: "Ananya Rao", role: "Lead mentor · AI Engineering", initials: "AR", online: true, photo: "https://randomuser.me/api/portraits/women/65.jpg" },
{ name: "Rohit Menon", role: "MLOps mentor", initials: "RM", online: false, photo: "https://randomuser.me/api/portraits/men/54.jpg" },
{ name: "Priya Iyer", role: "Core ML mentor", initials: "PI", online: true, photo: "https://randomuser.me/api/portraits/women/12.jpg" }];



export const RESOURCES = [
{ title: "AI Engineering — full curriculum PDF", kind: "PDF", desc: "48-week program breakdown with reading list.", href: "#" },
{ title: "RAG pipeline cheat sheet", kind: "PDF", desc: "Chunking, embeddings, and retrieval scoring in one page.", href: "#" },
{ title: "Recorded session library", kind: "Recording", desc: "Every live class, watchable at 1.25× or 1.5×.", href: "#" },
{ title: "GPU sandbox — 20 hrs/week credit", kind: "Tool", desc: "A100 access for training runs. Login via cohort dashboard.", href: "#" },
{ title: "Vector DB playground", kind: "Tool", desc: "Free Pinecone-compatible sandbox for coursework.", href: "#" },
{ title: "FAQ — attendance, submissions, mentor slots", kind: "FAQ", desc: "The stuff you'll ask in week 2.", href: "#" }];


export const ANNOUNCEMENT = {
  title: "Guest talk added: on-call for LLM systems",
  body: "Priyank from Razorpay joins us Friday 8 PM to walk through his team's on-call rotation for their RAG assistant.",
  date: "Posted today"
};

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}
export function relativeDay(iso) {
  const d = new Date(iso);
  const days = Math.round((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 0) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
}

/* ------------------ Gamification ------------------ */




export const GAMIFICATION = {
  level: 7,
  xp: 3420,
  xpForNext: 4500,
  streak: 12,
  totalBadges: 24,
  weeklyRank: 4
};

export const BADGES = [
{ id: "b1", name: "First Ship", desc: "Submitted your first assignment.", icon: "rocket", earned: true, earnedOn: "Week 1", rarity: "common", xp: 50 },
{ id: "b2", name: "Streak Starter", desc: "7-day learning streak.", icon: "flame", earned: true, earnedOn: "Week 2", rarity: "common", xp: 100 },
{ id: "b3", name: "Deep Diver", desc: "Watched every recording in a module.", icon: "brain", earned: true, earnedOn: "Week 3", rarity: "rare", xp: 200 },
{ id: "b4", name: "Peer Reviewer", desc: "Reviewed 5 peers' assignments.", icon: "medal", earned: true, earnedOn: "Week 4", rarity: "rare", xp: 200 },
{ id: "b5", name: "Quiz Ace", desc: "Perfect score on 3 quizzes.", icon: "zap", earned: true, earnedOn: "Week 4", rarity: "rare", xp: 250 },
{ id: "b6", name: "Sharp Shooter", desc: "Submit 5 assignments on time.", icon: "target", earned: true, earnedOn: "Week 5", rarity: "epic", xp: 300 },
{ id: "b7", name: "Mentor Magnet", desc: "Received 10 mentor kudos.", icon: "sparkles", earned: false, rarity: "epic", xp: 400 },
{ id: "b8", name: "30-Day Warrior", desc: "30-day learning streak.", icon: "flame", earned: false, rarity: "epic", xp: 500 },
{ id: "b9", name: "Capstone Champion", desc: "Ship your capstone project.", icon: "trophy", earned: false, rarity: "legendary", xp: 1000 },
{ id: "b10", name: "Top of Cohort", desc: "Finish #1 on weekly leaderboard.", icon: "trophy", earned: false, rarity: "legendary", xp: 800 },
{ id: "b11", name: "Community Pillar", desc: "Answer 25 questions in #help.", icon: "medal", earned: false, rarity: "epic", xp: 400 },
{ id: "b12", name: "Interview Ready", desc: "Complete 3 mock interviews.", icon: "zap", earned: false, rarity: "rare", xp: 300 }];


export const QUESTS = [
{ id: "q1", title: "Ship this week's RAG assignment", desc: "Submit before Friday 11:59 PM IST", progress: 0, total: 1, xp: 200, expires: "In 3 days" },
{ id: "q2", title: "Watch 2 recorded sessions", desc: "Any missed session counts", progress: 1, total: 2, xp: 100, expires: "In 3 days" },
{ id: "q3", title: "Answer 3 questions in #help", desc: "Help unblocks someone else", progress: 2, total: 3, xp: 80, expires: "In 3 days" },
{ id: "q4", title: "Attend Friday's live class", desc: "Guest talk with Priyank from Razorpay", progress: 0, total: 1, xp: 120, expires: "In 4 days" }];


export const LEADERBOARD = [
{ rank: 1, name: "Meera S.", initials: "MS", xp: 4820, photo: "https://randomuser.me/api/portraits/women/44.jpg" },
{ rank: 2, name: "Karan V.", initials: "KV", xp: 4110, photo: "https://randomuser.me/api/portraits/men/32.jpg" },
{ rank: 3, name: "Arjun N.", initials: "AN", xp: 3690, photo: "https://randomuser.me/api/portraits/men/41.jpg" },
{ rank: 4, name: "You", initials: "YU", xp: 3420, isYou: true, photo: "https://randomuser.me/api/portraits/men/85.jpg" },
{ rank: 5, name: "Faisal K.", initials: "FK", xp: 3210, photo: "https://randomuser.me/api/portraits/men/76.jpg" },
{ rank: 6, name: "Divya P.", initials: "DP", xp: 2980, photo: "https://randomuser.me/api/portraits/women/68.jpg" },
{ rank: 7, name: "Rhea M.", initials: "RM", xp: 2740, photo: "https://randomuser.me/api/portraits/women/25.jpg" }];


export const ACTIVITY = [
{ id: "a1", when: "2h ago", text: "You earned +50 XP for submitting Backprop by hand", type: "xp" },
{ id: "a2", when: "Yesterday", text: "You unlocked the Sharp Shooter badge", type: "badge" },
{ id: "a3", when: "2d ago", text: "Ananya kudos'd your W&B write-up (+30 XP)", type: "kudos" },
{ id: "a4", when: "3d ago", text: "You maintained a 10-day streak (+20 XP)", type: "streak" },
{ id: "a5", when: "4d ago", text: "You moved up 2 spots on the weekly leaderboard", type: "rank" }];