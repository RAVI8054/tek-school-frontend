import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Play, Check, X, Clock, Lightbulb, Send, Circle, CheckCircle2, ChevronDown, PanelLeft, PanelLeftClose } from "lucide-react";











const PROBLEMS = [
{
  title: "Print 1–10",
  instructions: "Print the numbers from 1 to 10, one per line, in ascending order.",
  starter: "for n in range(1, 11):\n    print(n)\n",
  notes: "# Notes\n- range(start, stop) excludes stop\n- print() adds a newline by default",
  hint: "range(1, 11) gives you 1 through 10.",
  tests: ["Test 1: prints 10 lines", "Test 2: starts at 1", "Test 3: ends at 10"]
},
{
  title: "Sum of a list",
  instructions: "Given a list of numbers, compute and print the total of all values.",
  starter: "nums = [3, 8, 12, 7, 4, 9, 10]\ntotal = 0\nfor n in nums:\n    total += n\nprint(total)\n",
  notes: "# Notes\n- Accumulate into a variable\n- sum(nums) also works",
  hint: "Start total at 0 and add each item inside the loop.",
  tests: ["Test 1: [3,8,12,7,4,9,10]", "Test 2: [1,3,5]", "Test 3: [] empty list"]
},
{
  title: "Find even numbers",
  instructions: "Given a list of numbers, print only the even ones, in order.",
  starter: "nums = [3, 8, 12, 7, 4, 9, 10]\nfor n in nums:\n    if n % 2 == 0:\n        print(n)\n",
  notes: "# Notes\n- n % 2 == 0 means even\n- Keep the original order",
  hint: "Use the modulo operator to test divisibility by 2.",
  tests: ["Test 1: [3,8,12,7,4,9,10]", "Test 2: [1,3,5]", "Test 3: [] empty list"]
},
{
  title: "Multiplication table",
  instructions: "Print the multiplication table for a given number n, from n x 1 up to n x 10.",
  starter: "n = 7\n# your code here\n",
  notes: "# Notes\n- Nested f-strings keep output tidy\n- f\"{n} x {i} = {n*i}\"",
  hint: "Loop i from 1 to 10 and print n * i.",
  tests: ["Test 1: n = 7", "Test 2: n = 1", "Test 3: n = 12"]
}];


const LANGUAGES = ["Python 3", "JavaScript (Node 20)", "Java 17", "SQL"];


const LANG_META = {
  "Python 3": {
    ext: "py",
    comment: "#",
    keywords: /\b(for|in|if|else|elif|while|def|return|import|from|print|range|len|sum|True|False|None)\b/g
  },
  "JavaScript (Node 20)": {
    ext: "js",
    comment: "//",
    keywords: /\b(const|let|var|for|of|in|if|else|while|function|return|import|from|console|log|true|false|null|=>)\b/g
  },
  "Java 17": {
    ext: "java",
    comment: "//",
    keywords: /\b(public|private|class|static|void|int|String|for|if|else|while|return|new|System|out|println|true|false|null)\b/g
  },
  SQL: {
    ext: "sql",
    comment: "--",
    keywords: /\b(SELECT|FROM|WHERE|GROUP|BY|ORDER|HAVING|JOIN|ON|AS|SUM|COUNT|WITH|LIMIT|generate_series)\b/gi
  }
};

