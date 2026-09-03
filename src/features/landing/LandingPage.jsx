import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '../../components/layout/Shell.jsx';
import { Hero } from './Hero.jsx';
import { BookDemoModal } from './BookDemoModal.jsx';
import { AdmissionsModal } from './AdmissionsModal.jsx';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { Asterisk, Loop } from '../../components/ui/Doodles.jsx';
import {
  ArrowUpRight, ArrowRight, Star, Sparkles, GraduationCap, Briefcase, Brain, Cloud, Code2,
  Users, Award, Clock, TrendingUp, Rocket,
} from 'lucide-react';

// Images
import studentArjun from '../../assets/student-arjun.jpg';
import studentRiya from '../../assets/student-riya.jpg';
import studentPriya from '../../assets/student-priya.jpg';
import bgAiMl from '../../assets/ai-ml-students-lab.jpg';
import bgCloud from '../../assets/cloud-engineering-team.jpg';
import bgFullstack from '../../assets/software-engineering-coding.jpg';
import bgFuture from '../../assets/future-kids-robotics.jpg';

const programImages = {
  'ai-engineering': { src: bgAiMl, alt: 'Students analyzing data in a lab' },
  'cloud-engineering': { src: bgCloud, alt: 'Engineers on cloud architecture' },
  'software-engineering': { src: bgFullstack, alt: 'Developers pair programming' },
  'future-engineering': { src: bgFuture, alt: 'School students building robotics' },
};

const stats = [
  { icon: Clock, value: '10+', label: 'Years running', bg: 'bg-white border border-border', fg: 'text-foreground' },
  { icon: Users, value: '10,000+', label: 'Students taught', bg: 'bg-[color:var(--coral)]', fg: 'text-[color:var(--coral-foreground)]' },
  { icon: Award, value: '24+', label: 'Courses offered', bg: 'bg-[color:var(--lavender)]', fg: 'text-[color:var(--lavender-foreground)]' },
  { icon: TrendingUp, value: '94%', label: 'Placement rate', bg: 'gradient-blue', fg: 'text-white' },
];

const whyCards = [
  { icon: Sparkles, iconBg: 'bg-[color:var(--lavender)]', iconColor: 'text-[color:var(--lavender-foreground)]', title: 'AI-Powered Learning', desc: 'Personalized paths, feedback on your code and designs, and a co-pilot that answers at 2am.' },
  { icon: GraduationCap, iconBg: 'gradient-blue', iconColor: 'text-white', title: 'Industry-Driven Curriculum', desc: 'Courses designed with senior engineers from real product teams. No outdated theory.' },
  { icon: Briefcase, iconBg: 'bg-[color:var(--coral)]', iconColor: 'text-[color:var(--coral-foreground)]', title: 'Placement Support', desc: 'Portfolio review, mock interviews, LinkedIn revamp and a hiring network of 120+ companies.' },
];

const steps = [
  { title: 'Apply in 5 minutes', desc: 'Short form, quick call. We match you to a cohort that fits your goals and schedule.' },
  { title: 'Meet your mentor', desc: "Every student gets a 1:1 mentor — a working engineer who's been in your seat." },
  { title: 'Ship real projects', desc: 'Ship one real project every three weeks. By graduation you have a portfolio, not just certificates.' },
  { title: 'Land the job', desc: 'Placement team runs mock loops, edits your résumé, and warm-intros you to hiring partners.' },
];

