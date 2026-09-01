"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Loader2,
  Bot,
  Paperclip,
  Trash2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoachMessageBubble } from "./coach-message-bubble";
import {
  CoachMessage,
  StudentCareerContext,
  INITIAL_COACH_CONVERSATION,
} from "@/lib/ai/career-coach-engine";

interface CoachChatWorkbenchProps {
  context: StudentCareerContext;
  externalTriggerPrompt?: string | null;
  onClearTriggerPrompt?: () => void;
}

export function CoachChatWorkbench({
  context,
  externalTriggerPrompt,
  onClearTriggerPrompt,
}: CoachChatWorkbenchProps) {
  const [messages, setMessages] = useState<CoachMessage[]>(INITIAL_COACH_CONVERSATION);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Speech Recognition (Voice Dictation)
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat feed to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  // Handle External Trigger Prompts (from Sidebar)
  useEffect(() => {
    if (externalTriggerPrompt && !isProcessing) {
      handleSendMessage(externalTriggerPrompt);
      onClearTriggerPrompt?.();
    }
  }, [externalTriggerPrompt]);

  // Voice Input Setup
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognitionRef.current.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsDictating(false);
      };

      recognitionRef.current.onend = () => {
        setIsDictating(false);
      };
    }
  }, []);

  const toggleDictation = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your question.");
      return;
    }

    if (isDictating) {
      recognitionRef.current.stop();
      setIsDictating(false);
    } else {
      setIsDictating(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isProcessing) return;

    if (isDictating && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsDictating(false);
    }

    const userMessage: CoachMessage = {
      id: `msg_user_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          context,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response from AI Career Coach");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      console.error("Coach chat error:", err);
      // Fallback message
      const fallbackMsg: CoachMessage = {
        id: `msg_err_${Date.now()}`,
        sender: "coach",
        text: `### ⚠️ Connection Interrupted\nI was unable to retrieve a response. Please try asking again.`,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetConversation = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setMessages(INITIAL_COACH_CONVERSATION);
    setInputText("");
  };

  return (
    <GlassCard className="p-4 sm:p-6 border-cyan-500/30 bg-slate-950/80 min-h-[620px] flex flex-col justify-between overflow-hidden shadow-2xl relative" glow>
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground font-mono">
              AI Career Coach Workbench
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">
              Grounded in {context.skills.verified.length} skills, 4 projects & ATS telemetry
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetConversation}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            className="text-xs font-mono"
            title="Reset Chat Session"
          >
            Clear History
          </Button>
        </div>
      </div>

      {/* Messages Stream */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-white/10 max-h-[500px]"
      >
        {messages.map((msg) => (
          <CoachMessageBubble
            key={msg.id}
            message={msg}
            onSelectFollowUp={(prompt) => handleSendMessage(prompt)}
          />
        ))}

        {isProcessing && (
          <div className="flex items-center gap-3 text-xs font-mono text-cyan-400 py-3 pl-12">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Cross-referencing profile telemetry, skill gaps & ATS rubric...</span>
          </div>
        )}
      </div>

      {/* Chat Input Workbench */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything about your readiness, skill gaps, interview answers, ATS resume, or application timing..."
              className="w-full rounded-2xl border border-white/10 bg-black/60 p-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-cyan-500 outline-none font-mono resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Voice Dictation Button */}
            <Button
              type="button"
              variant={isDictating ? "glow" : "glass"}
              size="sm"
              onClick={toggleDictation}
              leftIcon={
                isDictating ? (
                  <Mic className="h-3.5 w-3.5 animate-pulse text-rose-400" />
                ) : (
                  <Mic className="h-3.5 w-3.5" />
                )
              }
              className="text-xs font-mono"
            >
              {isDictating ? "Listening... (Click to Stop)" : "Voice Dictate"}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
                Press Enter to Send
              </span>
              <Button
                type="submit"
                variant="glow"
                size="sm"
                disabled={!inputText.trim() || isProcessing}
                rightIcon={<Send className="h-3.5 w-3.5" />}
                className="font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] px-6"
              >
                Ask Coach →
              </Button>
            </div>
          </div>
        </form>
      </div>
    </GlassCard>
  );
}
