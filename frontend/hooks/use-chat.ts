"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export const SOCKET_URL = "http://localhost:5001";

export type MsgType = "chat" | "system" | "prediction";

export interface ChatMessage {
  id: string;
  type: MsgType;
  username?: string;
  text: string;
  timestamp: number;
}

export type ConnStatus = "connecting" | "connected" | "disconnected";

export interface UseChatReturn {
  status: ConnStatus;
  messages: ChatMessage[];
  joinedRoom: string | null;
  joinRoom: (username: string, room: string) => void;
  sendMessage: (username: string, room: string, text: string) => void;
}

export function useChat(): UseChatReturn {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<ConnStatus>("connecting");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    const s = io(SOCKET_URL);
    socketRef.current = s;

    s.on("connect", () => setStatus("connected"));
    s.on("disconnect", () => {
      setStatus("disconnected");
      setJoinedRoom(null);
    });
    s.on("connect_error", () => setStatus("disconnected"));

    s.on("system_message", (d: { message: string }) =>
      setMessages((p) => [
        ...p,
        { id: `${++idRef.current}`, type: "system", text: d.message, timestamp: Date.now() },
      ])
    );

    s.on("receive_message", (d: { username: string; message: string }) =>
      setMessages((p) => [
        ...p,
        { id: `${++idRef.current}`, type: "chat", username: d.username, text: d.message, timestamp: Date.now() },
      ])
    );

    s.on("receive_prediction", (d: { username: string; prediction: string }) =>
      setMessages((p) => [
        ...p,
        { id: `${++idRef.current}`, type: "prediction", username: d.username, text: d.prediction, timestamp: Date.now() },
      ])
    );

    return () => {
      s.disconnect();
    };
  }, []);

  const joinRoom = useCallback((username: string, room: string) => {
    if (!socketRef.current) return;
    setMessages([]);
    setJoinedRoom(room);
    socketRef.current.emit("join_room", { username, room });
  }, []);

  const sendMessage = useCallback((username: string, room: string, text: string) => {
    const t = text.trim();
    if (!socketRef.current || !t) return;
    socketRef.current.emit("send_message", { username, room, message: t });
  }, []);

  return { status, messages, joinedRoom, joinRoom, sendMessage };
}