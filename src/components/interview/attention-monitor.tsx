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
  onAlertChange?: (isAlert: boolean, message: string) => void;
  onSummaryReady?: (summary: AttentionSummary) => void;
  onStatusChange?: (status: AttentionStatus) => void;
  isSessionActive?: boolean;
  className?: string;
  compact?: boolean;
}

export function AttentionMonitor({
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

  const [permissionState, setPermissionState] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle");
  const [status, setStatus] = useState<AttentionStatus>("INITIALIZING");
  const [direction, setDirection] = useState<HeadDirection>("CENTER");
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [confidence, setConfidence] = useState<number>(0);

  // Initialize camera and engine
  const startCamera = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermissionState("denied");
      setStatus("UNAVAILABLE");
      return;
    }

    setPermissionState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setPermissionState("granted");

      // Initialize Attention Engine
      if (!engineRef.current) {
        engineRef.current = new AttentionEngine();
      }

      engineRef.current.setCallbacks({
        onStatusChange: (newStatus, newDir) => {
          setStatus(newStatus);
          setDirection(newDir);
          onStatusChange?.(newStatus);
        },
        onAlertTrigger: (alertActive, msg) => {
          setIsAlert(alertActive);
          setAlertMessage(msg);
          onAlertChange?.(alertActive, msg);
        },
        onMetricsUpdate: (result) => {
          setConfidence(result.confidence);
        },
      });

      if (videoRef.current) {
        engineRef.current.start(videoRef.current);
      }
    } catch (err: unknown) {
      console.warn("AttentionMonitor: Camera permission or device access denied:", err);
      setPermissionState("denied");
      setStatus("UNAVAILABLE");
      onStatusChange?.("UNAVAILABLE");
    }
  }, [onAlertChange, onStatusChange]);

  // Handle active session toggles
  useEffect(() => {
    startCamera();

    return () => {
      // Clean up camera stream and engine
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (engineRef.current) {
        const summary = engineRef.current.stop();
        onSummaryReady?.(summary);
      }
    };
  }, [startCamera, onSummaryReady]);

  // Ensure video element plays the live stream immediately upon granting
  useEffect(() => {
    if (permissionState === "granted" && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.muted = true;
      video.playsInline = true;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.warn("Video auto-play handled:", e);
        });
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
    if (permissionState === "denied" || permissionState === "error") {
      return (
        <Badge variant="outline" size="sm" className="font-mono text-[10px] bg-slate-900/90 text-slate-400 border-slate-700">
          <CameraOff className="h-3 w-3 mr-1" />
          Camera Unavailable
        </Badge>
      );
    }

    if (permissionState === "requesting" || status === "INITIALIZING") {
      return (
        <Badge variant="outline" size="sm" className="font-mono text-[10px] bg-cyan-950/80 text-cyan-300 border-cyan-500/40 animate-pulse">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Initializing...
        </Badge>
      );
    }

    if (isAlert || status === "DEVIATION_WARNING") {
      return (
        <Badge variant="destructive" size="sm" className="font-mono text-[10px] animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.4)]">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {ATTENTION_CONFIG.LABELS.LOOK_AT_SCREEN}
        </Badge>
      );
    }

    if (status === "FACE_LOST_WARNING") {
      return (
        <Badge variant="amber" size="sm" className="font-mono text-[10px] animate-pulse">
          <Eye className="h-3 w-3 mr-1" />
          {ATTENTION_CONFIG.LABELS.FACE_LOST}
        </Badge>
      );
    }

    return (
      <Badge variant="emerald" size="sm" className="font-mono text-[10px] shadow-[0_0_10px_rgba(16,185,129,0.3)]">
        <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-400" />
        {ATTENTION_CONFIG.LABELS.FOCUSED}
      </Badge>
    );
  };

  // If permission denied / unavailable fallback state
  if (permissionState === "denied" || permissionState === "error") {
    return (
      <div className={`p-3 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-md text-xs text-muted-foreground space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
            <CameraOff className="h-3.5 w-3.5 text-slate-400" />
            <span>Presence Monitor</span>
          </div>
          <Badge variant="outline" size="sm" className="font-mono text-[9px] text-slate-400 border-slate-700">
            OFFLINE
          </Badge>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Camera access was not granted. Attention monitoring is marked <strong>Unavailable</strong>. Interview continues normally.
        </p>
        <Button
          variant="glass"
          size="sm"
          className="w-full text-[11px] font-mono h-7"
          onClick={startCamera}
        >
          <RefreshCw className="h-3 w-3 mr-1.5" />
          Retry Camera Access
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-xl border ${
        isAlert
          ? "border-rose-500/60 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
          : "border-white/10 bg-slate-950/80 shadow-2xl"
      } ${className}`}
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.08] bg-slate-900/60">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1">
            <Eye className="h-3 w-3 text-cyan-400" />
            Attention Monitor
          </span>
        </div>

        <div className="flex items-center gap-1">
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
        <div className="relative aspect-[4/3] bg-black/80 overflow-hidden flex items-center justify-center">
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
