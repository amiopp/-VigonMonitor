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

  // Notifications
  getNotifications(hotelId?: string, limit?: number): Promise<{
    id: string; title: string; message: string; type: 'alert' | 'news'; hotelId: string; timestamp: Date;
  }[]>;
  createNotification(n: { title: string; message: string; type: 'alert' | 'news'; hotelId: string }): Promise<{
    id: string; title: string; message: string; type: 'alert' | 'news'; hotelId: string; timestamp: Date;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private systemMetrics: Map<string, SystemMetrics>;
  private networkPerformance: NetworkPerformance[];
  private alerts: Map<string, Alert>;
  private powerConsumption: PowerConsumption[];
  private chatMessages: Map<string, ChatMessage>;
  private notifications: Map<string, { id: string; title: string; message: string; type: 'alert' | 'news'; hotelId: string; timestamp: Date }>; 

  constructor() {
    this.users = new Map();
    this.systemMetrics = new Map();
    this.networkPerformance = [];
    this.alerts = new Map();
    this.powerConsumption = [];
    this.chatMessages = new Map();
    this.notifications = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize demo users
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "Amine2@@300",
      role: "IT",
      name: "IT Administrator",
      createdAt: new Date(),
      hotelId: null
    };
    
    const managerUser: User = {
      id: randomUUID(),
      username: "manager", 
      password: "Amine2@@300",
      role: "Manager",
      name: "Hotel Manager",
      createdAt: new Date(),
      hotelId: null
    };
    
    this.users.set(adminUser.id, adminUser);
    this.users.set(managerUser.id, managerUser);

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
        hotelId: "hotel-1" // Mock hotel ID
      };
      this.systemMetrics.set(metrics.id, metrics);
    });

    // Initialize network performance data
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      this.networkPerformance.push({
        id: randomUUID(),
        timestamp: new Date(now.getTime() - (i * 60 * 60 * 1000)),
        currentLoad: Math.random() * 100,
        throughput: Math.random() * 10 + 5,
        latency: Math.floor(Math.random() * 50) + 10,
        activeGuests: 250 + Math.random() * 50,
        hotelId: "hotel-1" // Mock hotel ID
      });
    }

    // Initialize alerts
    const alertTypes = [
      { systemType: "wifi", systemName: "Guest WiFi", alertType: "High Load", severity: "warning", message: "WiFi usage above 80% capacity" },
      { systemType: "iptv", systemName: "IPTV System", alertType: "Storage Warning", severity: "info", message: "Storage usage at 75%" },
      { systemType: "security", systemName: "Security System", alertType: "Motion Detected", severity: "info", message: "Motion detected in restricted area" },
      { systemType: "server", systemName: "Main Server", alertType: "High CPU", severity: "medium", message: "CPU usage above 90%" },
    ];

    alertTypes.forEach(alert => {
      const alertData: Alert = {
        id: randomUUID(),
        status: "open",
        message: alert.message,
        createdAt: new Date(),
        hotelId: "hotel-1", // Mock hotel ID
        systemType: alert.systemType,
        systemName: alert.systemName,
        alertType: alert.alertType,
        severity: alert.severity,
        resolvedAt: null,
      };
      this.alerts.set(alertData.id, alertData);
    });

    // Initialize power consumption data
    for (let i = 0; i < 7; i++) {
      this.powerConsumption.push({
        id: randomUUID(),
        timestamp: new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)),
        totalUsage: Math.random() * 100 + 20,
        systemBreakdown: {
          wifi: Math.random() * 30 + 10,
          iptv: Math.random() * 25 + 8,
          cctv: Math.random() * 15 + 5,
          telephony: Math.random() * 20 + 6,
          signage: Math.random() * 10 + 3,
        },
        recommendations: ['Enable power saving mode during off-peak hours', 'Consider LED lighting for digital signage'],
        potentialSavings: 12,
        hotelId: "hotel-1" // Mock hotel ID
      });
    }

    // Initialize chat messages
    const chatMessages = [
      { message: "How do I check the WiFi status?", userId: adminUser.id },
      { message: "What's the current system uptime?", userId: managerUser.id },
      { message: "Are there any critical alerts?", userId: adminUser.id },
    ];

    chatMessages.forEach(msg => {
      const chatMessage: ChatMessage = {
        id: randomUUID(),
        message: msg.message,
        hotelId: "hotel-1", // Mock hotel ID
        timestamp: new Date(),
        userId: msg.userId,
        response: null,
      };
      this.chatMessages.set(chatMessage.id, chatMessage);
    });

    // Initialize notifications (per hotel)
    const initialNotifs = [
      { title: 'WiFi maintenance scheduled', message: 'Maintenance at 23:00', type: 'news' as const, hotelId: 'hotel-1' },
      { title: 'Camera offline', message: 'CCTV CAM-05 is offline', type: 'alert' as const, hotelId: 'hotel-1' },
    ];
    initialNotifs.forEach(n => {
      const id = randomUUID();
      this.notifications.set(id, { id, ...n, timestamp: new Date() });
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
      role: insertUser.role || "admin",
      createdAt: new Date(),
      hotelId: null
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
      metadata: metrics.metadata || {},
      hotelId: "hotel-1" // Mock hotel ID
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
      hotelId: "hotel-1" // Mock hotel ID
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
      hotelId: "hotel-1" // Mock hotel ID
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
      hotelId: "hotel-1" // Mock hotel ID
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
      hotelId: "hotel-1" // Mock hotel ID
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

  async getNotifications(hotelId?: string, limit: number = 50) {
    const list = Array.from(this.notifications.values())
      .filter(n => (hotelId ? n.hotelId === hotelId : true))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    return list;
  }

  async createNotification(n: { title: string; message: string; type: 'alert' | 'news'; hotelId: string }) {
    const id = randomUUID();
    const created = { id, ...n, timestamp: new Date() };
    this.notifications.set(id, created);
    return created;
  }
}

export const storage = new MemStorage();
