import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertChatMessageSchema, insertAlertSchema, insertNetworkPerformanceSchema, loginSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Create a simple JWT-like token (for demo purposes)
      const token = `vigon_${user.id}_${Date.now()}`;
      
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
        },
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token || !token.startsWith("vigon_")) {
        return res.status(401).json({ error: "Invalid token" });
      }

      // Extract user ID from token
      const parts = token.split("_");
      if (parts.length !== 3) {
        return res.status(401).json({ error: "Invalid token format" });
      }

      const userId = parts[1];
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Token verification failed" });
    }
  });

  // Dashboard data endpoints
  app.get("/api/dashboard/overview", async (req, res) => {
    try {
      const [systemMetrics, latestNetwork, alerts, powerConsumption] = await Promise.all([
        storage.getSystemMetrics(),
        storage.getLatestNetworkPerformance(),
        storage.getOpenAlerts(),
        storage.getLatestPowerConsumption(),
      ]);

      const overview = {
        systemMetrics,
        networkPerformance: latestNetwork,
        alertsCount: alerts.length,
        powerConsumption,
        lastUpdated: new Date(),
      };

      res.json(overview);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard overview" });
    }
  });

  app.get("/api/network/performance", async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const history = await storage.getNetworkPerformanceHistory(hours);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch network performance data" });
    }
  });

  app.get("/api/alerts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const alerts = await storage.getAlerts(limit);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.patch("/api/alerts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedAlert = await storage.updateAlert(id, updates);
      
      if (!updatedAlert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      
      res.json(updatedAlert);
    } catch (error) {
      res.status(500).json({ error: "Failed to update alert" });
    }
  });

  app.get("/api/power/consumption", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const history = await storage.getPowerConsumptionHistory(days);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch power consumption data" });
    }
  });

  // AI Chatbot endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedMessage = insertChatMessageSchema.parse(req.body);
      const chatMessage = await storage.createChatMessage(validatedMessage);

      // Process the message with OpenAI
      const systemContext = `You are an AI assistant for Vigon Systems' Hotel IT Infrastructure Management Dashboard. 
      You help IT staff with system monitoring, troubleshooting, and optimization. 
      You have access to real-time data about IPTV systems, WiFi networks, security systems, and power consumption.
      Provide clear, actionable responses for IT operations.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: validatedMessage.message }
        ],
        response_format: { type: "json_object" },
      });

      const response = JSON.parse(completion.choices[0].message.content || '{"response": "I apologize, but I encountered an error processing your request."}');
      
      const updatedMessage = await storage.updateChatMessage(chatMessage.id, response.response);
      res.json(updatedMessage);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getChatMessages(userId, limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  // Voice command processing endpoint
  app.post("/api/voice/process", async (req, res) => {
    try {
      const { transcript } = req.body;
      
      if (!transcript) {
        return res.status(400).json({ error: "No transcript provided" });
      }

      // Process voice command with OpenAI to understand intent
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are processing voice commands for a Hotel IT Infrastructure Dashboard. 
            Extract the intent and parameters from the user's voice command.
            Return JSON with: {"action": "show_wifi|show_iptv|show_alerts|show_power", "parameters": {"floor": number, "timeframe": string, "system": string}}`
          },
          { role: "user", content: transcript }
        ],
        response_format: { type: "json_object" },
      });

      const intent = JSON.parse(completion.choices[0].message.content || '{"action": "unknown"}');
      res.json(intent);
    } catch (error) {
      console.error("Voice processing error:", error);
      res.status(500).json({ error: "Failed to process voice command" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    // Send initial data
    const sendUpdate = async () => {
      try {
        const [systemMetrics, latestNetwork, alerts, powerConsumption] = await Promise.all([
          storage.getSystemMetrics(),
          storage.getLatestNetworkPerformance(),
          storage.getOpenAlerts(),
          storage.getLatestPowerConsumption(),
        ]);

        const update = {
          type: 'dashboard_update',
          data: {
            systemMetrics,
            networkPerformance: latestNetwork,
            alerts,
            powerConsumption,
            timestamp: new Date(),
          }
        };

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(update));
        }
      } catch (error) {
        console.error('Error sending WebSocket update:', error);
      }
    };

    // Send updates every 5 seconds
    const interval = setInterval(sendUpdate, 5000);
    sendUpdate(); // Send initial update

    ws.on('close', () => {
      clearInterval(interval);
      console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clearInterval(interval);
    });
  });

  // Simulate real-time data updates
  setInterval(async () => {
    try {
      // Update network performance
      const currentLoad = 70 + Math.random() * 15;
      const throughput = 1.0 + Math.random() * 0.5;
      const latency = 10 + Math.random() * 5;
      const activeGuests = Math.floor(250 + Math.random() * 50);

      await storage.createNetworkPerformance({
        currentLoad,
        throughput,
        latency,
        activeGuests,
      });

      // Occasionally create new alerts
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const alertTypes = [
          { systemType: "wifi", systemName: "WiFi - Floor " + Math.ceil(Math.random() * 5), alertType: "performance", severity: "warning", message: "High latency detected" },
          { systemType: "iptv", systemName: "IPTV - Channel " + Math.ceil(Math.random() * 10), alertType: "quality", severity: "info", message: "Stream quality fluctuation" },
          { systemType: "security", systemName: "Security - Camera " + Math.ceil(Math.random() * 20), alertType: "connectivity", severity: "critical", message: "Connection timeout" },
        ];
        
        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        await storage.createAlert({
          ...randomAlert,
          status: "open",
        });
      }
    } catch (error) {
      console.error('Error updating real-time data:', error);
    }
  }, 30000); // Update every 30 seconds

  return httpServer;
}
