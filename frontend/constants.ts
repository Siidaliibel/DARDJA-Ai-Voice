
import type { Voice, Translations } from './types';

export const MAX_GENERATIONS = 200;

export const VOICES: Voice[] = [
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
  {
    id: "Samir",
    name: "Samir",
    previewUrl:
      "https://egnqddcngnhkfjzixdhj.supabase.co/storage/v1/object/public/voice-previews/Samir.wav",
  },
  {
    id: "Ramzi",
    name: "Ramzi",
    previewUrl:
      "https://egnqddcngnhkfjzixdhj.supabase.co/storage/v1/object/public/voice-previews/Ramzi.wav",
  },
  {
    id: "Ines",
    name: "Ines",
    previewUrl:
      "https://egnqddcngnhkfjzixdhj.supabase.co/storage/v1/object/public/voice-previews/ines.wav",
  },
  {
    id: "Yasmine",
    name: "Yasmine",
    previewUrl:
      "https://egnqddcngnhkfjzixdhj.supabase.co/storage/v1/object/public/voice-previews/Yasmine.wav",
  },
  {
    id: "Kawther",
    name: "Kawther",
    previewUrl:
      "https://egnqddcngnhkfjzixdhj.supabase.co/storage/v1/object/public/voice-previews/Kawther.wav",
  },
];


export const DEFAULT_VOICE_STYLE_PROMPT = `Please generate a voiceover in the Algerian Arabic dialect with a marketing tone that is energetic, persuasive, and friendly. The voice should sound like it's speaking directly to the customer, encouraging them to take action. The tone should be confident, enthusiastic, and engaging, with a medium to fast pace and natural conversational rhythm. Here's the script to read:`;

export const EXAMPLE_SCRIPT_TEXT = `Welcome to DARDJA Ai Voice! Try converting your text to voice in Algerian Arabic.`;

export const TRANSLATIONS: Translations = {
  en: {
    siteTitle: 'DARDJA Ai Voice',
    voiceStylePromptLabel: 'Voice Style Prompt',
    scriptTextLabel: 'Script Text',
    tryExample1: 'Try Example 1',
    tryExample2: 'Try Example 2',
    selectVoice: 'Select Voice',
    generateVoice: 'Generate Voice',
    generating: 'Generating...',
    stopGeneration: 'Stop Generation',
    speedControl: 'Speed',
    downloadWav: 'Download as WAV',
    limitReached: "You've reached your monthly limit. Please renew your subscription.",
    footerText: '© 2025 DARDJA Ai Voice – All Rights Reserved.',
    generationError: 'An error occurred during voice generation. Please try again.',
  },
  fr: {
    siteTitle: 'DARDJA Ai Voice',
    voiceStylePromptLabel: 'Prompt de Style Vocal',
    scriptTextLabel: 'Texte du Script',
    tryExample1: 'Exemple 1',
    tryExample2: 'Exemple 2',
    selectVoice: 'Sélectionner une Voix',
    generateVoice: 'Générer la Voix',
    generating: 'Génération...',
    stopGeneration: 'Arrêter la Génération',
    speedControl: 'Vitesse',
    downloadWav: 'Télécharger en WAV',
    limitReached: "Vous avez atteint votre limite mensuelle. Veuillez renouveler votre abonnement.",
    footerText: '© 2025 DARDJA Ai Voix – Tous droits réservés.',
    generationError: "Une erreur s'est produite lors de la génération de la voix. Veuillez réessayer.",
  },
  ar: {
    siteTitle: 'DARDJA Ai Voice',
    voiceStylePromptLabel: 'نمط الصوت',
    scriptTextLabel: 'النص',
    tryExample1: 'جرّب المثال 1',
    tryExample2: 'جرّب المثال 2',
    selectVoice: 'اختر الصوت',
    generateVoice: 'إنشاء الصوت',
    generating: 'جاري الإنشاء...',
    stopGeneration: 'إيقاف الإنشاء',
    speedControl: 'السرعة',
    downloadWav: 'تحميل كملف WAV',
    limitReached: 'لقد وصلت إلى حدك الشهري. يرجى تجديد اشتراكك.',
    footerText: '© 2025 دارجة - صوت الذكاء الاصطناعي – جميع الحقوق محفوظة.',
    generationError: 'حدث خطأ أثناء إنشاء الصوت. يرجى المحاولة مرة أخرى.',
  },
};
