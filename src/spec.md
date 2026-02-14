# Specification

## Summary
**Goal:** Make camera capture start in a way that reliably triggers the browser/OS camera permission prompt, especially on browsers that require an explicit user gesture.

**Planned changes:**
- Adjust the camera capture entry flow so the camera is only started after an explicit user action (e.g., “Start camera” button) rather than automatically on component mount.
- Add clear UI states for camera mode: pre-permission action prompt, loading while starting the camera, active preview with capture controls, and a denied-permission message with next steps plus an image-upload fallback.
- Implement changes within the existing camera components/hook (e.g., `frontend/src/components/CoinCapture/CoinCameraCapture.tsx` and `frontend/src/camera/useCamera.ts`) while keeping all user-facing text in English.

**User-visible outcome:** When entering camera capture, users see a clear action to start the camera that triggers the permission prompt; they get an active preview after granting permission, and if permission is blocked they see guidance and can still upload an image instead.
