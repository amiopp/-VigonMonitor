// This file contains client-side helpers for OpenAI integration
// The actual OpenAI calls are made on the server for security

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface VoiceCommandIntent {
  action: string;
  parameters: {
    floor?: number;
    timeframe?: string;
    system?: string;
  };
}

export const VOICE_COMMAND_EXAMPLES = [
  "Show WiFi performance for floor 2",
  "What was IPTV uptime last week?",
  "Display security camera status",
  "Show power consumption trends",
  "List all critical alerts",
  "Check network performance",
];

export const CHAT_SUGGESTIONS = [
  "Why is IPTV down?",
  "Show me the last 10 alerts from the CCTV system",
  "How can I optimize power consumption?",
  "What's causing the WiFi issues on floor 3?",
  "Generate a system health report",
];