/** Language-specific starter code per problem index. */
const STARTERS = {
  "Python 3": PROBLEMS.map((p) => p.starter),
  "JavaScript (Node 20)": [
  "for (let n = 1; n <= 10; n++) {\n  console.log(n);\n}\n",
  "const nums = [3, 8, 12, 7, 4, 9, 10];\nlet total = 0;\nfor (const n of nums) {\n  total += n;\n}\nconsole.log(total);\n",
  "const nums = [3, 8, 12, 7, 4, 9, 10];\nfor (const n of nums) {\n  if (n % 2 === 0) console.log(n);\n}\n",
  "const n = 7;\n// your code here\n"],

  "Java 17": [
  "public class Main {\n  public static void main(String[] args) {\n    for (int n = 1; n <= 10; n++) {\n      System.out.println(n);\n    }\n  }\n}\n",
  "public class Main {\n  public static void main(String[] args) {\n    int[] nums = {3, 8, 12, 7, 4, 9, 10};\n    int total = 0;\n    for (int n : nums) total += n;\n    System.out.println(total);\n  }\n}\n",
  "public class Main {\n  public static void main(String[] args) {\n    int[] nums = {3, 8, 12, 7, 4, 9, 10};\n    for (int n : nums) {\n      if (n % 2 == 0) System.out.println(n);\n    }\n  }\n}\n",
  "public class Main {\n  public static void main(String[] args) {\n    int n = 7;\n    // your code here\n  }\n}\n"],

  SQL: [
  "SELECT n\nFROM generate_series(1, 10) AS n\nORDER BY n;\n",
  "SELECT SUM(value) AS total\nFROM numbers;\n",
  "SELECT value\nFROM numbers\nWHERE value % 2 = 0\nORDER BY id;\n",
  "-- your query here\nSELECT 7 * i AS product\nFROM generate_series(1, 10) AS i;\n"]

};

function fmt(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}


function Highlighted({ line, kw }) {
  const parts = useMemo(() => {
    const out = [];
    let last = 0;
    for (const m of line.matchAll(new RegExp(kw.source, kw.flags.includes("g") ? kw.flags : kw.flags + "g"))) {
      const i = m.index ?? 0;
      if (i > last) out.push({ t: line.slice(last, i), k: false });
      out.push({ t: m[0], k: true });
      last = i + m[0].length;
    }
    out.push({ t: line.slice(last), k: false });
    return out;
  }, [line, kw]);
  return (
    <>
      {parts.map((p, i) =>
      p.k ?
      <span key={i} className="text-violet-600">
            {p.t}
          </span> :

      <span key={i}>{p.t}</span>

      )}
      {"\n"}
    </>);

}

