import { useEffect, useMemo, useRef, useState } from "react";
import { Languages, Volume2, VolumeX, Sparkles } from "lucide-react";



const TRANSCRIPT_LANGS = [
{ code: "en", label: "English", native: "English", voice: "en-IN" },
{ code: "hi", label: "Hindi", native: "हिंदी", voice: "hi-IN" },
{ code: "kn", label: "Kannada", native: "ಕನ್ನಡ", voice: "kn-IN" },
{ code: "ta", label: "Tamil", native: "தமிழ்", voice: "ta-IN" },
{ code: "te", label: "Telugu", native: "తెలుగు", voice: "te-IN" },
{ code: "mr", label: "Marathi", native: "मराठी", voice: "mr-IN" }];




const SCRIPT = [
{
  speaker: "Instructor",
  t: "00:01",
  en: "Welcome back everyone — today we walk through a single attention head, step by step.",
  hi: "सभी का स्वागत है — आज हम एक अटेंशन हेड को चरण दर चरण समझेंगे।",
  kn: "ಎಲ್ಲರಿಗೂ ಸ್ವಾಗತ — ಇಂದು ನಾವು ಒಂದು ಅಟೆನ್ಶನ್ ಹೆಡ್ ಅನ್ನು ಹಂತ ಹಂತವಾಗಿ ನೋಡೋಣ.",
  ta: "அனைவருக்கும் வரவேற்பு — இன்று ஒரு அட்டென்ஷன் ஹெட்டை படிப்படியாக பார்ப்போம்.",
  te: "అందరికీ స్వాగతం — ఈ రోజు ఒక అటెన్షన్ హెడ్‌ను దశలవారీగా చూద్దాం.",
  mr: "सर्वांचे स्वागत — आज आपण एक अटेंशन हेड टप्प्याटप्प्याने पाहू."
},
{
  speaker: "Instructor",
  t: "00:14",
  en: "Every token is projected into three vectors: query, key and value.",
  hi: "हर टोकन तीन वेक्टर में बदला जाता है: क्वेरी, की और वैल्यू।",
  kn: "ಪ್ರತಿ ಟೋಕನ್ ಮೂರು ವೆಕ್ಟರ್‌ಗಳಾಗಿ ಪರಿವರ್ತನೆಯಾಗುತ್ತದೆ: ಕ್ವೆರಿ, ಕೀ ಮತ್ತು ವ್ಯಾಲ್ಯೂ.",
  ta: "ஒவ்வொரு டோக்கனும் மூன்று வெக்டர்களாக மாற்றப்படுகிறது: குவரி, கீ, வேல்யூ.",
  te: "ప్రతి టోకెన్ మూడు వెక్టార్లుగా మారుతుంది: క్వెరీ, కీ, వాల్యూ.",
  mr: "प्रत्येक टोकन तीन व्हेक्टरमध्ये रूपांतरित होते: क्वेरी, की आणि व्हॅल्यू."
},
{
  speaker: "Instructor",
  t: "00:31",
  en: "We take the dot product of the query with every key to get raw attention scores.",
  hi: "हम क्वेरी का हर की के साथ डॉट प्रोडक्ट लेकर अटेंशन स्कोर निकालते हैं।",
  kn: "ಕ್ವೆರಿಯನ್ನು ಪ್ರತಿ ಕೀ ಜೊತೆ ಡಾಟ್ ಪ್ರಾಡಕ್ಟ್ ಮಾಡಿ ಅಟೆನ್ಶನ್ ಸ್ಕೋರ್ ಪಡೆಯುತ್ತೇವೆ.",
  ta: "குவரியை ஒவ்வொரு கீயுடன் டாட் புராடக்ட் செய்து அட்டென்ஷன் ஸ்கோர் பெறுகிறோம்.",
  te: "క్వెరీని ప్రతి కీతో డాట్ ప్రొడక్ట్ చేసి అటెన్షన్ స్కోర్ పొందుతాం.",
  mr: "क्वेरीचा प्रत्येक कीसोबत डॉट प्रॉडक्ट घेऊन अटेंशन स्कोअर मिळवतो."
},
{
  speaker: "Meera S.",
  t: "00:48",
  en: "Why do we divide by the square root of the dimension?",
  hi: "हम डाइमेंशन के वर्गमूल से भाग क्यों देते हैं?",
  kn: "ಡೈಮೆನ್ಶನ್‌ನ ವರ್ಗಮೂಲದಿಂದ ಏಕೆ ಭಾಗಿಸುತ್ತೇವೆ?",
  ta: "ஏன் பரிமாணத்தின் வர்க்கமூலத்தால் வகுக்கிறோம்?",
  te: "డైమెన్షన్ వర్గమూలంతో ఎందుకు భాగిస్తాం?",
  mr: "आपण डायमेन्शनच्या वर्गमुळाने का भागतो?"
},
{
  speaker: "Instructor",
  t: "00:55",
  en: "Good question — it keeps the scores small so softmax does not saturate.",
  hi: "अच्छा सवाल — इससे स्कोर छोटे रहते हैं और सॉफ्टमैक्स संतृप्त नहीं होता।",
  kn: "ಒಳ್ಳೆಯ ಪ್ರಶ್ನೆ — ಇದರಿಂದ ಸ್ಕೋರ್ ಚಿಕ್ಕದಾಗಿರುತ್ತದೆ ಮತ್ತು ಸಾಫ್ಟ್‌ಮ್ಯಾಕ್ಸ್ ಸ್ಯಾಚುರೇಟ್ ಆಗುವುದಿಲ್ಲ.",
  ta: "நல்ல கேள்வி — இதனால் ஸ்கோர் சிறியதாக இருக்கும், சாஃப்ட்மேக்ஸ் நிறைவடையாது.",
  te: "మంచి ప్రశ్న — దీనివల్ల స్కోర్లు చిన్నవిగా ఉండి సాఫ్ట్‌మ్యాక్స్ సాచురేట్ కాదు.",
  mr: "चांगला प्रश्न — यामुळे स्कोअर लहान राहतात आणि सॉफ्टमॅक्स सॅच्युरेट होत नाही."
},
{
  speaker: "Instructor",
  t: "01:10",
  en: "Softmax turns the scores into weights, and we blend the value vectors with them.",
  hi: "सॉफ्टमैक्स स्कोर को वेट में बदलता है, और हम वैल्यू वेक्टर को उनसे मिलाते हैं।",
  kn: "ಸಾಫ್ಟ್‌ಮ್ಯಾಕ್ಸ್ ಸ್ಕೋರ್‌ಗಳನ್ನು ವೇಟ್ ಆಗಿ ಬದಲಾಯಿಸುತ್ತದೆ, ಅವುಗಳಿಂದ ವ್ಯಾಲ್ಯೂ ವೆಕ್ಟರ್‌ಗಳನ್ನು ಬೆರೆಸುತ್ತೇವೆ.",
  ta: "சாஃப்ட்மேக்ஸ் ஸ்கோரை எடையாக மாற்றுகிறது, அவற்றுடன் வேல்யூ வெக்டர்களை கலக்கிறோம்.",
  te: "సాఫ్ట్‌మ్యాక్స్ స్కోర్లను వెయిట్లుగా మారుస్తుంది, వాటితో వాల్యూ వెక్టార్లను కలుపుతాం.",
  mr: "सॉफ्टमॅक्स स्कोअरचे वेट्समध्ये रूपांतर करतो आणि त्यांच्यासह व्हॅल्यू व्हेक्टर मिसळतो."
},
{
  speaker: "Instructor",
  t: "01:28",
  en: "Next we stack eight of these heads and concatenate the outputs.",
  hi: "अब हम ऐसे आठ हेड जोड़ते हैं और आउटपुट को जोड़ देते हैं।",
  kn: "ಈಗ ಇಂತಹ ಎಂಟು ಹೆಡ್‌ಗಳನ್ನು ಜೋಡಿಸಿ ಔಟ್‌ಪುಟ್‌ಗಳನ್ನು ಸೇರಿಸುತ್ತೇವೆ.",
  ta: "இப்போது இப்படி எட்டு ஹெட்களை அடுக்கி வெளியீடுகளை இணைக்கிறோம்.",
  te: "ఇప్పుడు ఇలాంటి ఎనిమిది హెడ్‌లను పేర్చి అవుట్‌పుట్‌లను కలుపుతాం.",
  mr: "आता अशी आठ हेड्स एकत्र करून आउटपुट जोडतो."
}];


