export interface PredictionData {
  letter: string;
  handDetected: boolean;
  backendConnected: boolean;
  fps: number;
}

export interface TranslatorState {
  text: string;
  currentLetter: string;
  isAutoMode: boolean;
  isSpeaking: boolean;
}

export interface StatusCard {
  label: string;
  value: string;
  status: "active" | "inactive" | "warning";
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}
