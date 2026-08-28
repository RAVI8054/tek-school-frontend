import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Clock, Flag, Timer } from "lucide-react";












function buildQuestions(seed, count) {
  const bank = [
  { q: "Which method splits a dataset into train and test sets in scikit-learn?", options: ["train_test_split", "split_data", "cross_split", "make_split"] },
  { q: "What does a high variance model typically suffer from?", options: ["Overfitting", "Underfitting", "Vanishing gradients", "Label noise"] },
  { q: "Which pandas call returns the first five rows?", options: ["df.head()", "df.first()", "df.top()", "df.peek()"] },
  { q: "What is the purpose of a learning rate?", options: ["Controls step size of updates", "Sets batch size", "Limits epochs", "Normalises inputs"] },
  { q: "Which SQL clause filters aggregated rows?", options: ["HAVING", "WHERE", "GROUP BY", "ORDER BY"] },
  { q: "Which activation is most common in hidden layers today?", options: ["ReLU", "Sigmoid", "Tanh", "Step"] },
  { q: "What does RAG stand for in GenAI systems?", options: ["Retrieval-Augmented Generation", "Ranked Answer Grouping", "Recursive Agent Graph", "Rapid Attention Gating"] },
  { q: "Which metric suits an imbalanced classification problem?", options: ["F1 score", "Accuracy", "MSE", "R squared"] },
  { q: "What does regularisation primarily reduce?", options: ["Overfitting", "Bias", "Data size", "Training speed"] },
  { q: "Which library is used for numerical arrays in Python?", options: ["NumPy", "Requests", "Flask", "Pytest"] }];

  return Array.from({ length: count }, (_, i) => bank[(i + seed.length) % bank.length]);
}

