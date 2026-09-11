"use client";

import { Component, type ReactNode } from "react";

export class SceneBoundary extends Component<{ children: ReactNode; onError?: (message: string) => void }, { message: string | null }> {
  state = { message: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { message: error.message || "Lỗi scene 3D" };
  }

  componentDidCatch(error: Error) {
    const detail = `${error.message}\n${error.stack ?? ""}`;
    (window as Window & { __bizcarSceneError?: string }).__bizcarSceneError = detail;
    this.props.onError?.(error.message || "scene-init");
  }

  render() {
    if (this.state.message) {
      return (
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[1.2, 0.4, 0.2]} />
          <meshBasicMaterial color="#c45c4a" />
        </mesh>
      );
    }
    return this.props.children;
  }
}