export function LiveTranscript({ instructor }) {
  const [lang, setLang] = useState("en");
  const [count, setCount] = useState(2);
  const [speak, setSpeak] = useState(false);
  const boxRef = useRef(null);
  const meta = useMemo(() => TRANSCRIPT_LANGS.find((l) => l.code === lang), [lang]);

  useEffect(() => {
    if (count >= SCRIPT.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), 4500);
    return () => clearTimeout(t);
  }, [count]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [count, lang]);

  // Speak the newest line in the chosen language
  useEffect(() => {
    if (!speak || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const line = SCRIPT[count - 1];
    if (!line) return;
    const u = new SpeechSynthesisUtterance(line[lang]);
    u.lang = meta.voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return () => window.speechSynthesis.cancel();
  }, [count, speak, lang, meta.voice]);

  useEffect(() => {
    if (!speak && typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [speak]);

  const lines = SCRIPT.slice(0, count);

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3 border-b border-border p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent-blue-deep)]" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">AI live transcript & translation</p>
        </div>
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 shrink-0 text-slate-400" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold outline-none"
            aria-label="Transcript language">
            
            {TRANSCRIPT_LANGS.map((l) =>
            <option key={l.code} value={l.code}>
                {l.native} · {l.label}
              </option>
            )}
          </select>
          <button
            onClick={() => setSpeak((s) => !s)}
            title={speak ? "Stop audio translation" : "Listen in this language"}
            aria-label={speak ? "Stop audio translation" : "Listen in this language"}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-colors ${
            speak ? "border-transparent bg-[var(--accent-blue-deep)] text-white" : "border-border hover:bg-slate-50"}`
            }>
            
            {speak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {instructor} is speaking in English — captions {lang === "en" ? "shown as spoken" : `auto-translated to ${meta.label}`}
          {speak ? " and read aloud in your language." : "."}
        </p>
      </div>

      <div ref={boxRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {lines.map((l, i) =>
        <div key={i} className="rounded-2xl bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {l.speaker === "Instructor" ? instructor : l.speaker} · {l.t}
            </p>
            <p className="mt-0.5 text-sm leading-snug">{l[lang]}</p>
            {lang !== "en" && <p className="mt-1 text-[11px] italic text-slate-400">{l.en}</p>}
          </div>
        )}
        {count < SCRIPT.length &&
        <p className="flex items-center gap-1.5 px-1 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" /> transcribing…
          </p>
        }
      </div>
    </div>);

}