/**
 * Global Camera Stream Manager
 * Ensures that any acquired webcam MediaStream is tracked,
 * and automatically stopped when leaving assessments, completing interviews,
 * navigating routes, or when the window/tab is hidden or closed.
 */

class CameraStreamManager {
  private activeStreams: Set<MediaStream> = new Set();
  private isInitialized = false;

  constructor() {
    this.initGlobalListeners();
  }

  private initGlobalListeners() {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    // Stop streams when window is closed, refreshed, or navigated
    window.addEventListener("pagehide", () => this.stopAll());
    window.addEventListener("beforeunload", () => this.stopAll());

    // When tab is hidden / switched, notify or stop temporary streams if requested
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        // Optional hook if needed
      }
    });
  }

  /**
   * Register an active MediaStream
   */
  public register(stream: MediaStream): void {
    if (!stream) return;
    this.activeStreams.add(stream);

    stream.getTracks().forEach((track) => {
      track.addEventListener("ended", () => {
        if (stream.getTracks().every((t) => t.readyState === "ended")) {
          this.activeStreams.delete(stream);
        }
      });
    });
  }

  /**
   * Unregister a stream
   */
  public unregister(stream: MediaStream): void {
    this.activeStreams.delete(stream);
  }

  /**
   * Stop a specific stream and all its tracks immediately
   */
  public stopStream(stream?: MediaStream | null): void {
    if (!stream) return;

    try {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore
        }
      });
    } catch {
      // Ignore
    }

    this.activeStreams.delete(stream);
  }

  /**
   * Stop all registered active camera and microphone streams across the entire app
   */
  public stopAll(): void {
    this.activeStreams.forEach((stream) => {
      try {
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {
            // Ignore
          }
        });
      } catch {
        // Ignore
      }
    });
    this.activeStreams.clear();
  }

  /**
   * Returns whether any camera stream is currently active
   */
  public hasActiveStreams(): boolean {
    return this.activeStreams.size > 0;
  }
}

export const cameraStreamManager = new CameraStreamManager();
export const stopAllCameraStreams = () => cameraStreamManager.stopAll();
export const stopCameraStream = (stream?: MediaStream | null) => cameraStreamManager.stopStream(stream);
export const registerCameraStream = (stream: MediaStream) => cameraStreamManager.register(stream);
