"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { PredictionData } from "@/types";

const BACKEND_URL = "http://localhost:5000";
const POLL_INTERVAL = 200;

export function usePrediction() {
  const [data, setData] = useState<PredictionData>({
    letter: "",
    handDetected: false,
    backendConnected: false,
    fps: 0,
  });


  
  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(Date.now());
  const fpsRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const poll = useCallback(async () => {
    abortRef.current = new AbortController();
    try {
      const res = await fetch(`${BACKEND_URL}/prediction`, {
        signal: abortRef.current.signal,
        cache: "no-store",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!res.ok) throw new Error("bad response");
      const json = await res.json();

      frameCount.current += 1;
      const now = Date.now();
      if (now - lastFpsUpdate.current >= 1000) {
        fpsRef.current = frameCount.current;
        frameCount.current = 0;
        lastFpsUpdate.current = now;
      }

      setData({
        letter: json.letter ?? "",
        handDetected: Boolean(json.letter),
        backendConnected: true,
        fps: fpsRef.current,
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setData((prev) => ({
        ...prev,
        backendConnected: false,
        handDetected: false,
        letter: "",
      }));
    }
  }, []);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => {
      clearInterval(id);
      abortRef.current?.abort();
    };
  }, [poll]);

  return { data, backendUrl: BACKEND_URL };
}
