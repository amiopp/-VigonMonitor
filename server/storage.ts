import { type User, type InsertUser, type SystemMetrics, type InsertSystemMetrics, type NetworkPerformance, type InsertNetworkPerformance, type Alert, type InsertAlert, type PowerConsumption, type InsertPowerConsumption, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // System Metrics
  getSystemMetrics(): Promise<SystemMetrics[]>;
  createSystemMetrics(metrics: InsertSystemMetrics): Promise<SystemMetrics>;
  updateSystemMetrics(id: string, metrics: Partial<SystemMetrics>): Promise<SystemMetrics | undefined>;

  // Network Performance
  getLatestNetworkPerformance(): Promise<NetworkPerformance | undefined>;
  getNetworkPerformanceHistory(hours?: number): Promise<NetworkPerformance[]>;
  createNetworkPerformance(performance: InsertNetworkPerformance): Promise<NetworkPerformance>;

  // Alerts
  getAlerts(limit?: number): Promise<Alert[]>;
  getOpenAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: string, alert: Partial<Alert>): Promise<Alert | undefined>;

  // Power Consumption
  getLatestPowerConsumption(): Promise<PowerConsumption | undefined>;
  getPowerConsumptionHistory(days?: number): Promise<PowerConsumption[]>;
  createPowerConsumption(consumption: InsertPowerConsumption): Promise<PowerConsumption>;

  // Chat Messages
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateChatMessage(id: string, response: string): Promise<ChatMessage | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private systemMetrics: Map<string, SystemMetrics>;
  private networkPerformance: NetworkPerformance[];
  private alerts: Map<string, Alert>;
  private powerConsumption: PowerConsumption[];
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.systemMetrics = new Map();
    this.networkPerformance = [];
    this.alerts = new Map();
    this.powerConsumption = [];
    this.chatMessages = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize default user
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "admin123", // In production, this should be hashed
      role: "admin",
      name: "System Admin",
    };
    this.users.set(adminUser.id, adminUser);

    // Initialize system metrics
    const systems = [
      { systemType: "server", systemName: "Main Server", uptime: 99.9, status: "healthy" },
      { systemType: "server", systemName: "Database", uptime: 99.8, status: "healthy" },
      { systemType: "wifi", systemName: "Guest WiFi", uptime: 97.5, status: "warning" },
      { systemType: "security", systemName: "Security System", uptime: 100, status: "healthy" },
      { systemType: "iptv", systemName: "IPTV System", uptime: 98.7, status: "healthy" },
    ];

    systems.forEach(system => {
      const metrics: SystemMetrics = {
        id: randomUUID(),
        systemType: system.systemType,
        systemName: system.systemName,
        uptime: system.uptime,
        status: system.status,
        lastUpdated: new Date(),
        metadata: null,
      };
      this.systemMetrics.set(metrics.id, metrics);
    });

    // Initialize network performance data
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
      this.networkPerformance.push({
        id: randomUUID(),
        timestamp,
        currentLoad: 70 + Math.random() * 15,
        throughput: 1.0 + Math.random() * 0.5,
        latency: 10 + Math.random() * 5,
        activeGuests: 250 + Math.random() * 50,
      });
    }

    // Initialize alerts
    const alertsData = [
      {
        systemType: "wifi",
        systemName: "WiFi - Floor 3",
        alertType: "performance",
        severity: "warning",
        message: "High latency detected",
        status: "investigating",
      },
      {
        systemType: "iptv",
        systemName: "IPTV - Channel 5",
        alertType: "quality",
        severity: "info",
        message: "Stream quality restored",
        status: "resolved",
      },
      {
        systemType: "security",
        systemName: "Security - Camera 12",
        alertType: "connectivity",
        severity: "critical",
        message: "Connection timeout",
        status: "open",
      },
    ];

    alertsData.forEach(alertData => {
      const alert: Alert = {
        id: randomUUID(),
        ...alertData,
        createdAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        resolvedAt: alertData.status === "resolved" ? new Date() : null,
      };
      this.alerts.set(alert.id, alert);
    });

    // Initialize power consumption
    this.powerConsumption.push({
      id: randomUUID(),
      timestamp: new Date(),
      totalUsage: 8.4,
      systemBreakdown: {
        iptv: 2.1,
        wifi: 1.8,
        security: 1.2,
        servers: 2.8,
        other: 0.5,
      },
      recommendations: [
        "Switch idle access points to low-power mode between 2AM-6AM to save 15% energy",
        "Optimize IPTV server load balancing to reduce energy costs by 12%",
      ],
      potentialSavings: 12,
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "admin"
    };
    this.users.set(id, user);
    return user;
  }

  // System Metrics methods
  async getSystemMetrics(): Promise<SystemMetrics[]> {
    return Array.from(this.systemMetrics.values());
  }

  async createSystemMetrics(metrics: InsertSystemMetrics): Promise<SystemMetrics> {
    const id = randomUUID();
    const systemMetrics: SystemMetrics = {
      ...metrics,
      id,
      lastUpdated: new Date(),
      metadata: metrics.metadata || {}
    };
    this.systemMetrics.set(id, systemMetrics);
    return systemMetrics;
  }

  async updateSystemMetrics(id: string, updates: Partial<SystemMetrics>): Promise<SystemMetrics | undefined> {
    const existing = this.systemMetrics.get(id);
    if (!existing) return undefined;
    
    const updated: SystemMetrics = {
      ...existing,
      ...updates,
      lastUpdated: new Date(),
    };
    this.systemMetrics.set(id, updated);
    return updated;
  }

  // Network Performance methods
  async getLatestNetworkPerformance(): Promise<NetworkPerformance | undefined> {
    return this.networkPerformance.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  async getNetworkPerformanceHistory(hours: number = 24): Promise<NetworkPerformance[]> {
    const cutoff = new Date(Date.now() - (hours * 60 * 60 * 1000));
    return this.networkPerformance
      .filter(perf => perf.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createNetworkPerformance(performance: InsertNetworkPerformance): Promise<NetworkPerformance> {
    const networkPerf: NetworkPerformance = {
      ...performance,
      id: randomUUID(),
      timestamp: new Date(),
    };
    this.networkPerformance.push(networkPerf);
    return networkPerf;
  }

  // Alerts methods
  async getAlerts(limit: number = 50): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getOpenAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.status !== "resolved")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const newAlert: Alert = {
      ...alert,
      id,
      status: alert.status || "open",
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert | undefined> {
    const existing = this.alerts.get(id);
    if (!existing) return undefined;
    
    const updated: Alert = {
      ...existing,
      ...updates,
    };
    
    if (updates.status === "resolved" && !existing.resolvedAt) {
      updated.resolvedAt = new Date();
    }
    
    this.alerts.set(id, updated);
    return updated;
  }

  // Power Consumption methods
  async getLatestPowerConsumption(): Promise<PowerConsumption | undefined> {
    return this.powerConsumption.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  async getPowerConsumptionHistory(days: number = 7): Promise<PowerConsumption[]> {
    const cutoff = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
    return this.powerConsumption
      .filter(consumption => consumption.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createPowerConsumption(consumption: InsertPowerConsumption): Promise<PowerConsumption> {
    const powerConsumption: PowerConsumption = {
      ...consumption,
      id: randomUUID(),
      timestamp: new Date(),
      recommendations: consumption.recommendations || null,
      potentialSavings: consumption.potentialSavings || null,
    };
    this.powerConsumption.push(powerConsumption);
    return powerConsumption;
  }

  // Chat Messages methods
  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-limit);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = {
      ...message,
      id,
      userId: message.userId || null,
      timestamp: new Date(),
      response: null,
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async updateChatMessage(id: string, response: string): Promise<ChatMessage | undefined> {
    const existing = this.chatMessages.get(id);
    if (!existing) return undefined;
    
    const updated: ChatMessage = {
      ...existing,
      response,
    };
    this.chatMessages.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
