import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import {
  MAX_GENERATIONS,
  DEFAULT_VOICE_STYLE_PROMPT,
  EXAMPLE_SCRIPT_TEXT,
  TRANSLATIONS,
} from "./constants";
import type { Language } from "./types";
import { generateSpeech } from "./services/geminiService";
import { pcmToWavBlob } from "./utils/audioUtils";
import { Logo } from "./Logo";

// ✅ الأصوات المربوطة مباشرة بروابط Supabase
const VOICE_PREVIEWS = [
  {
    id: "Amel",
    name: "Amel",
    previewUrl:
      "https://egnqddcngnhkfjzixdhj.supabase.co/storage/v1/object/public/voice-previews/amel.wav",
  },
  {
    id: "Wael",
    name: "Wael",
    previewUrl:
      "https://egnqddcngnhkfjzixdhj.supabase.co/storage/v1/object/public/voice-previews/wael.wav",
  },
  {
    id: "Imen",
    name: "Imen",
    previewUrl:
      "https://egnqddcngnhkfjzixdhj.supabase.co/storage/v1/object/public/voice-previews/imen.wav",
  },
  {
    id: "Amine",
    name: "Amine",
    previewUrl:
      "https://egnqddcngnhkfjzixdhj.supabase.co/storage/v1/object/public/voice-previews/amine.wav",
  },
];

