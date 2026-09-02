"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  CameraOff,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  HelpCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { AttentionEngine } from "@/lib/attention/attention-engine";
import { audioAlert } from "@/lib/attention/audio-alert";
import {
  AttentionStatus,
  HeadDirection,
  AttentionSummary,
  ATTENTION_CONFIG,
} from "@/lib/attention/attention-config";

interface AttentionMonitorProps {
  /** Optional pre-acquired live MediaStream from permission gate */
  initialStream?: MediaStream | null;
  /** Triggered when an alert state changes (true = deviation alert active) */
  onAlertChange?: (isAlert: boolean, message: string) => void;
  /** Triggered when attention session ends with the complete observational report */
  onSummaryReady?: (summary: AttentionSummary) => void;
  /** Triggered when attention status changes */
  onStatusChange?: (status: AttentionStatus) => void;
  /** Indicates whether the interview/assessment session is currently active */
  isSessionActive?: boolean;
  /** Optional CSS classes for custom placement */
  className?: string;
  /** Compact display mode for mobile or small split screens */
  compact?: boolean;
}

export function AttentionMonitor({
  initialStream,
  onAlertChange,
  onSummaryReady,
  onStatusChange,
  isSessionActive = true,
  className = "",
  compact = false,
}: AttentionMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const engineRef = useRef<AttentionEngine | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const [permissionState, setPermissionState] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle");
  const [status, setStatus] = useState<AttentionStatus>("INITIALIZING");
  const [direction, setDirection] = useState<HeadDirection>("CENTER");
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<number>(0);

  // Setup and attach engine to the active video element
  const bindStreamToVideo = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    setPermissionState("granted");

    const video = videoRef.current;
    if (!video) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    video.muted = true;
    video.playsInline = true;

    const startAnalysis = () => {
      video.play().catch((e) => console.warn("Video play handled:", e));

      if (!engineRef.current) {
        engineRef.current = new AttentionEngine();
      }

      engineRef.current.setCallbacks({
        onStatusChange: (newStatus, newDir) => {
          if (!isMountedRef.current) return;
          setStatus(newStatus);
          setDirection(newDir);
          onStatusChange?.(newStatus);
        },
        onAlertTrigger: (alertActive, msg) => {
          if (!isMountedRef.current) return;
          setIsAlert(alertActive);
          setAlertMessage(msg);
          onAlertChange?.(alertActive, msg);
        },
        onMetricsUpdate: (result) => {
          if (!isMountedRef.current) return;
          setConfidence(result.confidence);
          if (result.direction !== "CENTER") {
            setDirection(result.direction);
          } else {
            setDirection("CENTER");
          }
        },
      });

      engineRef.current.start(video);
      setStatus("FOCUSED");
      onStatusChange?.("FOCUSED");
    };

    if (video.readyState >= 2) {
      startAnalysis();
    } else {
      video.onloadeddata = startAnalysis;
      video.onloadedmetadata = startAnalysis;
    }
  }, [onAlertChange, onStatusChange]);

  // Initialize or re-acquire camera stream with automatic retry
  const startCamera = useCallback(async (retryCount: number = 0) => {
    if (!isMountedRef.current) return;

    // 1. If an initial active stream is passed from the permission gate, use it directly (0ms delay!)
    if (initialStream && initialStream.active && initialStream.getVideoTracks().length > 0) {
      bindStreamToVideo(initialStream);
      return;
    }

    // 2. Check if streamRef already holds an active stream
    if (streamRef.current && streamRef.current.active && streamRef.current.getVideoTracks().some(t => t.readyState === "live")) {
      bindStreamToVideo(streamRef.current);
      return;
    }

    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermissionState("denied");
      setStatus("UNAVAILABLE");
      return;
    }

    setPermissionState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
          frameRate: { ideal: 24, max: 30 },
        },
        audio: false,
      });

      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      bindStreamToVideo(stream);
    } catch (err: unknown) {
      console.warn("Attention camera acquisition attempt failed:", err);

      // Retry up to 3 times with backoff if camera is temporarily locked by DirectShow
      if (retryCount < 3 && isMountedRef.current) {
        setTimeout(() => {
          startCamera(retryCount + 1);
        }, 400 * (retryCount + 1));
        return;
      }

      setPermissionState("denied");
      setStatus("UNAVAILABLE");
    }
  }, [bindStreamToVideo, initialStream]);

  // Main lifecycle: start camera on mount, clean up on unmount
  useEffect(() => {
    isMountedRef.current = true;
    startCamera(0);

    return () => {
      isMountedRef.current = false;
      if (engineRef.current) {
        const summary = engineRef.current.stop();
        onSummaryReady?.(summary);
        engineRef.current = null;
      }
    };
  }, [startCamera, onSummaryReady]);

  // Ensure video element plays the live stream as soon as DOM video attaches
  useEffect(() => {
    if (streamRef.current && videoRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
        video.play().catch(() => {});
      }
    }
  }, [permissionState, initialStream]);

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioAlert.setEnabled(next);
  };

  // Render Status Badge Content
  const renderStatusBadge = () => {
    if (isAlert || status === "DEVIATION_WARNING") {
      return (
        <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] font-bold animate-pulse">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
          <span>⚠ Attention Check</span>
        </div>
      );
    }

    if (status === "FACE_LOST_WARNING" || direction === "FACE_NOT_VISIBLE") {
      return (
        <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold animate-pulse">
          <Eye className="h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span>Face Not Visible</span>
        </div>
      );
    }

    if (direction !== "CENTER") {
      return (
        <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-medium">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span>Glancing {direction}</span>
        </div>
      );
    }

    if (status === "FOCUSED") {
      return (
        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>Attention: Focused</span>
        </div>
      );
    }

    if (status === "UNAVAILABLE") {
      return (
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
          <CameraOff className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span>Monitor Offline</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px]">
        <RefreshCw className="h-3 w-3 animate-spin shrink-0" />
        <span>Calibrating...</span>
      </div>
    );
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
        isAlert
          ? "border-2 border-rose-500 bg-rose-950/30 shadow-[0_0_25px_rgba(244,63,94,0.6)] ring-2 ring-rose-500/50"
          : direction !== "CENTER" && status !== "INITIALIZING"
          ? "border-amber-500/50 bg-slate-950/90 shadow-amber-950/20"
          : "border-cyan-500/30 bg-slate-950/90 shadow-cyan-950/20"
      } ${className}`}
    >
      {/* Top Header Controls */}
      <div className="px-3 py-2 bg-slate-900/95 border-b border-white/[0.08] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span
              className={`h-2 w-2 rounded-full ${
                isAlert
                  ? "bg-rose-500 animate-ping"
                  : direction !== "CENTER"
                  ? "bg-amber-400 animate-pulse"
                  : status === "FOCUSED"
                  ? "bg-emerald-400 animate-ping opacity-75"
                  : "bg-cyan-400"
              }`}
            />
            <span
              className={`absolute h-2 w-2 rounded-full ${
                isAlert
                  ? "bg-rose-500"
                  : direction !== "CENTER"
                  ? "bg-amber-400"
                  : status === "FOCUSED"
                  ? "bg-emerald-400"
                  : "bg-cyan-400"
              }`}
            />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-200 uppercase">
            Attention Monitor
          </span>
        </div>

        <div className="flex items-center gap-1">
          {permissionState === "denied" && (
            <button
              type="button"
              onClick={() => startCamera(0)}
              title="Retry Camera"
              className="p-1 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors text-[10px] font-mono flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleSound}
            title={soundEnabled ? "Mute Attention Chime" : "Unmute Attention Chime"}
            className="p-1 rounded-lg text-slate-400 hover:text-foreground hover:bg-white/10 transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-cyan-400" /> : <VolumeX className="h-3.5 w-3.5 text-slate-500" />}
          </button>

          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            title="Privacy & Monitoring Info"
            className="p-1 rounded-lg text-slate-400 hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expand Preview" : "Minimize Preview"}
            className="p-1 rounded-lg text-slate-400 hover:text-foreground hover:bg-white/10 transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Info Privacy Tooltip Modal */}
      {showInfo && (
        <div className="p-3 bg-slate-900/95 border-b border-white/10 text-[10px] font-mono text-slate-300 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1 text-cyan-400 font-bold">
            <Sparkles className="h-3 w-3" />
            <span>Privacy & Observational Protocol</span>
          </div>
          <p>
            • Analyzes approximate head orientation locally on your browser.
          </p>
          <p>
            • <strong>Zero video recording or external transmission.</strong>
          </p>
          <p>
            • Observational presence telemetry only — does NOT assess veracity or reduce technical interview scores.
          </p>
        </div>
      )}

      {/* Video & Tracking Canvas Area */}
      {!isMinimized && (
        <div className="relative aspect-[4/3] bg-black/90 overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {/* Orientation Overlay Grid Lines */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 grid grid-cols-3 grid-rows-3">
            <div className="border-r border-b border-white/[0.03]" />
            <div className="border-r border-b border-white/[0.03]" />
            <div className="border-b border-white/[0.03]" />
            <div className="border-r border-b border-white/[0.03]" />
            <div className={`border-r border-b transition-colors ${isAlert ? "border-rose-500/40 bg-rose-500/[0.05]" : "border-cyan-500/20 bg-cyan-500/[0.02]"}`} />
            <div className="border-b border-white/[0.03]" />
            <div className="border-r border-white/[0.03]" />
            <div className="border-r border-white/[0.03]" />
            <div />
          </div>

          {/* Real-Time Direction Badge Pill */}
          {direction !== "CENTER" && (
            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider ${
              isAlert
                ? "bg-rose-950/90 border border-rose-500 text-rose-300 animate-pulse shadow-lg"
                : "bg-amber-950/80 border border-amber-500/50 text-amber-300"
            }`}>
              {direction}
            </div>
          )}

          {/* Deviation Alert Overlay (Shows bright warning & red flashing banner when looking away) */}
          {isAlert && (
            <div className="absolute inset-0 bg-rose-950/50 border-2 border-rose-500 flex items-center justify-center p-2 text-center animate-pulse">
              <div className="space-y-1.5 p-2 rounded-xl bg-slate-950/80 border border-rose-500/80 shadow-2xl backdrop-blur-md">
                <AlertTriangle className="h-6 w-6 text-rose-400 mx-auto animate-bounce" />
                <p className="text-[11px] font-mono font-bold text-rose-200 uppercase tracking-tight">
                  Please Look Towards Screen
                </p>
                <p className="text-[9px] font-mono text-rose-300/80">
                  Focus detected away from camera
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Status Ribbon */}
      <div className="p-2.5 bg-slate-900/90 flex items-center justify-between gap-2 border-t border-white/[0.08]">
        <div className="flex-1 truncate">{renderStatusBadge()}</div>

        <div className="text-[9px] font-mono text-muted-foreground flex items-center gap-1 shrink-0">
          <span>Status:</span>
          <span className={`font-bold uppercase ${
            isAlert
              ? "text-rose-400 font-extrabold"
              : direction !== "CENTER"
              ? "text-amber-400"
              : "text-emerald-400"
          }`}>
            {isAlert ? "DEVIATION ALERT" : direction !== "CENTER" ? direction : "FOCUSED"}
          </span>
        </div>
      </div>
    </div>
  );
}
