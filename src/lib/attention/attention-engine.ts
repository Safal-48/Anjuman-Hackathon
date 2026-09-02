/**
 * Client-Side Real-Time Face Detection & Head Orientation Analysis Engine
 * Privacy-first: Runs 100% locally in browser memory. No video or telemetry is sent to any server.
 * Neutral Terminology: Labels events as "Attention Deviation" or "Focus Warning" (Never "Cheating").
 */

import {
  ATTENTION_CONFIG,
  AttentionEvent,
  AttentionSeverity,
  AttentionStatus,
  AttentionSummary,
  HeadDirection,
} from "./attention-config";
import { audioAlert } from "./audio-alert";

export interface DetectionResult {
  faceDetected: boolean;
  direction: HeadDirection;
  confidence: number;
  yawOffset: number; // -1 (far left) to +1 (far right)
  pitchOffset: number; // -1 (far up) to +1 (far down)
  box?: { x: number; y: number; width: number; height: number };
}

export class AttentionEngine {
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  // State machine tracking
  private currentStatus: AttentionStatus = "INITIALIZING";
  private currentDirection: HeadDirection = "CENTER";
  private isAlertActive: boolean = false;

  // Timers and timestamps
  private sessionStartTime: number = 0;
  private sessionEndTime: number = 0;
  private deviationStartTime: number | null = null;
  private faceLostStartTime: number | null = null;
  private lastAlertRecoveryTime: number = 0;

  // Metrics accumulation
  private events: AttentionEvent[] = [];
  private totalFocusedMs: number = 0;
  private totalAlertMs: number = 0;
  private longestAlertMs: number = 0;
  private currentAlertStart: number | null = null;
  private alertCount: number = 0;

  // Direction dwell time tracking (in milliseconds)
  private directionDwellMs: Record<HeadDirection, number> = {
    CENTER: 0,
    LEFT: 0,
    RIGHT: 0,
    UP: 0,
    DOWN: 0,
    FACE_NOT_VISIBLE: 0,
  };
  private lastTickTime: number = 0;

  // Callbacks
  private onStatusChangeCallback?: (status: AttentionStatus, direction: HeadDirection) => void;
  private onAlertTriggerCallback?: (isAlert: boolean, message: string) => void;
  private onMetricsUpdateCallback?: (result: DetectionResult, status: AttentionStatus) => void;

  constructor() {
    if (typeof window !== "undefined") {
      this.canvasElement = document.createElement("canvas");
      this.canvasElement.width = 96;
      this.canvasElement.height = 72;
      this.ctx = this.canvasElement.getContext("2d", { willReadFrequently: true });
    }
  }

  public setCallbacks(options: {
    onStatusChange?: (status: AttentionStatus, direction: HeadDirection) => void;
    onAlertTrigger?: (isAlert: boolean, message: string) => void;
    onMetricsUpdate?: (result: DetectionResult, status: AttentionStatus) => void;
  }) {
    this.onStatusChangeCallback = options.onStatusChange;
    this.onAlertTriggerCallback = options.onAlertTrigger;
    this.onMetricsUpdateCallback = options.onMetricsUpdate;
  }

  /**
   * Start analyzing the video stream
   */
  public start(video: HTMLVideoElement) {
    if (this.isRunning) return;
    this.videoElement = video;
    this.isRunning = true;
    this.sessionStartTime = Date.now();
    this.lastTickTime = Date.now();
    this.currentStatus = "FOCUSED";
    this.currentDirection = "CENTER";
    this.isAlertActive = false;

    this.intervalId = setInterval(() => {
      this.processFrame();
    }, ATTENTION_CONFIG.FRAME_SAMPLING_INTERVAL_MS);
  }

  /**
   * Stop processing and finalize session metrics
   */
  public stop(): AttentionSummary {
    this.isRunning = false;
    this.sessionEndTime = Date.now();

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.currentAlertStart) {
      const remainingAlertMs = Date.now() - this.currentAlertStart;
      this.totalAlertMs += remainingAlertMs;
      this.longestAlertMs = Math.max(this.longestAlertMs, remainingAlertMs);
      this.currentAlertStart = null;
    }

