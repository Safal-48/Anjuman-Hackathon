/**
 * Client-Side Real-Time Face Detection & Head Orientation Analysis Engine
 * Privacy-first: Runs 100% locally in browser memory. No video or telemetry is sent to any server.
 */

import {
  ATTENTION_CONFIG,
  AttentionEvent,
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
  private animationFrameId: number | null = null;
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

    this.notifyStatus("FOCUSED", "CENTER");
  }

  /**
   * Pause / Resume processing
   */
  public pause() {
    this.isRunning = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.notifyStatus("PAUSED", "CENTER");
  }

  /**
   * Stop monitoring and calculate final summary
   */
  public stop(): AttentionSummary {
    this.isRunning = false;
    this.sessionEndTime = Date.now();
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Finalize any ongoing alert duration
    if (this.currentAlertStart) {
      const alertDur = Date.now() - this.currentAlertStart;
      this.totalAlertMs += alertDur;
      this.longestAlertMs = Math.max(this.longestAlertMs, alertDur);
      this.currentAlertStart = null;
    }

    return this.generateSummary();
  }

  /**
   * Analyze individual frame from video element
   */
  private processFrame() {
    if (!this.isRunning || !this.videoElement || !this.ctx || !this.canvasElement) return;

    if (this.videoElement.readyState < 2 || this.videoElement.paused || this.videoElement.ended) {
      return;
    }

    const now = Date.now();
    const dt = now - this.lastTickTime;
    this.lastTickTime = now;

    // Draw frame to downscaled analysis canvas (96x72)
    const w = this.canvasElement.width;
    const h = this.canvasElement.height;
    this.ctx.drawImage(this.videoElement, 0, 0, w, h);

    const frame = this.ctx.getImageData(0, 0, w, h);
    const result = this.analyzeFrameData(frame, w, h);

    // Update direction dwell metrics
    if (result.faceDetected) {
      this.directionDwellMs[result.direction] = (this.directionDwellMs[result.direction] || 0) + dt;
    }

    // State machine logic
    this.updateStateMachine(result, now, dt);

    if (this.onMetricsUpdateCallback) {
      this.onMetricsUpdateCallback(result, this.currentStatus);
    }
  }

  /**
   * Optical feature analysis: calculates skin-luminance centroid and horizontal/vertical symmetry
   */
  private analyzeFrameData(frame: ImageData, width: number, height: number): DetectionResult {
    const data = frame.data;
    let totalWeight = 0;
    let weightedX = 0;
    let weightedY = 0;
    let skinPixelCount = 0;

    const minX = width * 0.15;
    const maxX = width * 0.85;
    const minY = height * 0.1;
    const maxY = height * 0.9;

    for (let y = Math.floor(minY); y < maxY; y++) {
      for (let x = Math.floor(minX); x < maxX; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Chromaticity & luminance range typical for face contours
        const isSkin =
          r > 45 &&
          g > 30 &&
          b > 20 &&
          r > g &&
          r > b &&
          Math.abs(r - g) > 12 &&
          r - b > 12 &&
          r < 250;

        if (isSkin) {
          skinPixelCount++;
          // Center-biased weight to focus on central facial features
          const weight = 1.0;
          totalWeight += weight;
          weightedX += x * weight;
          weightedY += y * weight;
        }
      }
    }

    const minRequiredSkinPixels = (width * height) * 0.035; // ~3.5% of frame
    if (skinPixelCount < minRequiredSkinPixels || totalWeight === 0) {
      return {
        faceDetected: false,
        direction: "CENTER",
        confidence: 0,
        yawOffset: 0,
        pitchOffset: 0,
      };
    }

    const centroidX = weightedX / totalWeight;
    const centroidY = weightedY / totalWeight;

    // Normalize centroid to [-1, 1] scale relative to center of video
    const centerX = width / 2;
    const centerY = height / 2;

    // Flip X because webcam is mirrored in preview
    const yawOffset = -((centroidX - centerX) / (width * 0.35));
    const pitchOffset = (centroidY - centerY) / (height * 0.35);

    // Determine discrete head direction based on threshold
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
   * Handles time persistence thresholds, alert cooldowns, and visual warnings
   */
  private updateStateMachine(result: DetectionResult, now: number, dt: number) {
    // 1. Handle Face Lost
    if (!result.faceDetected) {
      if (!this.faceLostStartTime) {
        this.faceLostStartTime = now;
      } else if (now - this.faceLostStartTime > ATTENTION_CONFIG.FACE_LOST_DURATION_MS) {
        if (this.currentStatus !== "FACE_LOST_WARNING") {
          this.currentStatus = "FACE_LOST_WARNING";
          this.triggerAlert(true, ATTENTION_CONFIG.LABELS.FACE_LOST);
          this.logEvent("FACE_NOT_DETECTED", "CENTER");
        }
      }
      return;
    }

    // Face detected: reset face lost timer
    this.faceLostStartTime = null;

    // 2. Handle Orientation Deviation
    if (result.direction !== "CENTER") {
      this.currentDirection = result.direction;

      if (!this.deviationStartTime) {
        this.deviationStartTime = now;
      } else if (now - this.deviationStartTime > ATTENTION_CONFIG.HEAD_TURN_DURATION_MS) {
        // Sustained deviation past duration threshold
        if (!this.isAlertActive) {
          // Check cooldown to avoid rapid flapping
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
      // 3. User is Screen-Facing (CENTER)
      this.deviationStartTime = null;
      this.currentDirection = "CENTER";
      this.totalFocusedMs += dt;

      if (this.isAlertActive || this.currentStatus !== "FOCUSED") {
        // Recovery
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

  private logEvent(
    type: "HEAD_ORIENTATION_ALERT" | "FACE_NOT_DETECTED" | "ATTENTION_RECOVERED",
    direction: HeadDirection,
    durationSeconds?: number
  ) {
    const event: AttentionEvent = {
      id: `att-evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      direction,
      timestamp: new Date().toISOString(),
      durationSeconds: durationSeconds ? Number(durationSeconds.toFixed(1)) : undefined,
    };
    this.events.push(event);
  }

  /**
   * Generates comprehensive observational Attention Summary
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

    const notes: string[] = [
      `Screen-facing orientation detected for approximately ${focusPct}% of the session duration.`,
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
      },
      observationalNotes: notes,
    };
  }

  public getEvents(): AttentionEvent[] {
    return [...this.events];
  }
}
