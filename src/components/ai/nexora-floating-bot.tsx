"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Trash2,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  Mic,
  MicOff,
  Languages,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  citations?: string[];
  suggestedPrompts?: string[];
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: { resultIndex: number; results: { [key: number]: { 0: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export function NexoraFloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [speechLang, setSpeechLang] = useState<"en-IN" | "hi-IN">("en-IN");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "👋 Namaste! I am **Nexora.ai**, your AI Career & Skill Intelligence Assistant for **Skillora**.\n\n🎙️ **Bilingual AI Voice Enabled (English & हिन्दी)!**\n\nAsk me anything or speak via microphone about:\n- 🎯 **Skill-Gap Diagnostics & Assessment**\n- 🗺️ **Personalized Career Roadmaps** (Full Stack, AI/ML, Cloud, Web3)\n- ⚡ **Explainable AI Opportunity Matching**\n- 🎙️ **Bilingual Mock Interview Simulator**\n- 🏛️ **College & Recruiter Features**",
      timestamp: "Just now",
      citations: ["Skillora Core Architecture"],
      suggestedPrompts: [
        "How does Skillora work?",
        "Generate 3-month AI Roadmap",
        "What is Explainable Matching?",
        "Benefits for Colleges & Academia",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isLoading, isListening]);

  // Stop active speech playback
  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Text-To-Speech with Browser Neural Voice in English or Hindi
  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis || !ttsEnabled) return;
    stopSpeech();

    const cleanText = text
      .replace(/[*#_`~[\]()]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[\n\r]+/g, " ")
      .trim();

    if (!cleanText) return;

    // Detect if text is primarily Hindi or Hinglish or if Hindi mode is active
    const isHindiText =
      speechLang === "hi-IN" ||
      /[\u0900-\u097F]/.test(cleanText) ||
      /namaste|kya|kaise|batao|karna|chahiye|hai|hain|shukriya|madad|bhai|padhai|seekhe/.test(cleanText.toLowerCase());

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 500));
      utterance.rate = isHindiText ? 0.95 : 1.0;
      utterance.pitch = 1.0;
      utterance.lang = isHindiText ? "hi-IN" : "en-IN";

      // Select natural Hindi or English voice
      const voices = window.speechSynthesis.getVoices();
      if (isHindiText) {
        const hindiVoice = voices.find(
          (v) => v.lang.startsWith("hi") || v.lang.includes("hi-IN") || v.name.toLowerCase().includes("hindi")
        );
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const englishVoice = voices.find(
          (v) =>
            (v.lang.includes("en-IN") || v.lang.startsWith("en")) &&
            (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Neural") || v.name.includes("India"))
        );
        if (englishVoice) utterance.voice = englishVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  }, [ttsEnabled, speechLang, stopSpeech]);

  // Send message and get AI response in selected language
  const handleSendMessage = useCallback(async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    stopSpeech();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/nexora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language: speechLang === "hi-IN" ? "hi" : "en",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          citations: data.citations,
          suggestedPrompts: data.suggestedPrompts,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (ttsEnabled) speakText(data.reply);
      } else {
        throw new Error("Failed to fetch response");
      }
    } catch (err) {
      console.error("AI Error:", err);
      const errorMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: speechLang === "hi-IN"
          ? "⚠️ क्षमा करें, कुछ तकनीकी समस्या आई है। कृपया दोबारा पूछें!"
          : "⚠️ Sorry, I encountered a temporary connection issue. Please try asking again!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, isListening, speechLang, ttsEnabled, speakText, stopSpeech]);

  // Global event listener to open Nexora from anywhere
  useEffect(() => {
    const handleOpenChat = (event: Event) => {
      const customEvent = event as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      setIsMinimized(false);
      if (customEvent.detail?.prompt) {
        handleSendMessage(customEvent.detail.prompt);
      }
    };

    window.addEventListener("open-nexora-chat", handleOpenChat);
    return () => {
      window.removeEventListener("open-nexora-chat", handleOpenChat);
    };
  }, [handleSendMessage]);

  // Initialize Web Speech Recognition (Speech-to-Text) with selected language
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechConstructor =
        (window as unknown as { SpeechRecognition?: new () => ISpeechRecognition; webkitSpeechRecognition?: new () => ISpeechRecognition }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => ISpeechRecognition }).webkitSpeechRecognition;

      if (SpeechConstructor) {
        const recognition = new SpeechConstructor();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = speechLang;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < 50; i++) {
            if (event.results[i]) {
              transcript += event.results[i][0].transcript;
            } else {
              break;
            }
          }
          if (transcript) {
            setInputMessage(transcript);
          }
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [speechLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeech();
      try {
        recognitionRef.current.lang = speechLang;
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition already started:", e);
      }
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    stopSpeech();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        text: speechLang === "hi-IN"
          ? "✨ चैट साफ़ कर दी गई है! मैं हूँ **Nexora.ai**। आज मैं आपकी **Skillora** पर क्या मदद कर सकता हूँ?"
          : "✨ Chat cleared! I am **Nexora.ai**. How can I help your career journey on **Skillora** today?",
        timestamp: "Just now",
        suggestedPrompts: [
          "How does Skillora work?",
          "Generate 3-month AI Roadmap",
          "What is Explainable Matching?",
          "Benefits for Colleges & Academia",
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
          >
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              <span>Ask Nexora AI ({speechLang === "en-IN" ? "English" : "हिन्दी"})</span>
            </motion.div>

            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="relative p-4 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-xl shadow-cyan-950/60 border border-cyan-400/40 hover:scale-105 active:scale-95 transition-all duration-200 group"
              aria-label="Open Nexora AI Chat"
            >
              <div className="relative">
                <Bot className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "auto" : "590px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] rounded-2xl bg-slate-950/95 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-slate-900/90 via-cyan-950/40 to-slate-900/90 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Bot className="h-4 w-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground leading-none">Nexora.ai</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase tracking-wider font-semibold">
                      Bilingual AI Voice
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Skillora Intelligence Assistant
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Speaking Indicator */}
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono text-cyan-300"
                  >
                    <Activity className="h-3 w-3 animate-pulse text-cyan-400" />
                    <span>Speaking</span>
                  </motion.div>
                )}

                {/* Voice Lang Toggle (English / Hindi) */}
                <button
                  type="button"
                  onClick={() => {
                    const nextLang = speechLang === "en-IN" ? "hi-IN" : "en-IN";
                    setSpeechLang(nextLang);
                    stopSpeech();
                  }}
                  className={`px-2 py-1 rounded-lg border transition-all text-xs font-mono flex items-center gap-1 font-bold ${
                    speechLang === "hi-IN"
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm"
                      : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                  }`}
                  title={`Click to switch language. Current: ${speechLang === "en-IN" ? "English" : "हिन्दी (Hindi)"}`}
                >
                  <Languages className="h-3.5 w-3.5" />
                  <span>{speechLang === "en-IN" ? "EN" : "हिन्दी (HI)"}</span>
                </button>

                {/* TTS Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (ttsEnabled) stopSpeech();
                    setTtsEnabled(!ttsEnabled);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-cyan-300 hover:bg-white/[0.05] transition-colors"
                  title={ttsEnabled ? "Voice Output Active (Click to Mute)" : "Voice Output Muted (Click to Enable)"}
                >
                  {ttsEnabled ? <Volume2 className="h-3.5 w-3.5 text-cyan-400" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
                </button>

                {/* Clear Chat */}
                <button
                  type="button"
                  onClick={clearChat}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-white/[0.05] transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                {/* Minimize */}
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => {
                    stopSpeech();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-white/[0.05] transition-colors"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Body (Hidden when minimized) */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-950/40"
                            : "bg-slate-900/90 border border-white/[0.08] text-slate-200 rounded-tl-none shadow-md"
                        }`}
                      >
                        {/* Markdown Formatted Text */}
                        <div className="space-y-2 whitespace-pre-wrap">
                          {msg.text.split("\n\n").map((para, i) => (
                            <p key={i} className="leading-relaxed">
                              {para.split("**").map((chunk, j) =>
                                j % 2 === 1 ? <strong key={j} className="text-cyan-300 font-bold">{chunk}</strong> : chunk
                              )}
                            </p>
                          ))}
                        </div>

                        {/* Citations / Grounding Badges */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground font-mono">Source:</span>
                            {msg.citations.map((c, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-300"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions for Assistant Message */}
                        {msg.sender === "assistant" && (
                          <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                            <span>{msg.timestamp}</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => speakText(msg.text)}
                                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                                title="Read Aloud"
                              >
                                <Volume2 className="h-3 w-3" />
                                <span>Play</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopy(msg.id, msg.text)}
                                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
                                title="Copy Text"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Suggested Prompts */}
                      {msg.suggestedPrompts && (
                        <div className="mt-2 flex flex-wrap gap-1.5 max-w-[88%]">
                          {msg.suggestedPrompts.map((prompt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSendMessage(prompt)}
                              className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-slate-900/60 hover:bg-cyan-950/50 border border-white/10 hover:border-cyan-500/40 text-muted-foreground hover:text-cyan-300 transition-all text-left"
                            >
                              ⚡ {prompt}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <div className="h-6 w-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Bot className="h-3.5 w-3.5 animate-spin" />
                      </div>
                      <span className="text-[11px] font-mono animate-pulse">
                        {speechLang === "hi-IN"
                          ? "नेक्सोरा ज्ञानकोष खोज रहा है और उत्तर तैयार कर रहा है..."
                          : "Nexora is searching knowledge base & synthesizing response..."}
                      </span>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Controls */}
                <div className="p-3 bg-slate-900/60 border-t border-white/[0.08]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    {/* Voice Dictation Button */}
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isListening
                          ? "bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-md shadow-rose-950 animate-pulse"
                          : "bg-white/[0.03] border-white/10 text-muted-foreground hover:text-cyan-300 hover:border-cyan-500/40"
                      }`}
                      title={isListening ? "Listening... (Click to Stop)" : `Speak in ${speechLang === "en-IN" ? "English" : "हिन्दी (Hindi)"}`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </button>

                    {/* Text Input */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={
                        isListening
                          ? speechLang === "hi-IN" ? "सुन रहा हूँ... हिन्दी में बोलें..." : "Listening... speak now in English..."
                          : speechLang === "hi-IN"
                          ? "नेक्सोरा से हिन्दी में पूछें या माइक दबाकर बोलें..."
                          : "Ask Nexora or speak via mic..."
                      }
                      className="flex-1 bg-slate-950/60 border border-white/10 focus:border-cyan-500/60 focus:outline-none rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 transition-colors"
                      disabled={isLoading}
                    />

                    {/* Send Button */}
                    <Button
                      type="submit"
                      variant="glow"
                      size="sm"
                      disabled={!inputMessage.trim() || isLoading}
                      className="rounded-xl px-3"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </form>

                  {/* Status subtext */}
                  <div className="flex items-center justify-between px-1 mt-2 text-[10px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1 text-cyan-400/80">
                      <Mic className="h-3 w-3" /> Voice & Text Active ({speechLang === "en-IN" ? "English" : "हिन्दी Mode"})
                    </span>
                    <span>Skillora AI Copilot</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NexoraFloatingBot;