export function CodeRunner({ test, onExit, className }) {
  const problems = PROBLEMS;
  const [idx, setIdx] = useState(0);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState({});
  const [done, setDone] = useState({});
  const [tab, setTab] = useState("solution");
  const [bottom, setBottom] = useState("tests");
  const [results, setResults] = useState({});
  const [consoleOut, setConsoleOut] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProblems, setShowProblems] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const areaRef = useRef(null);

  const problem = problems[idx];
  const meta = LANG_META[lang];
  const starter = STARTERS[lang][idx] ?? problem.starter;
  const codeKey = `${lang}-${idx}`;
  const value = code[codeKey] ?? starter;
  const lines = value.split("\n");
  const solvedCount = Object.values(done).filter(Boolean).length;
  const res = results[idx];

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setShowHint(false);
      setBottom("tests");
      setTab("solution");
    });
  }, [idx]);

  function run(submit = false) {
    setRunning(true);
    setBottom(submit ? "tests" : "console");
    setConsoleOut([`$ run ${tab === "notes" ? "notes.md" : `solution.${LANG_META[lang].ext}`} — ${lang}`, "Compiling…"]);
    const written = value.trim().length > starter.trim().length - 10 && !value.includes("your code here");
    setTimeout(() => {
      setRunning(false);
      const outcome = [written, written, written && idx !== 2];
      setResults((r) => ({ ...r, [idx]: outcome }));
      setConsoleOut((o) => [
      ...o,
      written ? "Process finished with exit code 0" : "Traceback: solution is incomplete",
      `${outcome.filter(Boolean).length}/${outcome.length} test cases passed`]
      );
      if (submit && outcome.every(Boolean)) setDone((d) => ({ ...d, [idx]: true }));
    }, 650);
  }

  function onKeyDown(e) {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = areaRef.current;
    const s = el.selectionStart;
    const next = value.slice(0, s) + "    " + value.slice(el.selectionEnd);
    setCode((c) => ({ ...c, [codeKey]: next }));
    requestAnimationFrame(() => el.setSelectionRange(s + 4, s + 4));
  }

  return (
    <div className={`flex h-full flex-col overflow-hidden bg-white ${className ?? ""}`}>
      {/* Top bar — single row: back + title + language, then actions + timer */}
      <div className="shrink-0 border-b border-slate-200 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={onExit} aria-label="Back to learning" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Practice lab</p>
            <h1 className="truncate font-display text-base font-bold text-slate-900 sm:text-lg">{test.title}</h1>
          </div>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Language"
            className="h-10 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-[var(--accent-blue-deep)] sm:w-52">
            
            {LANGUAGES.map((l) =>
            <option key={l}>{l}</option>
            )}
          </select>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              onClick={() => {setShowHint(true);setBottom("console");setConsoleOut([`hint: ${problem.hint}`]);}}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              
              <Lightbulb className="h-4 w-4" /> Hint
            </button>
            <button
              onClick={() => run(false)}
              disabled={running}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              
              <Play className="h-4 w-4" /> {running ? "Running…" : "Run"}
            </button>
            <button
              onClick={() => run(true)}
              disabled={running}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-50">
              
              <Send className="h-4 w-4" /> Submit
            </button>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 font-mono text-sm text-slate-600">
              <Clock className="h-4 w-4" /> {fmt(elapsed)}
            </span>
          </div>
        </div>
      </div>

      <div className={`grid flex-1 overflow-hidden ${sidebarOpen ? "lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]" : "lg:grid-cols-[48px_minmax(0,1fr)]"}`}>

        {/* Left: problems + instructions (collapsible) */}
        <aside className="flex flex-col overflow-y-auto border-b border-slate-200 lg:border-b-0 lg:border-r">
          {!sidebarOpen ?
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Expand panel"
            className="flex items-center justify-center gap-2 py-3 text-slate-400 hover:bg-slate-50 hover:text-slate-700">
            
              <PanelLeft className="h-4 w-4" />
              <span className="text-sm font-semibold lg:hidden">Problems & instructions</span>
            </button> :

          <>
              <div className="px-5 py-4">
                <div className="flex items-center justify-between gap-2">
                  <button
                  onClick={() => setShowProblems((v) => !v)}
                  className="flex flex-1 items-center gap-1.5 text-left text-sm text-slate-500">
                  
                    <ChevronDown className={`h-4 w-4 transition-transform ${showProblems ? "" : "-rotate-90"}`} />
                    Problems <span className="font-semibold text-slate-800">{solvedCount}/{problems.length} done</span>
                  </button>
                  <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Collapse panel"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  
                    <PanelLeftClose className="h-4 w-4" />
                  </button>
                </div>
                {showProblems &&
              <ul className="mt-3 space-y-1">
                    {problems.map((p, i) =>
                <li key={p.title}>
                        <button
                    onClick={() => setIdx(i)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    i === idx ? "bg-sky-50 font-semibold text-[var(--accent-blue-deep)]" : "text-slate-600 hover:bg-slate-50"}`
                    }>
                    
                          {done[i] ?
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> :

                    <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                    }
                          <span className="truncate">{i + 1}. {p.title}</span>
                        </button>
                      </li>
                )}
                  </ul>
              }
              </div>

              <div className="border-t border-slate-200 px-5 py-4">
                <button
                onClick={() => setShowInstructions((v) => !v)}
                className="flex w-full items-center gap-1.5 text-left text-sm font-semibold text-slate-500">
                
                  <ChevronDown className={`h-4 w-4 transition-transform ${showInstructions ? "" : "-rotate-90"}`} />
                  Instructions
                </button>
                {showInstructions &&
              <>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{problem.instructions}</p>
                    {showHint &&
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">{problem.hint}</p>
                }
                  </>
              }
              </div>

              <div className="mt-auto px-5 pb-4 pt-6">
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${solvedCount / problems.length * 100}%` }} />
                
                </div>
              </div>
            </>
          }
        </aside>


        {/* Right: editor + results */}
        <div className="flex min-w-0 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center gap-1 border-b border-slate-200 px-4">
            {["solution", "notes"].map((t) =>
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 px-3 py-3 font-mono text-sm transition-colors ${
              tab === t ?
              "border-[var(--accent-blue-deep)] font-semibold text-[var(--accent-blue-deep)]" :
              "border-transparent text-slate-400 hover:text-slate-600"}`
              }>
              
                {t === "solution" ? `solution.${meta.ext}` : "notes.md"}
              </button>
            )}
          </div>

          {tab === "solution" ?
          <div className="relative flex flex-1 bg-[#FCFCFA]">
              <div className="select-none py-4 pl-4 pr-3 text-right font-mono text-sm leading-6 text-slate-300">
                {lines.map((_, i) =>
              <div key={i}>{i + 1}</div>
              )}
              </div>
              <div className="relative min-w-0 flex-1">
                <pre aria-hidden className="pointer-events-none absolute inset-0 whitespace-pre-wrap break-words px-2 py-4 font-mono text-sm leading-6 text-slate-800">
                  {lines.map((l, i) =>
                <Highlighted key={i} line={l} kw={meta.keywords} />
                )}
                </pre>
                <textarea
                ref={areaRef}
                value={value}
                spellCheck={false}
                onKeyDown={onKeyDown}
                onChange={(e) => setCode((c) => ({ ...c, [codeKey]: e.target.value }))}
                aria-label="Code editor"
                className="absolute inset-0 h-full w-full resize-none whitespace-pre-wrap break-words bg-transparent px-2 py-4 font-mono text-sm leading-6 text-transparent caret-slate-900 outline-none" />
              
              </div>
            </div> :

          <textarea
            value={code[`n${idx}`] ?? problem.notes}
            onChange={(e) => setCode((c) => ({ ...c, [`n${idx}`]: e.target.value }))}
            aria-label="Notes"
            className="flex-1 resize-none bg-[#FCFCFA] p-4 font-mono text-sm leading-6 text-slate-700 outline-none" />

          }

          {/* Bottom panel */}
          <div className="shrink-0 border-t border-slate-200">
            <div className="flex items-center gap-1 border-b border-slate-100 px-4">
              {["tests", "console"].map((t) =>
              <button
                key={t}
                onClick={() => setBottom(t)}
                className={`-mb-px border-b-2 px-3 py-3 text-sm transition-colors ${
                bottom === t ?
                "border-[var(--accent-blue-deep)] font-semibold text-[var(--accent-blue-deep)]" :
                "border-transparent text-slate-400 hover:text-slate-600"}`
                }>
                
                  {t === "tests" ? "Test cases" : "Console"}
                </button>
              )}
            </div>

            {bottom === "tests" ?
            <ul className="max-h-44 space-y-2 overflow-y-auto p-4">
                {problem.tests.map((t, i) => {
                const state = res?.[i];
                return (
                  <li key={t} className="flex items-center justify-between gap-3">
                      <span className="truncate font-mono text-sm text-slate-600">{t}</span>
                      {state === undefined ?
                    <span className="shrink-0 text-sm text-slate-400">Not run</span> :
                    state ?
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-600">
                          <Check className="h-4 w-4" /> Passed
                        </span> :

                    <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-rose-600">
                          <X className="h-4 w-4" /> Failed
                        </span>
                    }
                    </li>);

              })}
              </ul> :

            <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap p-4 font-mono text-xs leading-6 text-slate-600">
                {consoleOut.length ? consoleOut.join("\n") : "Run your code to see output here."}
              </pre>
            }
          </div>
        </div>
      </div>
    </div>);

}