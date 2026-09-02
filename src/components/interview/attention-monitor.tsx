"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Minimize2,
  Maximize2,
  HelpCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ATTENTION_CONFIG,
  AttentionStatus,
  AttentionSummary,
  HeadDirection,
} from "@/lib/attention/attention-config";
import { AttentionEngine, DetectionResult } from "@/lib/attention/attention-engine";
import { audioAlert } from "@/lib/attention/audio-alert";

export interface AttentionMonitorProps {
  initialStream?: MediaStream | null;
  onAlertChange?: (isAlert: boolean, message: string) => void;
  onSummaryReady?: (summary: AttentionSummary) => void;
  onStatusChange?: (status: AttentionStatus) => void;
  isSessionActive?: boolean;
  className?: string;
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

  // Setup engine on an active video element
  const bindStreamToVideo = useCallback((stream: MediaStream) => {
    streamRef.current = stream;
    setPermissionState("granted");

    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    // Start engine as soon as video stream dimensions and metadata are ready
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
          width: { ideal: 320, min: 240 },
          height: { ideal: 240, min: 180 },
          facingMode: "user",
          frameRate: { ideal: 15, max: 20 },
        },
        audio: false,
      });

      if (!isMountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      bindStreamToVideo(stream);
    } catch (err: unknown) {
      console.warn(`AttentionMonitor: Camera init attempt ${retryCount + 1} failed:`, err);
      // If hardware lock was still busy from a previous track release, retry after 400ms
      if (retryCount < 2 && isMountedRef.current) {
        setTimeout(() => {
          if (isMountedRef.current) {
            startCamera(retryCount + 1);
          }
        }, 400 * (retryCount + 1));
      } else {
        setPermissionState("denied");
        setStatus("UNAVAILABLE");
        onStatusChange?.("UNAVAILABLE");
      }
    }
  }, [initialStream, bindStreamToVideo, onStatusChange]);

  // Handle mounting and unmounting
  useEffect(() => {
    isMountedRef.current = true;
    startCamera();

    return () => {
      isMountedRef.current = false;
      // Clean up local camera stream and engine
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (engineRef.current) {
        const summary = engineRef.current.stop();
        onSummaryReady?.(summary);
        engineRef.current = null;
      }
    };
  }, [startCamera, onSummaryReady]);

  // Ensure video element plays the live stream if stream becomes available later
  useEffect(() => {
    if (permissionState === "granted" && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      if (!video.srcObject) {
        video.srcObject = streamRef.current;
        video.play().catch(() => {});
      }
    }
  }, [permissionState]);

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioAlert.setEnabled(next);
  };

  // Render Status Badge Content
  const renderStatusBadge = () => {
    switch (status) {
      case "FOCUSED":
        return (
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>Attention: Focused</span>
          </div>
        );
      case "DEVIATION_WARNING":
        return (
          <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] font-bold animate-pulse">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>⚠ Attention Check</span>
          </div>
        );
      case "FACE_LOST_WARNING":
        return (
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold animate-pulse">
            <Eye className="h-3.5 w-3.5 shrink-0" />
            <span>Camera Centering Needed</span>
          </div>
        );
      case "UNAVAILABLE":
        return (
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
            <CameraOff className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span>Monitor Offline</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px]">
            <RefreshCw className="h-3 w-3 animate-spin shrink-0" />
            <span>Calibrating...</span>
          </div>
        );
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
        isAlert
          ? "border-rose-500/80 bg-rose-950/20 shadow-rose-900/30"
          : "border-cyan-500/30 bg-slate-950/90 shadow-cyan-950/20"
      } ${className}`}
    >
      {/* Top Header Controls */}
      <div className="px-3 py-2 bg-slate-900/95 border-b border-white/[0.08] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span
              className={`h-2 w-2 rounded-full ${
                status === "FOCUSED"
                  ? "bg-emerald-400 animate-ping opacity-75"
                  : isAlert
                  ? "bg-rose-500 animate-ping"
                  : "bg-cyan-400"
              }`}
            />
            <span
              className={`absolute h-2 w-2 rounded-full ${
                status === "FOCUSED"
                  ? "bg-emerald-400"
                  : isAlert
                  ? "bg-rose-500"
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
            <div className="border-r border-b border-cyan-500/20 bg-cyan-500/[0.02]" />
            <div className="border-b border-white/[0.03]" />
            <div className="border-r border-white/[0.03]" />
            <div className="border-r border-white/[0.03]" />
            <div />
          </div>

          {/* Direction Indicator Pill (Only shown during active sustained deviation) */}
          {isAlert && direction !== "CENTER" && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/40 text-[9px] font-mono text-rose-300 font-bold uppercase tracking-wider animate-pulse">
              {direction}
            </div>
          )}

          {/* Deviation Alert Overlay (Only shown after 5.0s continuous sustained deviation) */}
          {isAlert && (
            <div className="absolute inset-0 bg-rose-950/40 border-2 border-rose-500/60 flex items-center justify-center p-2 text-center animate-pulse">
              <div className="space-y-1">
                <AlertTriangle className="h-5 w-5 text-rose-400 mx-auto" />
                <p className="text-[10px] font-mono font-bold text-rose-200 uppercase tracking-tight">
                  Please Look Towards Screen
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
          <span className={`font-bold uppercase ${direction === "CENTER" ? "text-emerald-400" : isAlert ? "text-rose-400" : "text-emerald-400"}`}>
            {isAlert ? direction : "FOCUSED"}
          </span>
        </div>
      </div>
    </div>
  );
}