const learnTracks = [
  {
    slug: 'ai-engineering', eyebrow: '# AI Engineering', title: 'Build AI that ships', icon: Brain, tone: 'lavender',
    skills: [
      { text: 'Python, NumPy/Pandas & statistics for ML' },
      { text: 'Machine Learning: regression, classification, XGBoost, scikit-learn' },
      { text: 'Deep Learning with PyTorch — CNNs, RNNs, attention, transfer learning' },
      { text: 'NLP & LLMs — transformers, Hugging Face, fine-tuning BERT/GPT/Llama', advanced: true },
      { text: 'RAG pipelines with LangChain, LlamaIndex & vector databases', advanced: true },
      { text: 'Computer Vision — YOLO, OpenCV, Stable Diffusion, multimodal models' },
      { text: 'MLOps — MLflow, Docker, Kubernetes, CI/CD for ML, drift monitoring' },
      { text: 'Capstone: ship a production RAG assistant + 3 other portfolio builds', advanced: true },
    ],
    stat: '200+ hands-on labs · 12 weeks',
  },
  {
    slug: 'cloud-engineering', eyebrow: '# Cloud Engineering', title: 'Own the infrastructure', icon: Cloud, tone: 'blue',
    skills: [
      { text: 'Cloud foundations across AWS, Azure & GCP (IaaS/PaaS/SaaS)' },
      { text: 'Networking & security — VPCs, IAM, encryption, WAF' },
      { text: 'Docker & Kubernetes — pods, Helm, EKS/AKS/GKE cluster ops', advanced: true },
      { text: 'Infrastructure as Code — Terraform, Ansible, GitOps, Policy as Code', advanced: true },
      { text: 'CI/CD & SRE — Jenkins, GitHub Actions, Prometheus, Grafana, chaos engineering' },
      { text: 'Capstone: architect a multi-tier production system with full observability', advanced: true },
    ],
    stat: '180+ labs · 3 cloud platforms',
  },
  {
    slug: 'software-engineering', eyebrow: '# Software Engineering', title: 'Master full-stack product', icon: Code2, tone: 'coral',
    skills: [
      { text: 'Modern HTML, CSS, JavaScript & the AI coding workflow (GitHub, Cursor, Copilot)' },
      { text: 'Frontend: React.js, Next.js, Tailwind CSS, state management' },
      { text: 'Backend: Node.js, Express, MongoDB, REST APIs, JWT auth' },
      { text: 'Full-stack MERN builds — admin panels, payments, cloud deployment', advanced: true },
      { text: 'AI-powered development — prompt engineering, GenAI APIs, AI-assisted debugging', advanced: true },
      { text: 'Production & DevOps — Docker, CI/CD, Agile, capstone + real 3-month internship', advanced: true },
    ],
    stat: '200K+ active job openings · 100% job assistance',
  },
  {
    slug: 'future-engineering', eyebrow: '# Future Engineering', title: 'Start them early (ages 6–15)', icon: Rocket, tone: 'lavender',
    skills: [
      { text: 'Computational thinking, unplugged games and ScratchJr (ages 6–8)' },
      { text: 'Blocks to typed code — Scratch, HTML & CSS, first web pages (ages 8–10)' },
      { text: 'Python explorers — logic, functions, turtle art, real data and charts (ages 10–12)' },
      { text: 'Robotics, sensors, IoT and 3D printing with Arduino & micro:bit (ages 11–13)', advanced: true },
      { text: 'AI & data literacy — train a model, build with LLM APIs, debate ethics (ages 13–15)', advanced: true },
      { text: 'Innovator capstone + olympiad drills, judged demo day and portfolio', advanced: true },
    ],
    stat: '6 courses · 3 age bands · 12-child batches',
  },
];

const programmes = [
  {
    slug: 'ai-engineering', tag: 'AI Engineering', icon: Brain,
    title: 'AI, ML & Data Science',
    desc: 'Master Python, Statistics, ML, Deep Learning, Gen AI, LLMs and AI Agents. 9-month program + 3-month internship with 100% job assistance.',
    stack: ['Python', 'ML', 'Gen AI', 'LLMs'], duration: '9 months + 3 mo internship', isNew: true,
    theme: { left: '#4c1d95', right: '#f3e8ff', leftText: '#ffffff', rightText: '#1e1b4b', bullet: '#7c3aed', btnText: '#4c1d95', btnBg: '#ffffff' },
  },
  {
    slug: 'cloud-engineering', tag: 'Cloud Engineering', icon: Cloud,
    title: 'DevOps & Cloud Engineering',
    desc: 'Linux, AWS/Azure, Docker, Kubernetes, Terraform and CI/CD. 6-month program + 3-month internship with 100% job assistance.',
    stack: ['AWS', 'Docker', 'Kubernetes', 'Terraform'], duration: '6 months + 3 mo internship',
    theme: { left: '#1e40af', right: '#dbeafe', leftText: '#ffffff', rightText: '#1e3a8a', bullet: '#2563eb', btnText: '#1e40af', btnBg: '#ffffff' },
  },
  {
    slug: 'software-engineering', tag: 'Software Engineering', icon: Code2,
    title: 'Full-Stack Software Engineering',
    desc: 'MERN stack, AI-powered development, DevOps and capstone projects. 6-month program + 3-month internship with 100% job assistance.',
    stack: ['React', 'Node.js', 'MongoDB', 'AI Tools'], duration: '6 months + 3 mo internship',
    theme: { left: '#E85D4C', right: '#FFE8E5', leftText: '#ffffff', rightText: '#7F1D1D', bullet: '#E85D4C', btnText: '#E85D4C', btnBg: '#ffffff' },
  },
  {
    slug: 'future-engineering', tag: 'Future Engineering', icon: Rocket,
    title: 'Future Engineering for Schools',
    desc: 'A K–10 curriculum for ages 6–15: block coding, Python, robotics, AI literacy and a judged capstone. Runs in-school or after-school.',
    stack: ['Scratch', 'Python', 'Robotics', 'AI'], duration: 'Academic year · ages 6–15', isNew: true,
    theme: { left: '#1B5E44', right: '#D1F2E5', leftText: '#ffffff', rightText: '#064E3B', bullet: '#059669', btnText: '#1B5E44', btnBg: '#ffffff' },
  },
];

