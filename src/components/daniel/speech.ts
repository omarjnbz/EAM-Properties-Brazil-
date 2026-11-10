"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/config";

/**
 * Voice for Daniel, using only what the browser already has: speech
 * recognition (Chrome, Edge, Safari) to ask by voice, and speech synthesis
 * (every modern browser) to read his replies aloud. Nothing is sent to us or
 * to an AI service beyond the text the visitor then chooses to send.
 * Where a browser lacks one, its button simply doesn't appear.
 */
const RECOGNITION_LANG: Record<Locale, string> = { en: "en-US", ar: "ar-AE", pt: "pt-BR" };

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type RecognitionCtor = new () => Recognition;

const noSubscribe = () => () => {};

/** Feature checks that can't change during a visit; false while server rendering. */
function useSupported(check: () => boolean) {
  return useSyncExternalStore(noSubscribe, check, () => false);
}

const hasSynthesis = () => "speechSynthesis" in window;

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Ask by voice: streams what the visitor says into `onText` while they speak. */
export function useDictation(locale: Locale, onText: (text: string) => void) {
  const supported = useSupported(() => recognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const ref = useRef<Recognition | null>(null);
  const onTextRef = useRef(onText);
  useEffect(() => {
    onTextRef.current = onText;
  });

  useEffect(() => () => ref.current?.abort(), []);

  const stop = useCallback(() => ref.current?.stop(), []);

  const start = useCallback(() => {
    const Ctor = recognitionCtor();
    if (!Ctor) return;
    ref.current?.abort();
    const r = new Ctor();
    r.lang = RECOGNITION_LANG[locale];
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      onTextRef.current(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    ref.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [locale]);

  return { supported, listening, start, stop };
}

/** Read Daniel's replies aloud in the language they're written in. */
export function useReadAloud(locale: Locale) {
  const supported = useSupported(hasSynthesis);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (hasSynthesis()) window.speechSynthesis.cancel();
    },
    [],
  );

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (id: string, text: string) => {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = /[؀-ۿ]/.test(text) ? "ar" : RECOGNITION_LANG[locale];
      u.rate = 1;
      u.onend = () => setSpeakingId((s) => (s === id ? null : s));
      u.onerror = () => setSpeakingId((s) => (s === id ? null : s));
      setSpeakingId(id);
      synth.speak(u);
    },
    [locale],
  );

  return { supported, speakingId, speak, stop };
}
