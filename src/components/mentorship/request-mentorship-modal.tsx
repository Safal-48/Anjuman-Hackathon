"use client";

import React, { useState } from "react";
import { X, Send, Sparkles, Calendar, Clock, UserCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MentorProfileEntity } from "@/lib/supabase/types";

interface RequestMentorshipModalProps {
  mentor: MentorProfileEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (data: {
    mentorId: string;
    topic: string;
    goalDescription: string;
    preferredSlot: string;
  }) => Promise<void>;
}

export function RequestMentorshipModal({
  mentor,
  isOpen,
  onClose,
  onSubmitRequest,
}: RequestMentorshipModalProps) {
  const [topic, setTopic] = useState("Architecture Review & ML Systems Career Path");
  const [goalDescription, setGoalDescription] = useState(
    "I would love guidance on optimizing transformer inference kernels and structuring high-impact portfolio projects for tier-1 AI lab roles."
  );
  const [preferredSlot, setPreferredSlot] = useState(
    mentor?.availableSlots[0] || "Wed 6:00 PM IST"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !mentor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmitRequest({
      mentorId: mentor.userId,
      topic,
      goalDescription,
      preferredSlot,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-lg p-6 sm:p-8 space-y-6 border-violet-500/40 shadow-2xl relative" glow>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center shadow-glow-sm">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Request 1-on-1 Mentorship</h3>
              <p className="text-xs text-muted-foreground">
                With {mentor.mentorName} • {mentor.currentTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Mentorship Topic / Focus Area
            </label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. System Design, Resume Teardown, Thesis Advice"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Preferred Available Slot
            </label>
            <select
              value={preferredSlot}
              onChange={(e) => setPreferredSlot(e.target.value)}
              className="w-full h-10 rounded-xl border border-white/10 bg-slate-900 px-3 text-xs text-foreground font-semibold focus:ring-1 focus:ring-violet-500 outline-none"
            >
              {mentor.availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
              <option value="Flexible / Asynchronous">Flexible / Coordinate via Chat</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase font-mono">
              Session Goals & Discussion Agenda
            </label>
            <textarea
              rows={4}
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              placeholder="Explain your background context, specific questions, and what you hope to achieve..."
              className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-violet-500 outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="glow"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Send className="h-4 w-4" />}
            >
              Send Mentorship Request
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
