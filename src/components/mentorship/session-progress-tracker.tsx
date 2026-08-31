"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  Star,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MentorshipSessionEntity, MentorshipStatus } from "@/lib/supabase/types";

interface SessionProgressTrackerProps {
  sessions: MentorshipSessionEntity[];
  onFeedbackSubmit: (sessionId: string, rating: number, comment: string) => Promise<void>;
  onStatusUpdate?: (sessionId: string, status: MentorshipStatus) => Promise<void>;
  isMentor?: boolean;
}

export function SessionProgressTracker({
  sessions,
  onFeedbackSubmit,
  onStatusUpdate,
  isMentor = false,
}: SessionProgressTrackerProps) {
  const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState<MentorshipSessionEntity | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState(
    "Super valuable session! Provided concrete architectural patterns for low-latency transformer inference."
  );
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const statusConfig: Record<
    MentorshipStatus,
    { label: string; variant: "cyber" | "violet" | "emerald" | "amber" | "destructive" }
  > = {
    pending: { label: "Request Pending", variant: "amber" },
    accepted: { label: "Accepted", variant: "cyber" },
    scheduled: { label: "Session Scheduled", variant: "violet" },
    in_progress: { label: "In Progress", variant: "cyber" },
    completed: { label: "Completed", variant: "emerald" },
    rejected: { label: "Declined", variant: "destructive" },
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionForFeedback) return;
    setIsSubmittingFeedback(true);
    await onFeedbackSubmit(selectedSessionForFeedback.id, rating, comment);
    setIsSubmittingFeedback(false);
    setSelectedSessionForFeedback(null);
  };

  if (sessions.length === 0) {
    return (
      <GlassCard className="p-8 text-center space-y-2 border-white/10" glow>
        <Calendar className="h-8 w-8 text-muted-foreground mx-auto" />
        <h4 className="font-bold text-sm text-foreground">No active mentorship sessions</h4>
        <p className="text-xs text-muted-foreground">Request a 1-on-1 session with a verified mentor below.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((sess) => {
        const config = statusConfig[sess.status] || statusConfig.pending;

        return (
          <GlassCard key={sess.id} className="p-5 sm:p-6 space-y-4 border-white/10" glow>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={config.variant} size="sm">
                    {config.label.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    {sess.mentorName || "Dr. Arvind Subramaniam"}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ({sess.mentorCompany || "Titan AI Labs"})
                  </span>
                </div>
                <h4 className="font-bold text-sm text-cyan-300">{sess.topic}</h4>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {sess.meetingLink && sess.status === "scheduled" && (
                  <a href={sess.meetingLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="glow" size="sm" leftIcon={<Video className="h-3.5 w-3.5" />}>
                      Join Session Room
                    </Button>
                  </a>
                )}

                {sess.status === "scheduled" && !isMentor && (
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => setSelectedSessionForFeedback(sess)}
                    leftIcon={<Star className="h-3.5 w-3.5 text-amber-400" />}
                  >
                    Leave Feedback
                  </Button>
                )}

                {isMentor && onStatusUpdate && sess.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      variant="glow"
                      size="sm"
                      onClick={() => onStatusUpdate(sess.id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStatusUpdate(sess.id, "rejected")}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Goal & Description */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Session Focus & Discussion Agenda
              </span>
              <p className="text-muted-foreground leading-relaxed">{sess.goalDescription}</p>

              {sess.mentorNotes && (
                <div className="pt-2 border-t border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    Mentor Preparation Notes:
                  </span>
                  <p className="text-foreground/90 italic">{sess.mentorNotes}</p>
                </div>
              )}
            </div>

            {/* Milestones Checklist */}
            {sess.milestones.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                  Progress Milestones:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sess.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-[11px] flex items-center gap-2 ${
                        m.completed
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-black/30 border-white/5 text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2
                        className={`h-3.5 w-3.5 ${m.completed ? "text-emerald-400" : "opacity-40"}`}
                      />
                      <span className="truncate">{m.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Review (if completed) */}
            {sess.feedbackRating && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-start gap-2">
                <div className="flex items-center text-amber-400 font-bold font-mono">
                  <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                  <span>{sess.feedbackRating}.0 / 5.0</span>
                </div>
                <p className="text-amber-200 italic">{sess.feedbackComment}</p>
              </div>
            )}
          </GlassCard>
        );
      })}

      {/* Feedback Modal */}
      {selectedSessionForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <GlassCard className="w-full max-w-md p-6 space-y-4 border-amber-500/40 shadow-2xl relative" glow>
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                <h3 className="font-bold text-base text-foreground">Session Feedback & Rating</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSessionForFeedback(null)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFeedback} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground uppercase font-mono">Session Rating (1 to 5 Stars)</label>
                <div className="flex gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl border text-sm font-bold flex items-center gap-1 transition-all ${
                        rating >= star
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                          : "bg-black/30 border-white/10 text-muted-foreground"
                      }`}
                    >
                      <Star className={`h-4 w-4 ${rating >= star ? "fill-amber-400 text-amber-400" : ""}`} />
                      <span>{star}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground uppercase font-mono">Key Takeaways & Feedback</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/90 p-2.5 text-xs text-foreground focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedSessionForFeedback(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="glow" size="sm" isLoading={isSubmittingFeedback}>
                  Submit Feedback
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
