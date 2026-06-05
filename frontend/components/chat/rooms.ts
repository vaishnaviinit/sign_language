export interface Room {
  id: string;
  name: string;
  description: string;
  initials: string;
  bgClass: string;
  textClass: string;
}

export const ROOMS: Room[] = [
  {
    id: "general",
    name: "General Chat",
    description: "Open conversation for everyone",
    initials: "GC",
    bgClass: "bg-[#4F7DF3]/10",
    textClass: "text-[#4F7DF3]",
  },
  {
    id: "interpreter-room",
    name: "Interpreter Room",
    description: "Live sign language sessions",
    initials: "IR",
    bgClass: "bg-[#6EC6CA]/10",
    textClass: "text-[#5AB5B9]",
  },
  {
    id: "family",
    name: "Family Group",
    description: "Stay connected with family",
    initials: "FG",
    bgClass: "bg-[#6BCB77]/10",
    textClass: "text-[#4B9A55]",
  },
  {
    id: "support",
    name: "Teacher Support",
    description: "Get help from educators",
    initials: "TS",
    bgClass: "bg-[#A78BFA]/10",
    textClass: "text-[#7C3AED]",
  },
];

export function getRoomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}