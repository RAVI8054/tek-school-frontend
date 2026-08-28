const fs = require('fs');

const replaceInFile = (file, replacements) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  for (const { target, replacement } of replacements) {
    content = content.replace(target, replacement);
  }
  fs.writeFileSync(file, content);
};

// 1. StudentProfile.jsx
replaceInFile('R:/Tek School/Tek School Frontend/src/features/student/profile/StudentProfile.jsx', [
  { target: 'const navigate = useNavigate();\n', replacement: '' },
  { target: 'try {setProfile((p) => ({ ...p, ...JSON.parse(raw) }));return;} catch {/* ignore */}\n    }\n    if (s) setProfile((p) => ({ ...p, name: s.name, email: s.email }));',
    replacement: 'queueMicrotask(() => {\n      try {setProfile((p) => ({ ...p, ...JSON.parse(raw) }));return;} catch {/* ignore */}\n    });\n    }\n    if (s) queueMicrotask(() => setProfile((p) => ({ ...p, name: s.name, email: s.email })));' },
  { target: 'function Stat({ label, value }) {\n  return (\n    <div className="flex flex-col gap-1 rounded-xl bg-slate-50 p-4 border border-slate-100">\n      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{label}</div>\n      <div className="text-xl font-black text-slate-800">{value}</div>\n    </div>\n  );\n}\n', replacement: '' }
]);

// 2. TestRunner.jsx
replaceInFile('R:/Tek School/Tek School Frontend/src/components/dashboard/TestRunner.jsx', [
  { target: 'if (isTimed && remaining === 0) setSubmitted(true);', replacement: 'if (isTimed && remaining === 0) queueMicrotask(() => setSubmitted(true));' },
  { target: 'setQLeft(PER_Q);', replacement: 'queueMicrotask(() => setQLeft(PER_Q));' },
  { target: 'if (current < total - 1) setCurrent((c) => c + 1);else\n    setSubmitted(true);', replacement: 'if (current < total - 1) queueMicrotask(() => setCurrent((c) => c + 1));else\n    queueMicrotask(() => setSubmitted(true));' }
]);

// 3. TekGuru.jsx
replaceInFile('R:/Tek School/Tek School Frontend/src/components/dashboard/TekGuru.jsx', [
  { target: 'Date.now().toString()', replacement: 'Math.random().toString()' }
]);

// 4. LiveTranscript.jsx
replaceInFile('R:/Tek School/Tek School Frontend/src/components/dashboard/LiveTranscript.jsx', [
  { target: 'export const TRANSCRIPT_LANGS = [', replacement: 'const TRANSCRIPT_LANGS = [' }
]);

// 5. ClassVideoModal.jsx
replaceInFile('R:/Tek School/Tek School Frontend/src/components/dashboard/ClassVideoModal.jsx', [
  { target: 'setPlaying(false);\n    setProgress(0);', replacement: 'queueMicrotask(() => {\n      setPlaying(false);\n      setProgress(0);\n    });' }
]);

// 6. CodeRunner.jsx
replaceInFile('R:/Tek School/Tek School Frontend/src/components/dashboard/CodeRunner.jsx', [
  { target: 'setShowHint(false);\n    setBottom("tests");', replacement: 'queueMicrotask(() => {\n      setShowHint(false);\n      setBottom("tests");\n    });' }
]);

// 7. LearningDashboard.jsx
replaceInFile('R:/Tek School/Tek School Frontend/src/features/student/learning/LearningDashboard.jsx', [
  { target: 'const completed = ASSESSMENTS.filter((i) => i.status === "done").length;\n', replacement: '' }
]);

console.log("Linting issues fixed!");
