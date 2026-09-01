/**
 * Centralized Configuration for AI Attention & Interview Presence System
 * All timing, angle thresholds, and tolerance values are defined here.
 */

export type HeadDirection = "CENTER" | "LEFT" | "RIGHT" | "UP" | "DOWN";

export type AttentionStatus =
  | "INITIALIZING"
  | "FOCUSED"
  | "DEVIATION_WARNING"
  | "FACE_LOST_WARNING"
  | "UNAVAILABLE"
  | "PAUSED";

export interface AttentionEvent {
  id: string;
  type: "HEAD_ORIENTATION_ALERT" | "FACE_NOT_DETECTED" | "ATTENTION_RECOVERED";
  direction: HeadDirection;
  timestamp: string; // ISO string
  durationSeconds?: number;
}

export interface AttentionSummary {
  isAvailable: boolean;
  totalSessionDurationSeconds: number;
  focusedDurationSeconds: number;
  focusPercentage: number; // e.g. 92%
  attentionAlertsCount: number;
  totalAlertDurationSeconds: number;
  longestAlertSeconds: number;
  directionBreakdown: {
    centerSeconds: number;
    leftSeconds: number;
    rightSeconds: number;
    upSeconds: number;
    downSeconds: number;
  };
  observationalNotes: string[];
}

export const ATTENTION_CONFIG = {
  // Angle & Landmark displacement thresholds (normalized 0..1 scale)
  HEAD_YAW_THRESHOLD: 0.18, // Horizontal offset from nose centroid to eye midpoint
  HEAD_PITCH_THRESHOLD: 0.15, // Vertical offset from eye baseline to mouth baseline

  // Durations in milliseconds
  HEAD_TURN_DURATION_MS: 1800, // Duration deviation must persist before visual alert triggers (1.8s)
  FACE_LOST_DURATION_MS: 2200, // Grace period before "Please ensure face is visible" (2.2s)
  ALERT_COOLDOWN_MS: 1200, // Cooldown after recovery before another alert can trigger to prevent flickering (1.2s)

  // Sampling rate for camera video frame processing
  FRAME_SAMPLING_INTERVAL_MS: 100, // ~10 frames per second (ultra-low CPU/GPU impact)

  // UI status labels
  LABELS: {
    FOCUSED: "Attention: Focused",
    LOOK_AT_SCREEN: "Please look towards the screen",
    FACE_LOST: "Please make sure your face is visible",
    UNAVAILABLE: "Attention Monitoring Unavailable",
    INITIALIZING: "Initializing presence monitor...",
  },

  // Audio configuration
  AUDIO: {
    CHIME_FREQUENCY_PRIMARY: 587.33, // D5 note (gentle and modern)
    CHIME_FREQUENCY_SECONDARY: 880.0, // A5 harmonic
    CHIME_DURATION_SECONDS: 0.15,
    DEFAULT_ENABLED: true,
  },
} as const;