function fmt(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function TestRunner({ test, onExit, className }) {
  const total = 30;
  const PER_Q = 60; // seconds allowed per question
  const questions = useMemo(() => buildQuestions(test.id, total), [test.id]);
  const limitMin = parseInt(test.duration, 10) || 30;

  const resumeFrom = Math.min(Math.max(test.startAt ?? 0, 0), total - 1);
  const seededAnswers = useMemo(() => {
    const a = {};
    for (let i = 0; i < resumeFrom; i++) a[i] = i % 4;
    return a;
  }, [resumeFrom]);

  const [answers, setAnswers] = useState(seededAnswers);
  const [flagged, setFlagged] = useState({});
  const [current, setCurrent] = useState(resumeFrom);
  const [elapsed, setElapsed] = useState(resumeFrom * PER_Q);
  const [running, setRunning] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [qLeft, setQLeft] = useState(PER_Q);


  const isTimed = test.mode === "assessment";
  const limit = limitMin * 60;
  const remaining = Math.max(limit - elapsed, 0);

  useEffect(() => {
    if (!running || submitted) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running, submitted]);

  useEffect(() => {
    if (isTimed && remaining === 0) queueMicrotask(() => setSubmitted(true));
  }, [isTimed, remaining]);

  // Per-question timer: resets on every question change
  useEffect(() => {
    queueMicrotask(() => setQLeft(PER_Q));
  }, [current]);

  useEffect(() => {
    if (!running || submitted) return;
    const t = setInterval(() => setQLeft((v) => Math.max(v - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [running, submitted, current]);

  // Auto-advance when a question's time runs out
  useEffect(() => {
    if (qLeft !== 0 || submitted) return;
    if (current < total - 1) queueMicrotask(() => setCurrent((c) => c + 1));else
    queueMicrotask(() => setSubmitted(true));
  }, [qLeft, submitted, current, total]);

  const answered = Object.keys(answers).length;
  const pct = Math.round(answered / total * 100);

  if (submitted) {
    return (
      <div className={`flex h-full flex-col items-center justify-center overflow-y-auto bg-[#F6F7FB] p-4 ${className ?? ""}`}>
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Check className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-extrabold text-slate-900">Submitted</h2>
          <p className="mt-1 text-sm text-slate-500">{test.title}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Summary label="Answered" value={`${answered}/${total}`} tone="bg-sky-50 text-sky-700" />
            <Summary label="Time taken" value={fmt(elapsed)} tone="bg-violet-50 text-violet-700" />
            <Summary label="Flagged" value={`${Object.values(flagged).filter(Boolean).length}`} tone="bg-amber-50 text-amber-700" />
          </div>
          <button onClick={onExit} className="mt-7 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white">
            Back to learning
          </button>
        </div>
      </div>);

  }

  const q = questions[current];

  return (
    <div className={`flex h-full flex-col gap-5 overflow-hidden bg-[#F6F7FB] p-4 lg:p-6 ${className ?? ""}`}>
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-4 dash-card px-5 py-4 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)]">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800">
          
          <ArrowLeft className="h-4 w-4" /> Exit
        </button>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-wider text-violet-600">
            {test.meta} · {isTimed ? "Timed assessment" : "Practice"}
          </p>
          <h2 className="truncate font-display text-lg font-extrabold text-slate-900">{test.title}</h2>
        </div>
        <div
          className={`ml-auto inline-flex items-center gap-2 rounded-2xl px-4 py-2 font-display text-xl font-extrabold tabular-nums ${
          isTimed && remaining < 60 ? "bg-rose-50 text-rose-600" : "bg-slate-900 text-white"}`
          }>
          
          {isTimed ? <Timer className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
          {fmt(isTimed ? remaining : elapsed)}
        </div>
        {!isTimed &&
        <button
          onClick={() => setRunning((r) => !r)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
          
            {running ? "Pause" : "Resume"}
          </button>
        }
      </div>

      <div className="grid flex-1 gap-5 overflow-hidden lg:grid-cols-[minmax(0,290px)_minmax(0,1fr)]">
        {/* Left: progress panel */}
        <aside className="flex flex-col gap-4 overflow-y-auto">
          <div className="dash-card p-5 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)]">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-slate-500">Completed</p>
              <p className="font-display text-2xl font-extrabold text-slate-900">
                {answered}<span className="text-base font-bold text-slate-400">/{total}</span>
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs font-medium text-slate-400">{pct}% complete · {total - answered} remaining</p>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Question map</p>
            <div className="mt-3 grid grid-cols-6 gap-2 pr-1">
              {questions.map((_, i) => {
                const state = answers[i] !== undefined ? "done" : flagged[i] ? "flag" : "todo";
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-9 rounded-xl text-xs font-bold transition-all hover:scale-105 ${
                    i === current ? "ring-2 ring-slate-900 ring-offset-2" : ""} ${

                    state === "done" ?
                    "bg-emerald-500 text-white" :
                    state === "flag" ?
                    "bg-amber-400 text-white" :
                    "bg-slate-100 text-slate-500 hover:bg-slate-200"}`
                    }>
                    
                    {i + 1}
                  </button>);

              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
              <Legend color="bg-emerald-500" label="Answered" />
              <Legend color="bg-amber-400" label="Flagged" />
              <Legend color="bg-slate-200" label="Not seen" />
            </div>
          </div>

          <button
            onClick={() => setSubmitted(true)}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02]">
            
            Submit test
          </button>
        </aside>

        {/* Right: question */}
        <section className="dash-card flex flex-col overflow-y-auto p-6 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-600">
                Question {current + 1} of {total}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold tabular-nums ${
                qLeft <= 10 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"}`
                }
                title="Time left on this question">
                
                <Timer className="h-3.5 w-3.5" /> {fmt(qLeft)} left on this question
              </span>
            </div>
            <button
              onClick={() => setFlagged((f) => ({ ...f, [current]: !f[current] }))}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
              flagged[current] ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`
              }>
              
              <Flag className="h-3.5 w-3.5" /> {flagged[current] ? "Flagged" : "Flag"}
            </button>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${qLeft <= 10 ? "bg-rose-500" : "bg-violet-500"}`}
              style={{ width: `${qLeft / PER_Q * 100}%` }} />
            
          </div>

          <h3 className="mt-5 font-display text-2xl font-extrabold leading-snug text-slate-900">{q.q}</h3>

          <ul className="mt-6 space-y-3">
            {q.options.map((opt, oi) => {
              const active = answers[current] === oi;
              return (
                <li key={opt}>
                  <button
                    onClick={() => setAnswers((a) => ({ ...a, [current]: oi }))}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${
                    active ?
                    "border-violet-500 bg-violet-50 text-violet-900 shadow-sm" :
                    "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`
                    }>
                    
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                </li>);

            })}
          </ul>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-40">
              
              Previous
            </button>
            {current === total - 1 ?
            <button onClick={() => setSubmitted(true)} className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
                Submit test
              </button> :

            <button onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))} className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
                Next question
              </button>
            }
          </div>
        </section>
      </div>
    </div>);

}


function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} /> {label}
    </span>);

}

function Summary({ label, value, tone }) {
  return (
    <div className={`rounded-2xl p-4 ${tone}`}>
      <p className="text-xs font-semibold opacity-70">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold">{value}</p>
    </div>);

}