const testimonials = [
  { name: 'Arjun Mehta', role: 'Frontend Engineer, Loom', course: "Modern React '25", avatar: studentArjun, quote: 'Honestly? I came in barely knowing hooks. Ten weeks later I was shipping a live editor with optimistic updates. That project got me the Loom offer.', outcome: 'Hired 2 weeks after demo day · ₹28 LPA' },
  { name: 'Riya Nair', role: 'Product Designer, Ramp', course: "UX Foundations '25", avatar: studentRiya, quote: 'My mentor tore my first case study apart in the nicest way possible. Rebuilt it in a weekend, got four callbacks the next week. Still text him.', outcome: '4 offers in one month' },
  { name: 'Priya Shah', role: 'ML Engineer, Anthropic', course: "Applied ML '24", avatar: studentPriya, quote: 'The RAG module was the one where it clicked. Built a working retrieval bot over our own class notes, used the same architecture in my Anthropic interview.', outcome: '3.2× salary jump' },
];

function ProgramCard({ p, index }) {
  const track = learnTracks.find((t) => t.slug === p.slug);
  const Icon = p.icon;
  const t = p.theme;
  const swapped = index % 2 === 1;
  const photo = programImages[p.slug];

  const programColumn = (
    <div
      className={`relative overflow-hidden px-5 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20 flex flex-col justify-center ${swapped ? 'lg:order-2' : 'lg:order-1'}`}
      style={{ backgroundColor: t.left, color: t.leftText }}
    >
      {photo && (
        <>
          <img src={photo.src} alt={photo.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, ${t.left} 0%, ${t.left}F2 52%, ${t.left}CC 100%)` }} />
        </>
      )}
      <div className="relative max-w-xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
            <Icon className="h-5 w-5" style={{ color: t.leftText }} />
          </span>
          <span className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: t.leftText }}>
            {p.tag}{p.isNew && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-white/20 rounded-full px-2 py-0.5">New</span>}
          </span>
        </div>
        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.05]">{p.title}</h3>
        <p className="mt-4 text-sm md:text-base leading-relaxed opacity-90">{p.desc}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="text-xs md:text-sm font-medium rounded-full px-3 py-1 md:px-4 md:py-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: t.leftText }}>{s}</span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="text-xs md:text-sm font-semibold opacity-80">{p.duration}</span>
          <Link to={`/programs/${p.slug}`} className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: t.btnBg, color: t.btnText }}>
            Explore <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  const learnColumn = (
    <div
      className={`px-5 py-10 md:px-10 md:py-14 lg:px-14 lg:py-20 ${swapped ? 'lg:order-1' : 'lg:order-2'}`}
      style={{ backgroundColor: t.right, color: t.rightText }}
    >
      <div className="max-w-xl lg:ml-auto">
        <p className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold mb-4" style={{ backgroundColor: t.left, color: t.leftText }}># What you'll learn</p>
        <h4 className="font-display text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-6">{track?.title}</h4>
        <ul className="space-y-3">
          {track?.skills.map((s) => (
            <li key={s.text} className="flex items-start gap-3 text-sm md:text-base leading-snug">
              <span className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: t.bullet }} />
              <span className="flex-1">
                <span style={{ opacity: s.advanced ? 1 : 0.85 }} className={s.advanced ? 'font-semibold' : ''}>{s.text}</span>
                {s.advanced && (
                  <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5" style={{ backgroundColor: t.left, color: t.leftText }}>Advanced</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 pt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <p className="text-xs md:text-sm font-semibold opacity-70">{track?.stat}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-2">
        {programColumn}
        {learnColumn}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [admissionsOpen, setAdmissionsOpen] = useState(false);

  return (
    <Shell>
      {/* HERO */}
      <Hero onApply={() => setApplyOpen(true)} onAdmissions={() => setAdmissionsOpen(true)} />

      {/* STAT CARDS */}
      <section className="px-4 md:px-10 -mt-4 pb-8">
        <Reveal>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className={`rounded-[1.75rem] p-6 ${s.bg} ${s.fg}`}>
                <s.icon className="h-6 w-6 opacity-80" />
                <p className="mt-4 font-display text-4xl md:text-5xl font-bold leading-none">{s.value}</p>
                <p className="mt-2 text-sm font-medium opacity-80">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* WHY TEKSCHOOL + HOW IT WORKS */}
      <section className="relative px-4 md:px-10 py-12">
        <Loop className="pointer-events-none absolute -right-10 top-6 h-64 w-64 opacity-40" />
        <div className="grid gap-8 lg:grid-cols-2 items-end mb-12">
          <Reveal>
            <p className="pill-tag bg-[color:var(--lavender)] text-[color:var(--lavender-foreground)] mb-4 -rotate-2"># Why TekSchool</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-[1.02] tracking-tight">
              Give wings to
              <span className="inline-flex items-center gap-2 mx-2 align-middle">
                <Asterisk className="h-8 w-8 md:h-11 md:w-11" color="var(--coral)" />
              </span>
              your career.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-muted-foreground max-w-md lg:justify-self-end">
              Everything you need to launch and grow a career in tech — in one focused platform.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {whyCards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="rounded-[2rem] border border-border bg-white p-7 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${c.iconBg}`}>
                  <c.icon className={`h-6 w-6 ${c.iconColor}`} />
                </div>
                <h3 className="font-display text-2xl font-bold mt-6">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-16 rounded-[2rem] border border-border bg-muted/40 p-8 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="pill-tag bg-white text-muted-foreground mb-3"># How it works</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">Four steps from curious to hired.</h3>
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Applications open · Spring '26</span>
          </div>
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <li className="relative">
                  <span className="pill-tag bg-primary text-primary-foreground -rotate-2">0{i + 1}</span>
                  <h4 className="font-display font-bold mt-4 text-lg">{s.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* PROGRAMMES SHOWCASE */}
      <section className="relative py-12">
        <div className="w-full">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14 px-4 md:px-10">
            <p className="pill-tag bg-[color:var(--lavender)] text-[color:var(--lavender-foreground)] mb-3"># Choose your path</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">Industry-grade programmes</h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">Focused tracks. One outcome: a job you love at a company that values your skills.</p>
          </div>
          <div className="flex flex-col w-screen relative left-1/2 -translate-x-1/2">
            {programmes.map((p, i) => (
              <ProgramCard key={p.slug} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-4 md:px-10 py-12">
        <Reveal className="mb-10">
          <p className="pill-tag bg-muted text-muted-foreground mb-4"># Voices</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold max-w-xl leading-tight">Students who mastered.</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className={`rounded-3xl border p-6 bg-white h-full ${i === 1 ? 'rotate-1' : i === 2 ? '-rotate-1' : ''} hover:rotate-0 hover:-translate-y-1 hover:shadow-md transition-all duration-300`}>
                <div className="flex gap-0.5 mb-4 text-[color:var(--coral)]">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} · {t.course}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-[color:var(--coral)]/15 px-3 py-2 text-xs font-semibold text-[color:var(--coral-foreground)]">
                  {t.outcome}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 md:px-10 pb-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 md:p-20 text-primary-foreground">
            <div className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full gradient-blue opacity-70" />
            <div className="absolute -left-10 -top-10 h-52 w-52 rounded-full bg-[color:var(--coral)] opacity-20" />
            <div className="relative max-w-2xl">
              <span className="pill-tag bg-white/20 text-white -rotate-2"># New Batch</span>
              <h2 className="mt-4 font-display text-5xl md:text-7xl font-bold leading-[0.98]">
                Your next chapter<br />starts here.
              </h2>
              <p className="mt-5 opacity-80 max-w-md leading-relaxed">
                Applications for the spring cohort are open. Pick a path, meet your mentor, start building — with 100% job assistance on graduation.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => setApplyOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-7 py-3.5 font-semibold hover:bg-white/90">
                  Apply now <ArrowUpRight className="h-4 w-4" />
                </button>
                <Link to="/programs" className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white px-7 py-3.5 font-semibold hover:bg-white/10">
                  See the catalog
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <BookDemoModal open={applyOpen} onClose={() => setApplyOpen(false)} />
      <AdmissionsModal open={admissionsOpen} onClose={() => setAdmissionsOpen(false)} />
    </Shell>
  );
}
