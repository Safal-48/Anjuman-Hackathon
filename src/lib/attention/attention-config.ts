/**
 * Centralized Configuration for AI Attention & Interview Presence System
 * Privacy-First: Client-side detection only. Raw video is NEVER recorded or uploaded.
 * All timing, angle thresholds, neutral labels, and tolerance values are defined here.
 */

export type HeadDirection = "CENTER" | "LEFT" | "RIGHT" | "UP" | "DOWN" | "FACE_NOT_VISIBLE";

export type AttentionSeverity = "Low" | "Medium" | "High";

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
  directionLabel: string; // "Left" | "Right" | "Up" | "Down" | "Face Not Visible"
  timestamp: string; // ISO string or mm:ss
  formattedTime?: string; // e.g. "08:42"
  durationSeconds: number; // e.g. 4.2
  severity: AttentionSeverity; // "Low" | "Medium" | "High"
  neutralNote?: string;
}

export interface AttentionSummary {
  isAvailable: boolean;
  totalSessionDurationSeconds: number;
  focusedDurationSeconds: number;
  focusPercentage: number; // e.g. 88%
  attentionAlertsCount: number;
  totalAlertDurationSeconds: number;
  longestAlertSeconds: number;
  directionBreakdown: {
    centerSeconds: number;
    leftSeconds: number;
    rightSeconds: number;
    upSeconds: number;
    downSeconds: number;
    faceNotVisibleSeconds: number;
  };
  events: AttentionEvent[];
  focusStatus: "CONSISTENT_GOOD" | "NEEDS_IMPROVEMENT";
  observationalNotes: string[];
}

export const ATTENTION_CONFIG = {
  // Balanced Angle & Displacement thresholds (allows natural glances, triggers clearly on sustained turns)
  HEAD_YAW_THRESHOLD: 0.22, // Horizontal offset threshold for Left/Right detection
  HEAD_PITCH_THRESHOLD: 0.24, // Vertical offset threshold for Up/Down detection

  // Durations in milliseconds - 2.0s grace period before alert triggers
  HEAD_TURN_DURATION_MS: 2000, // 2.0s continuous sustained deviation before visual red warning & chime
  FACE_LOST_DURATION_MS: 2000, // 2.0s grace period before "Face Not Visible" warning
  ALERT_COOLDOWN_MS: 800, // Fast recovery when candidate returns focus to screen

  // Sampling rate for camera video frame processing (10 FPS for ultra-low CPU/GPU impact)
  FRAME_SAMPLING_INTERVAL_MS: 100,

  // Neutral UI status labels (No punitive / false cheating accusations)
  LABELS: {
    FOCUSED: "Attention: Focused",
    WARNING_TITLE: "⚠ Attention Check",
    LOOK_AT_SCREEN: "Please maintain your focus on the screen.",
    FACE_LOST: "Please make sure your face is visible within the camera frame.",
    UNAVAILABLE: "Attention Monitoring Unavailable",
    INITIALIZING: "Calibrating privacy-first presence monitor...",
  },

  // Audio configuration
  AUDIO: {
    CHIME_FREQUENCY_PRIMARY: 587.33, // D5 note (gentle and modern)
    CHIME_FREQUENCY_SECONDARY: 880.0, // A5 harmonic
    CHIME_DURATION_SECONDS: 0.15,
    DEFAULT_ENABLED: true,
  },
} as const;
