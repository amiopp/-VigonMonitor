// This file contains client-side utilities for OpenAI integration
// The actual OpenAI calls are made server-side for security

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface SystemStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  type: string;
}

export function generateSystemPrompt(systems: SystemStatus[], alerts: any[], networkMetrics: any) {
  return `You are an AI assistant for Vigon Systems Hotel IT Infrastructure Management. 
You help IT staff with system monitoring, troubleshooting, and maintenance.

Current System Status:
${systems.map(s => `- ${s.name}: ${s.status} (${s.uptime}% uptime)`).join('\n')}

Recent Alerts:
${alerts.map(a => `- ${a.message} (${a.severity})`).join('\n')}

Network Performance:
- Load: ${networkMetrics?.load}%
- Latency: ${networkMetrics?.latency}ms
- Active Connections: ${networkMetrics?.activeConnections}

Provide helpful, technical responses for IT operations. Keep responses concise and actionable.`;
}

export function formatChatHistory(messages: any[]): ChatMessage[] {
  const formatted: ChatMessage[] = [];
  
  messages.forEach(msg => {
    formatted.push({
      role: 'user',
      content: msg.message,
      timestamp: new Date(msg.createdAt)
    });
    
    if (msg.response) {
      formatted.push({
        role: 'assistant', 
        content: msg.response,
        timestamp: new Date(msg.createdAt)
      });
    }
  });
  
  return formatted;
}
