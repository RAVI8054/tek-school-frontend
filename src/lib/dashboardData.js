// Realistic mock data for the student dashboard. Track: AI Engineering.

const now = new Date();
const iso = (dayOffset, hour = 18) => {
  const d = new Date(now);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const CLASSES = [
  { id: 'c1', topic: 'Transformers & Attention Deep Dive', instructor: 'Dr. Priya Rao', date: iso(2), duration: '2 hrs', module: 'Deep Learning', status: 'upcoming', joinUrl: '#' },
  { id: 'c2', topic: 'RAG Pipeline Architecture', instructor: 'Vikram Reddy', date: iso(5), duration: '1.5 hrs', module: 'Applied AI', status: 'upcoming', joinUrl: '#' },
  { id: 'c3', topic: 'Fine-tuning BERT for NER', instructor: 'Ananya Singh', date: iso(9), duration: '2 hrs', module: 'NLP', status: 'upcoming', joinUrl: '#' },
  { id: 'c4', topic: 'Python Foundations & NumPy', instructor: 'Rohit Menon', date: iso(-7), duration: '2 hrs', module: 'Python', status: 'completed', progress: 100 },
  { id: 'c5', topic: 'Statistics for ML', instructor: 'Dr. Priya Rao', date: iso(-14), duration: '2 hrs', module: 'Statistics', status: 'completed', progress: 100 },
  { id: 'c6', topic: 'Supervised Learning Basics', instructor: 'Vikram Reddy', date: iso(-10), duration: '2 hrs', module: 'ML', status: 'completed', progress: 85 },
  { id: 'c7', topic: 'Neural Network Fundamentals', instructor: 'Ananya Singh', date: iso(-5), duration: '2 hrs', module: 'Deep Learning', status: 'completed', progress: 100 },
];

export const ASSIGNMENTS = [
  { id: 'a1', title: 'Mini RAG over arXiv papers', module: 'Applied AI', dueDate: iso(3, 23), status: 'due', submissionType: 'Code repo', grade: null, feedback: null },
  { id: 'a2', title: 'Implement attention from scratch', module: 'Deep Learning', dueDate: iso(6, 23), status: 'due', submissionType: 'Code repo' },
  { id: 'a3', title: 'Python data pipeline', module: 'Python', dueDate: iso(-5, 23), status: 'submitted', submissionType: 'Code repo', grade: '92/100', feedback: 'Excellent use of generators.' },
  { id: 'a4', title: 'EDA on Kaggle dataset', module: 'Statistics', dueDate: iso(-12, 23), status: 'reviewed', submissionType: 'File upload', grade: '87/100', feedback: 'Good visualisations, improve outlier handling.' },
  { id: 'a5', title: 'Logistic regression from scratch', module: 'ML', dueDate: iso(-8, 23), status: 'reviewed', submissionType: 'Code repo', grade: '95/100', feedback: 'Perfect implementation.' },
  { id: 'a6', title: 'CNN image classifier', module: 'Deep Learning', dueDate: iso(12, 23), status: 'due', submissionType: 'Code repo' },
];

export const ANNOUNCEMENT = {
  title: 'Guest lecture: Gemini internals with ex-Google Engineer',
  body: 'Join us this Saturday at 4 PM IST for an exclusive session on multi-modal model architectures.',
  date: 'Posted Jul 18',
};

export const APPLICATIONS = [
  { id: 'ap1', role: 'AI Engineer — LLM Products', company: 'Razorpay', stage: 'Interview', lastUpdate: '2 days ago' },
  { id: 'ap2', role: 'ML Engineer, Search Relevance', company: 'Meesho', stage: 'Screening', lastUpdate: '5 days ago' },
  { id: 'ap3', role: 'Data Scientist', company: 'Swiggy', stage: 'Applied', lastUpdate: '1 week ago' },
];

export const EVENTS = [
  { id: 'ev1', title: 'Resume clinic with Razorpay HR', date: iso(4), kind: 'Resume clinic' },
  { id: 'ev2', title: 'Mock technical interview loop', date: iso(8), kind: 'Mock interview' },
  { id: 'ev3', title: 'Recruiter speed-dating — AI companies', date: iso(14), kind: 'Recruiter meet' },
];

export const QUESTS = [
  { id: 'q1', title: 'Complete 3 coding labs this week', xp: 150, progress: 2, total: 3 },
  { id: 'q2', title: 'Submit 2 assignments before Saturday', xp: 200, progress: 1, total: 2 },
  { id: 'q3', title: 'Attend 5 live classes in a row', xp: 300, progress: 4, total: 5 },
  { id: 'q4', title: 'Get 90%+ on a module test', xp: 500, progress: 0, total: 1 },
];

export const LEADERBOARD = [
  { rank: 1, name: 'Aarav Sharma', initials: 'AS', xp: 4820, isYou: false },
  { rank: 2, name: 'Priya Iyer', initials: 'PI', xp: 4610, isYou: false },
  { rank: 3, name: 'You', initials: 'YO', xp: 4390, isYou: true },
  { rank: 4, name: 'Karan Verma', initials: 'KV', xp: 4100, isYou: false },
  { rank: 5, name: 'Meera Suresh', initials: 'MS', xp: 3990, isYou: false },
];

export const GAMIFICATION = {
  level: 7,
  xp: 4390,
  xpForNext: 5000,
  badges: ['First PR', '7-Day Streak', 'RAG Builder', 'Top 5 Leaderboard'],
};

export const SESSION = {
  name: 'Arjun Nair',
  email: 'arjun.nair@student.tek.school',
  track: 'AI Engineering · Cohort AI-01',
  avatarInitials: 'AN',
  streak: 7,
  weekCurrent: 14,
  weekTotal: 36,
};

export { formatDate, relativeDay } from './utils.js';
