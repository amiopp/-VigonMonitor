import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  name: text("name").notNull(),
});

export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  systemType: text("system_type").notNull(), // 'server', 'network', 'iptv', 'wifi', 'security'
  systemName: text("system_name").notNull(),
  uptime: real("uptime").notNull(),
  status: text("status").notNull(), // 'healthy', 'warning', 'critical'
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
  metadata: jsonb("metadata"), // Additional system-specific data
});

export const networkPerformance = pgTable("network_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  currentLoad: real("current_load").notNull(),
  throughput: real("throughput").notNull(), // GB/s
  latency: integer("latency").notNull(), // ms
  activeGuests: integer("active_guests").notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  systemType: text("system_type").notNull(),
  systemName: text("system_name").notNull(),
  alertType: text("alert_type").notNull(),
  severity: text("severity").notNull(), // 'info', 'warning', 'critical'
  message: text("message").notNull(),
  status: text("status").notNull().default("open"), // 'open', 'investigating', 'resolved'
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  resolvedAt: timestamp("resolved_at"),
});

export const powerConsumption = pgTable("power_consumption", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  totalUsage: real("total_usage").notNull(), // kW
  systemBreakdown: jsonb("system_breakdown").notNull(), // Per-system usage
  recommendations: text("recommendations").array(),
  potentialSavings: real("potential_savings"), // percentage
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  message: text("message").notNull(),
  response: text("response"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    username: z.string(),
    role: z.string(),
    name: z.string(),
  }),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
});

export const insertSystemMetricsSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  lastUpdated: true,
});

export const insertNetworkPerformanceSchema = createInsertSchema(networkPerformance).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertPowerConsumptionSchema = createInsertSchema(powerConsumption).omit({
  id: true,
  timestamp: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
  response: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SystemMetrics = typeof systemMetrics.$inferSelect;
export type NetworkPerformance = typeof networkPerformance.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type PowerConsumption = typeof powerConsumption.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertSystemMetrics = z.infer<typeof insertSystemMetricsSchema>;
export type InsertNetworkPerformance = z.infer<typeof insertNetworkPerformanceSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertPowerConsumption = z.infer<typeof insertPowerConsumptionSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