// ✅ مكون الهيدر
const Header: React.FC<{
  language: Language;
  setLanguage: (lang: Language) => void;
  siteTitle: string;
  onLogout: () => void;
  isAdmin: boolean;
  onAdminClick: () => void;
}> = ({ language, setLanguage, siteTitle, onLogout, isAdmin, onAdminClick }) => {
  const translations = {
    en: "Logout",
    fr: "Déconnexion",
    ar: "تسجيل الخروج",
  } as const;

  return (
    <header className="py-4 px-4 md:px-8 w-full relative mb-4 flex justify-between items-start">
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors absolute top-6 left-6 md:left-8"
      >
        <span
          className="material-symbols-outlined text-[28px] align-middle"
          style={{
            fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 32",
          }}
        >
          logout
        </span>
        <span className="text-base font-semibold select-none">
          {translations[language]}
        </span>
      </button>

      {isAdmin && (
        <button
          onClick={onAdminClick}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#1A73E8] text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all focus:outline-none active:scale-95"
        >
          لوحة تحكم الأدمين ⚙️
        </button>
      )}

      <div className="opacity-0 animate-fade-in flex flex-col items-center w-full mt-10">
        <Logo />
        <h1 className="text-3xl md:text-4xl font-merriweather text-center mt-4 tracking-wider animated-gradient-text logo-title text-white">
          {siteTitle}
        </h1>
      </div>

      <div className="absolute top-6 right-4 md:right-8 flex gap-2 text-sm">
        {(["en", "fr", "ar"] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-2 py-1 rounded-md transition-colors ${
              language === lang
                ? "bg-[#1A73E8] text-white"
                : "bg-gray-800 bg-opacity-70 hover:bg-gray-700"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
};
// ✅ مشغل الصوت
const AudioPlayer: React.FC<{
  audioUrl: string;
  trans: Record<string, string>;
  canDownload: boolean;
}> = ({ audioUrl, trans, canDownload }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [audioUrl]);

  return (
    <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg w-full">
      <audio ref={audioRef} key={audioUrl} controls src={audioUrl} className="w-full" />
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <label htmlFor="speed-control" className="text-sm">
            {trans.speedControl}:
          </label>
          <select
            id="speed-control"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
          >
            {[0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>

        {canDownload ? (
          <a
            href={audioUrl}
            download="dardja_ai_voice.wav"
            className="bg-[#1A73E8] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md text-sm"
          >
            {trans.downloadWav}
          </a>
        ) : (
          <button
            disabled
            className="bg-gray-700 text-gray-400 font-bold py-2 px-4 rounded-lg text-sm cursor-not-allowed"
          >
            التحميل متاح بعد التفعيل
          </button>
        )}
      </div>
    </div>
  );
};
// ---------------- بدأ مكون App
export default function App() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("en");
  const [voiceStylePrompt, setVoiceStylePrompt] = useState(DEFAULT_VOICE_STYLE_PROMPT);
  const [scriptText, setScriptText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PREVIEWS[0].id);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTrialEnded, setIsTrialEnded] = useState(false);
  const [generationTime, setGenerationTime] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const trans = TRANSLATIONS[language];
  const timerIntervalRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ تحميل بيانات الحساب من Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate("/login");
        return;
      }

      if (session) {
        localStorage.setItem("supabase.auth.token", JSON.stringify(session));
      }

      const user = session.user;
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profileData) {
        navigate("/login");
        return;
      }

      setProfile(profileData);
      setGenerationCount(profileData.usage_count ?? 0);

      const limit = profileData.max_generations ?? 2;
      const hasEnded = profileData.active === false || (profileData.trial_used && profileData.usage_count >= limit);
      setIsTrialEnded(hasEnded);

      if (profileData.role === "admin") setIsAdmin(true);
    };

    fetchProfile();
  }, [navigate]);

  // ✅ مؤقت التوليد
  const startTimer = useCallback(() => {
    setGenerationTime(0);
    timerIntervalRef.current = window.setInterval(() => {
      setGenerationTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);
  // ✅ تشغيل / إيقاف صوت المعاينة 🎧 ⏸️
  const handlePlayPreview = () => {
    const voice = VOICE_PREVIEWS.find((v) => v.id === selectedVoice);
    if (!voice?.previewUrl) return;

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
      setIsPreviewPlaying(false);
      return;
    }

    const audio = new Audio(voice.previewUrl);
    previewAudioRef.current = audio;
    setIsPreviewPlaying(true);
    audio.play().catch(() => {});
    audio.onended = () => {
      previewAudioRef.current = null;
      setIsPreviewPlaying(false);
    };
  };

  // ✅ إنشاء الصوت + تحديث العدّاد + منع التكرار بعد الحد
  const handleGenerate = async () => {
    if (!profile) return;

    // **أهم تعديل هنا**: جلب أحدث نسخة من صف البروفايل قبل أي تحقق
    const { data: latestProfile, error: latestErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profile.id)
      .single();

    const effectiveProfile = latestProfile ?? profile; // fallback إذا فشل الطلب

    // احصل القيم المباشرة من السطر الأحدث
    const limit = effectiveProfile.max_generations ?? 2;
    const currentCount = effectiveProfile.usage_count ?? 0;
    const isActive = effectiveProfile.active !== false; // treat undefined as active

    // 🚫 إذا انتهت التجربة أو الحساب موقوف
    if (!isActive || (effectiveProfile.trial_used && currentCount >= limit)) {
      setIsTrialEnded(true);
      // تأكدنا من كتابة trial_used في القاعدة إن لزم (قاعدة تعطيك الحق في تغيير الرسالة)
      await supabase.from("profiles").update({ trial_used: true }).eq("id", profile.id);
      alert("🎯 انتهت تجربتك المجانية. يمكنك تفعيل 200 توليد صوتي بـ 2900 دج.");
      // حدّث الحالة المحلية أيضاً
      setProfile((p: any) => ({ ...p, trial_used: true, active: false }));
      return;
    }

    if (isGenerating) return;
    if (scriptText.trim().length === 0) {
      setError("الرجاء إدخال نص قبل التوليد.");
      return;
    }
    if (scriptText.length > (effectiveProfile?.max_characters ?? 600)) {
      setError("لقد تجاوزت الحد المسموح للحروف.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    startTimer();

    abortControllerRef.current = new AbortController();
    const currentAbort = abortControllerRef.current;
    const fullPrompt = `${voiceStylePrompt} ${scriptText}`;

    try {
      const base64Audio = await generateSpeech(fullPrompt, selectedVoice);
      if (currentAbort.signal.aborted) return;

      const wavBlob = pcmToWavBlob(base64Audio);
      const newAudioUrl = URL.createObjectURL(wavBlob);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(newAudioUrl);

      // ✅ زيادة العدد وتحديثه في Supabase ثم جلب القيمة المحدثة مباشرة
      const newCount = currentCount + 1;

      const { data: updatedProfile } = await supabase
        .from("profiles")
        .update({ usage_count: newCount })
        .eq("id", profile.id)
        .select("*")
        .single();

      // تحديث الحالة في React مباشرة بعد كل توليد
      if (updatedProfile) {
        setProfile(updatedProfile);
        setGenerationCount(updatedProfile.usage_count ?? newCount);
      } else {
        setGenerationCount(newCount);
      }

      // 🚫 منع التوليد بعد الوصول إلى الحد
      if ((updatedProfile?.usage_count ?? newCount) >= (updatedProfile?.max_generations ?? limit)) {
        await supabase
          .from("profiles")
          .update({ trial_used: true })
          .eq("id", profile.id);
        setIsTrialEnded(true);
        alert("🚫 انتهت تجربتك المجانية. فعّل حسابك للمتابعة.");
      }
    } catch (err) {
      console.error("Error generating voice:", err);
      setError(trans.generationError);
    } finally {
      setIsGenerating(false);
      stopTimer();
    }
  };
  // ✅ إيقاف التوليد
  const handleStop = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsGenerating(false);
    stopTimer();
    setGenerationTime(0);
  };

  const handleTryExample = () => {
    setVoiceStylePrompt(DEFAULT_VOICE_STYLE_PROMPT);
    setScriptText(EXAMPLE_SCRIPT_TEXT);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const canDownload = profile?.trial_used && profile?.max_generations > 2;

  // ✅ واجهة المستخدم
  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen flex flex-col items-center p-4 md:p-8 ${
        language === "ar" ? "font-cairo" : "font-sans"
      }`}
    >
      <Header
        language={language}
        setLanguage={setLanguage}
        siteTitle={trans.siteTitle}
        onLogout={async () => {
          await supabase.auth.signOut();
          localStorage.removeItem("supabase.auth.token");
          navigate("/login");
        }}
        isAdmin={isAdmin}
        onAdminClick={() => navigate("/admin")}
      />

      <main className="w-full max-w-3xl flex-grow flex flex-col items-center">
        <div className="w-full bg-gray-900 bg-opacity-50 p-6 rounded-2xl shadow-2xl border border-gray-700 space-y-6">
          {/* Voice Style Prompt & Script */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="voice-style-prompt"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {trans.voiceStylePromptLabel}
              </label>
              <textarea
                id="voice-style-prompt"
                rows={8}
                value={voiceStylePrompt}
                onChange={(e) => setVoiceStylePrompt(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              />
            </div>

            <div>
              <label
                htmlFor="script-text"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                {trans.scriptTextLabel}
              </label>
              <textarea
                id="script-text"
                rows={8}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder={
                  language === "ar" ? "اكتب النص هنا..." : "Enter your script here..."
                }
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
              />
            </div>
          </div>

          {/* مثال جاهز */}
          <div className="flex justify-end">
            <button
              onClick={handleTryExample}
              className="text-sm text-[#1A73E8] hover:underline"
            >
              {trans.tryExample}
            </button>
          </div>

          {/* قائمة الأصوات 🎧 / ⏸️ */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <select
                  id="voice-select"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8] h-10"
                >
                  {VOICE_PREVIEWS.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.name}
                    </option>
                  ))}
                </select>

                {/* زر المعاينة 🎧 */}
                <button
                  onClick={handlePlayPreview}
                  className={`${
                    isPreviewPlaying
                      ? "bg-blue-700 hover:bg-blue-800"
                      : "bg-[#1A73E8] hover:bg-blue-600"
                  } text-white rounded-full p-2 shadow-md transition-transform active:scale-95`}
                  title="استمع لصوت المعاينة"
                >
                  {isPreviewPlaying ? "⏸️" : "🎧"}
                </button>
              </div>
            </div>

            {/* زر التوليد 🎙️ */}
            <div className="flex-grow flex items-center gap-2 w-full sm:w-auto">
              {isGenerating && (
                <div className="text-sm font-mono text-gray-400 w-12">
                  {formatTime(generationTime)}
                </div>
              )}

              {isGenerating ? (
                <button
                  onClick={handleStop}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md flex-grow"
                >
                  {trans.stopGeneration}
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isTrialEnded || !scriptText}
                  className={`w-full ${
                    isTrialEnded
                      ? "bg-gray-700 cursor-not-allowed text-gray-400"
                      : "bg-[#1A73E8] hover:bg-blue-600 text-white"
                  } font-bold py-2 px-4 rounded-lg transition-colors shadow-md flex-grow`}
                >
                  {isTrialEnded ? "🔒 انتهت التجربة — فعّل الحساب" : trans.generateVoice}
                </button>
              )}
            </div>
          </div>

          {/* إشعار نهاية التجربة */}
          {isTrialEnded && (
            <p className="text-center text-yellow-400 text-sm mt-2">
              🎯 انتهت تجربتك المجانية. يمكنك تفعيل 200 تعليق صوتي بـ <b>2900 دج</b>.
            </p>
          )}

          {/* عرض الأخطاء */}
          {error && <p className="text-center text-red-400 text-sm mt-2">{error}</p>}

          {/* عداد التوليدات */}
          <p className="text-center text-xs text-gray-500 mt-2">
            {generationCount} / {profile?.max_generations ?? 2} توليد صوتي.
          </p>

          {/* مشغل الصوت */}
          {audioUrl && <AudioPlayer audioUrl={audioUrl} trans={trans} canDownload={canDownload} />}
        </div>
      </main>

      <footer className="w-full text-center text-gray-500 text-xs py-4 mt-8">
        {trans.footerText}
      </footer>
    </div>
  );
}