    return this.generateSummary();
  }

  /**
   * Core frame analysis routine
   */
  private processFrame() {
    if (!this.isRunning || !this.videoElement || !this.canvasElement || !this.ctx) return;
    if (this.videoElement.readyState < 2) return; // HAVE_CURRENT_DATA

    const now = Date.now();
    const dt = now - (this.lastTickTime || now);
    this.lastTickTime = now;

    // Fast sub-sampling capture
    const width = this.canvasElement.width;
    const height = this.canvasElement.height;

    try {
      this.ctx.drawImage(this.videoElement, 0, 0, width, height);
      const frameData = this.ctx.getImageData(0, 0, width, height);
      const result = this.analyzeFrameLocally(frameData.data, width, height);

      // Track dwell time
      if (!result.faceDetected) {
        this.directionDwellMs.FACE_NOT_VISIBLE = (this.directionDwellMs.FACE_NOT_VISIBLE || 0) + dt;
      } else {
        this.directionDwellMs[result.direction] = (this.directionDwellMs[result.direction] || 0) + dt;
      }

      this.updateStateMachine(result, now, dt);

      if (this.onMetricsUpdateCallback) {
        this.onMetricsUpdateCallback(result, this.currentStatus);
      }
    } catch {
      // Gracefully ignore canvas capture frames during DOM destruction
    }
  }

  /**
   * Privacy-preserving local pixel heuristic for face & yaw/pitch analysis
   */
  private analyzeFrameLocally(data: Uint8ClampedArray, width: number, height: number): DetectionResult {
    let skinPixelCount = 0;
    let sumX = 0;
    let sumY = 0;

    // Bounding box bounds
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Adaptive YCbCr skin tone threshold
        const yVal = 0.299 * r + 0.587 * g + 0.114 * b;
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

        const isSkin = cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173 && yVal > 40;

        if (isSkin) {
          skinPixelCount++;
          sumX += x;
          sumY += y;

          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const minRequiredPixels = (width * height * 0.02) / 4; // At least ~2% of frame
    if (skinPixelCount < minRequiredPixels) {
      return {
        faceDetected: false,
        direction: "FACE_NOT_VISIBLE",
        confidence: 0,
        yawOffset: 0,
        pitchOffset: 0,
      };
    }

    const centroidX = sumX / skinPixelCount;
    const centroidY = sumY / skinPixelCount;

    const frameCenterX = width / 2;
    const frameCenterY = height / 2;

    // Normalized offset from frame center (-1 to +1)
    const yawOffset = (centroidX - frameCenterX) / (width * 0.5);
    const pitchOffset = (centroidY - frameCenterY) / (height * 0.5);

    let direction: HeadDirection = "CENTER";
    const absYaw = Math.abs(yawOffset);
    const absPitch = Math.abs(pitchOffset);

    if (absYaw > ATTENTION_CONFIG.HEAD_YAW_THRESHOLD && absYaw >= absPitch) {
      direction = yawOffset > 0 ? "RIGHT" : "LEFT";
    } else if (absPitch > ATTENTION_CONFIG.HEAD_PITCH_THRESHOLD) {
      direction = pitchOffset > 0 ? "DOWN" : "UP";
    }

    return {
      faceDetected: true,
      direction,
      confidence: Math.min(1.0, skinPixelCount / (width * height * 0.15)),
      yawOffset: Number(yawOffset.toFixed(3)),
      pitchOffset: Number(pitchOffset.toFixed(3)),
      box: {
        x: centroidX - 20,
        y: centroidY - 20,
        width: 40,
        height: 40,
      },
    };
  }

  /**
   * Handles 3.0s grace period, alert cooldowns, and visual warnings
   */
  private updateStateMachine(result: DetectionResult, now: number, dt: number) {
    // 1. Handle Face Lost (with 3.0s grace period)
    if (!result.faceDetected) {
      if (!this.faceLostStartTime) {
        this.faceLostStartTime = now;
      } else if (now - this.faceLostStartTime > ATTENTION_CONFIG.FACE_LOST_DURATION_MS) {
        if (this.currentStatus !== "FACE_LOST_WARNING") {
          this.currentStatus = "FACE_LOST_WARNING";
          this.currentAlertStart = now;
          this.alertCount++;
          audioAlert.playSoftAttentionChime();
          this.triggerAlert(true, ATTENTION_CONFIG.LABELS.FACE_LOST);
          this.logEvent("FACE_NOT_DETECTED", "FACE_NOT_VISIBLE");
        }
      }
      return;
    }

    // Face detected: reset face lost timer
    this.faceLostStartTime = null;

    // 2. Handle Orientation Deviation (with 3.0s grace period for natural movements)
    if (result.direction !== "CENTER") {
      this.currentDirection = result.direction;

      if (!this.deviationStartTime) {
        this.deviationStartTime = now;
      } else if (now - this.deviationStartTime > ATTENTION_CONFIG.HEAD_TURN_DURATION_MS) {
        // Sustained deviation past 3.0s grace period
        if (!this.isAlertActive) {
          if (now - this.lastAlertRecoveryTime > ATTENTION_CONFIG.ALERT_COOLDOWN_MS) {
            this.isAlertActive = true;
            this.currentStatus = "DEVIATION_WARNING";
            this.currentAlertStart = now;
            this.alertCount++;
            audioAlert.playSoftAttentionChime();
            this.triggerAlert(true, ATTENTION_CONFIG.LABELS.LOOK_AT_SCREEN);
            this.logEvent("HEAD_ORIENTATION_ALERT", result.direction);
          }
        }
      }
    } else {
      // 3. User returned focus to screen (CENTER)
      this.deviationStartTime = null;
      this.currentDirection = "CENTER";
      this.totalFocusedMs += dt;

      if (this.isAlertActive || this.currentStatus !== "FOCUSED") {
        // Automatic recovery
        this.isAlertActive = false;
        this.currentStatus = "FOCUSED";
        this.lastAlertRecoveryTime = now;

        if (this.currentAlertStart) {
          const alertDuration = (now - this.currentAlertStart) / 1000;
          this.totalAlertMs += now - this.currentAlertStart;
          this.longestAlertMs = Math.max(this.longestAlertMs, now - this.currentAlertStart);
          this.logEvent("ATTENTION_RECOVERED", "CENTER", alertDuration);
          this.currentAlertStart = null;
        }

        this.triggerAlert(false, "");
        this.notifyStatus("FOCUSED", "CENTER");
      }
    }
  }

  private triggerAlert(isAlert: boolean, message: string) {
    if (this.onAlertTriggerCallback) {
      this.onAlertTriggerCallback(isAlert, message);
    }
    this.notifyStatus(this.currentStatus, this.currentDirection);
  }

  private notifyStatus(status: AttentionStatus, direction: HeadDirection) {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status, direction);
    }
  }

  private formatTimeMMSS(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  private getDirectionLabel(dir: HeadDirection): string {
    switch (dir) {
      case "LEFT": return "Left";
      case "RIGHT": return "Right";
      case "UP": return "Up";
      case "DOWN": return "Down";
      case "FACE_NOT_VISIBLE": return "Face Not Visible";
      default: return "Center";
    }
  }

  private calculateSeverity(durationSec: number): AttentionSeverity {
    if (durationSec < 3.5) return "Low";
    if (durationSec < 6.0) return "Medium";
    return "High";
  }

  private logEvent(
    type: "HEAD_ORIENTATION_ALERT" | "FACE_NOT_DETECTED" | "ATTENTION_RECOVERED",
    direction: HeadDirection,
    durationSeconds?: number
  ) {
    const elapsedMs = Math.max(0, Date.now() - (this.sessionStartTime || Date.now()));
    const duration = durationSeconds ?? 3.0;
    const severity = this.calculateSeverity(duration);

    const event: AttentionEvent = {
      id: `att-evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      direction,
      directionLabel: this.getDirectionLabel(direction),
      timestamp: new Date().toISOString(),
      formattedTime: this.formatTimeMMSS(elapsedMs),
      durationSeconds: Number(duration.toFixed(1)),
      severity,
      neutralNote: `Attention deviation towards ${this.getDirectionLabel(direction)} (${duration.toFixed(1)}s)`,
    };
    this.events.push(event);
  }

  /**
   * Generates comprehensive observational Attention Summary with Focus Consistency Status
   */
  public generateSummary(): AttentionSummary {
    const totalSessionMs = Math.max(
      1000,
      (this.sessionEndTime || Date.now()) - (this.sessionStartTime || Date.now())
    );

    const focusPct = Math.min(
      100,
      Math.max(0, Math.round((this.totalFocusedMs / totalSessionMs) * 100))
    );

    const focusStatus = focusPct >= 75 && this.alertCount <= 2 ? "CONSISTENT_GOOD" : "NEEDS_IMPROVEMENT";

    const notes: string[] = [
      `Screen-facing orientation maintained for approximately ${focusPct}% of the session duration.`,
      `Sustained attention notifications recorded: ${this.alertCount} time(s).`,
    ];

    if (this.alertCount === 0) {
      notes.push("Consistent camera engagement maintained throughout all answered questions.");
    } else {
      notes.push(
        `Longest continuous deviation from screen-facing angle was ${(this.longestAlertMs / 1000).toFixed(1)}s.`
      );
    }

    return {
      isAvailable: true,
      totalSessionDurationSeconds: Number((totalSessionMs / 1000).toFixed(1)),
      focusedDurationSeconds: Number((this.totalFocusedMs / 1000).toFixed(1)),
      focusPercentage: focusPct,
      attentionAlertsCount: this.alertCount,
      totalAlertDurationSeconds: Number((this.totalAlertMs / 1000).toFixed(1)),
      longestAlertSeconds: Number((this.longestAlertMs / 1000).toFixed(1)),
      directionBreakdown: {
        centerSeconds: Number(((this.directionDwellMs.CENTER || 0) / 1000).toFixed(1)),
        leftSeconds: Number(((this.directionDwellMs.LEFT || 0) / 1000).toFixed(1)),
        rightSeconds: Number(((this.directionDwellMs.RIGHT || 0) / 1000).toFixed(1)),
        upSeconds: Number(((this.directionDwellMs.UP || 0) / 1000).toFixed(1)),
        downSeconds: Number(((this.directionDwellMs.DOWN || 0) / 1000).toFixed(1)),
        faceNotVisibleSeconds: Number(((this.directionDwellMs.FACE_NOT_VISIBLE || 0) / 1000).toFixed(1)),
      },
      events: [...this.events],
      focusStatus,
      observationalNotes: notes,
    };
  }

  public getEvents(): AttentionEvent[] {
    return [...this.events];
  }
}
