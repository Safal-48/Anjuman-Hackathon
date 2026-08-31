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
  onresult: ((event: { results: { 0: { transcript: string } }[] }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export function NexoraFloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "👋 Namaste! I am **Nexora.ai**, your AI Career & Skill Intelligence Assistant for **KaushalSetu**.\n\n🎙️ **Voice Command & Text Enabled!** Speak via mic or type your questions about:\n- 🎯 **Skill-Gap Diagnostics & Assessment**\n- 🗺️ **Personalized Career Roadmaps** (Full Stack, AI/ML, Cloud)\n- ⚡ **Explainable AI Opportunity Matching**\n- 🏛️ **College & Recruiter Features**",
      timestamp: "Just now",
      citations: ["KaushalSetu Core Architecture • SIH PS #26044"],
      suggestedPrompts: [
        "How does KaushalSetu work?",
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
  const [speechLang, setSpeechLang] = useState<"en-IN" | "hi-IN">("en-IN");
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

  // Text-To-Speech Output
  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !ttsEnabled) return;
    try {
      window.speechSynthesis?.cancel();
      const cleanText = text.replace(/[*#_`[\]]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = speechLang === "hi-IN" ? "hi-IN" : "en-IN";

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis?.speak(utterance);
    } catch (e) {
      console.warn("TTS not available:", e);
    }
  }, [ttsEnabled, speechLang]);

  const handleSendMessage = useCallback(async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

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
        body: JSON.stringify({ message: textToSend }),
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
        text: "⚠️ Sorry, I encountered a temporary connection issue. Please try asking again!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, isListening, ttsEnabled, speakText]);

  // Global event listener to open Nexora from anywhere (e.g. "Launch AI Copilot" button)
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

  // Initialize Web Speech Recognition (Speech-to-Text)
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
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setInputMessage(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [speechLang]);

  // Toggle Voice Input
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = speechLang;
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Speech recognition start error:", err);
      }
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleClearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        text: "✨ Conversation cleared! How can I assist you with your career or skill journey today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedPrompts: [
          "How does KaushalSetu work?",
          "Generate 3-month AI Roadmap",
          "What is Explainable Matching?",
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Launcher */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-glow-md backdrop-blur-md cursor-pointer hover:border-cyan-400 transition-all"
            onClick={() => setIsOpen(true)}
          >
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-semibold text-cyan-300">
              Ask Nexora.ai
            </span>
          </motion.div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Nexora.ai Copilot"
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-violet-600 p-[1.5px] shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/95 backdrop-blur-sm group-hover:bg-slate-900/80 transition-colors">
              <Bot className="h-7 w-7 text-cyan-400 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
            </div>

            {/* Glowing Notification Dot */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-950" />
            </span>
          </button>
        </motion.div>
      )}

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "64px" : "600px",
            }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[440px] max-w-[480px] bg-slate-950/95 border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col overflow-hidden transition-[height] duration-300`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30">
                  <Bot className="h-4 w-4 text-cyan-400" />
                  {isSpeaking && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-foreground leading-none">Nexora.ai</h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      RAG COGNITIVE
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    KaushalSetu Intelligence Assistant
                  </span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1">
                {/* Language Mode Toggle (EN / HI) */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-[10px] font-mono text-muted-foreground hover:text-cyan-300"
                  onClick={() => setSpeechLang((prev) => (prev === "en-IN" ? "hi-IN" : "en-IN"))}
                  title={`Speech Language: ${speechLang === "en-IN" ? "English" : "Hindi / Hinglish"}`}
                >
                  <Languages className="h-3 w-3 mr-1 text-cyan-400" />
                  {speechLang === "en-IN" ? "EN" : "HI"}
                </Button>

                {/* TTS Audio Voice Output Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 ${
                    ttsEnabled ? "text-cyan-400 hover:text-cyan-300" : "text-muted-foreground hover:text-white"
                  }`}
                  onClick={() => {
                    if (ttsEnabled && isSpeaking) {
                      stopSpeaking();
                    }
                    setTtsEnabled(!ttsEnabled);
                  }}
                  title={ttsEnabled ? "Voice Narration Enabled (Click to Mute)" : "Voice Narration Muted"}
                >
                  {ttsEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                </Button>

                {/* Clear Chat */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-rose-400"
                  onClick={handleClearChat}
                  title="Clear Chat History"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>

                {/* Minimize Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-white"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                </Button>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-white"
                  onClick={() => {
                    stopSpeaking();
                    if (isListening && recognitionRef.current) {
                      recognitionRef.current.stop();
                    }
                    setIsOpen(false);
                  }}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Body (Hidden when minimized) */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs cyber-scrollbar">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed relative group ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            : "bg-slate-900/90 border border-white/10 text-foreground/90 rounded-bl-none shadow-md"
                        }`}
                      >
                        {/* Copy & Replay TTS Button */}
                        {msg.sender === "assistant" && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => speakText(msg.text)}
                              className="p-1 rounded bg-black/50 text-muted-foreground hover:text-cyan-400"
                              title="Listen to Voice"
                            >
                              <Volume2 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="p-1 rounded bg-black/50 text-muted-foreground hover:text-white"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Formatted Markdown Content */}
                        <div className="space-y-1.5 whitespace-pre-wrap font-sans">
                          {msg.text.split("\n").map((line, idx) => {
                            if (line.startsWith("### ")) {
                              return (
                                <div key={idx} className="font-bold text-cyan-400 text-sm pt-1 pb-0.5">
                                  {line.replace("### ", "")}
                                </div>
                              );
                            }
                            if (line.startsWith("#### ")) {
                              return (
                                <div key={idx} className="font-semibold text-violet-300 pt-0.5">
                                  {line.replace("#### ", "")}
                                </div>
                              );
                            }
                            if (line.startsWith("- ")) {
                              return (
                                <div key={idx} className="flex items-start gap-1.5 pl-1 text-[11.5px]">
                                  <span className="text-cyan-400 mt-0.5">•</span>
                                  <span>{line.replace("- ", "")}</span>
                                </div>
                              );
                            }
                            return <p key={idx} className="text-[11.5px]">{line}</p>;
                          })}
                        </div>

                        {/* RAG Source Citation Badge */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center gap-1.5 text-[9px] text-muted-foreground font-mono">
                            <Sparkles className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
                            <span className="truncate">Source: {msg.citations[0]}</span>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[9px] text-muted-foreground/60 px-1 mt-1 font-mono">
                        {msg.timestamp}
                      </span>

                      {/* Suggested Prompts Pills */}
                      {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                          {msg.suggestedPrompts.map((prompt, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => handleSendMessage(prompt)}
                              className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-colors text-left flex items-center gap-1 shadow-sm"
                            >
                              <span>⚡</span>
                              <span>{prompt}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Listening Indicator */}
                  {isListening && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 w-fit animate-pulse">
                      <Mic className="h-4 w-4 text-rose-400 animate-bounce" />
                      <span className="text-[11px] font-mono">
                        Listening in {speechLang === "en-IN" ? "English" : "Hindi"}... Speak your query
                      </span>
                    </div>
                  )}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-white/10 text-cyan-400 w-fit">
                      <Bot className="h-4 w-4 animate-spin" />
                      <span className="text-[11px] font-mono animate-pulse">
                        Nexora is searching knowledge base...
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar (Voice & Text) */}
                <div className="p-3 border-t border-white/[0.08] bg-slate-900/95 space-y-2">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    {/* Voice Microphone Command Button */}
                    <Button
                      type="button"
                      variant={isListening ? "destructive" : "glass"}
                      size="icon"
                      className={`h-9 w-9 shrink-0 rounded-xl transition-all ${
                        isListening
                          ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse"
                          : "border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20"
                      }`}
                      onClick={toggleListening}
                      title={isListening ? "Stop Listening" : "Voice Command (Speak Query)"}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={
                        isListening
                          ? "Listening... Speak now..."
                          : "Ask Nexora or speak via mic..."
                      }
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-cyan-500 transition-colors"
                      disabled={isLoading}
                    />

                    <Button
                      type="submit"
                      variant="glow"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                      disabled={!inputMessage.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>

                  <div className="flex items-center justify-between px-1 text-[9px] text-muted-foreground/60 font-mono">
                    <span className="flex items-center gap-1">
                      <Mic className="h-2.5 w-2.5 text-cyan-400" />
                      Voice & Text Ready
                    </span>
                    <span>Powered by KaushalSetu RAG</span>
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
