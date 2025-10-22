import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real, boolean, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Hotel management tables
export const hotels = pgTable("hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(), // Fairmont, Savoy, RITZ, etc.
  location: text("location"),
  rooms: integer("rooms").notNull().default(0),
  status: text("status").notNull().default("active"), // active, inactive, maintenance
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  metadata: jsonb("metadata"), // Additional hotel-specific data
});

export const hotelServices = pgTable("hotel_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => hotels.id).notNull(),
  serviceType: text("service_type").notNull(), // WiFi, IPTV, CCTV, Telephony, Digital Signage
  status: text("status").notNull().default("active"), // active, inactive, maintenance
  monthlyCost: decimal("monthly_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  monthlyRevenue: decimal("monthly_revenue", { precision: 10, scale: 2 }).notNull().default("0"),
  uptime: real("uptime").notNull().default(100), // percentage
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
  metadata: jsonb("metadata"), // Service-specific configuration
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"), // admin, manager, staff
  name: text("name").notNull(),
  hotelId: varchar("hotel_id").references(() => hotels.id), // null for system-wide users
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => hotels.id).notNull(),
  systemType: text("system_type").notNull(), // 'server', 'network', 'iptv', 'wifi', 'security'
  systemName: text("system_name").notNull(),
  uptime: real("uptime").notNull(),
  status: text("status").notNull(), // 'healthy', 'warning', 'critical'
  lastUpdated: timestamp("last_updated").notNull().default(sql`now()`),
  metadata: jsonb("metadata"), // Additional system-specific data
});

export const networkPerformance = pgTable("network_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => hotels.id).notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  currentLoad: real("current_load").notNull(),
  throughput: real("throughput").notNull(), // GB/s
  latency: integer("latency").notNull(), // ms
  activeGuests: integer("active_guests").notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => hotels.id).notNull(),
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
  hotelId: varchar("hotel_id").references(() => hotels.id).notNull(),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  totalUsage: real("total_usage").notNull(), // kW
  systemBreakdown: jsonb("system_breakdown").notNull(), // Per-system usage
  recommendations: text("recommendations").array(),
  potentialSavings: real("potential_savings"), // percentage
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  hotelId: varchar("hotel_id").references(() => hotels.id), // null for system-wide queries
  message: text("message").notNull(),
  response: text("response"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

// Financial tracking
export const hotelFinancials = pgTable("hotel_financials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hotelId: varchar("hotel_id").references(() => hotels.id).notNull(),
  month: text("month").notNull(), // YYYY-MM format
  totalITCost: decimal("total_it_cost", { precision: 10, scale: 2 }).notNull(),
  totalITRevenue: decimal("total_it_revenue", { precision: 10, scale: 2 }).notNull(),
  energyCost: decimal("energy_cost", { precision: 10, scale: 2 }).notNull(),
  maintenanceCost: decimal("maintenance_cost", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
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
    hotelId: z.string().nullable(),
  }),
});

// Insert schemas
export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
  createdAt: true,
});

export const insertHotelServiceSchema = createInsertSchema(hotelServices).omit({
  id: true,
  lastUpdated: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
  hotelId: true,
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

export const insertHotelFinancialsSchema = createInsertSchema(hotelFinancials).omit({
  id: true,
  createdAt: true,
});

// Types
export type Hotel = typeof hotels.$inferSelect;
export type HotelService = typeof hotelServices.$inferSelect;
export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type InsertHotelService = z.infer<typeof insertHotelServiceSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SystemMetrics = typeof systemMetrics.$inferSelect;
export type NetworkPerformance = typeof networkPerformance.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type PowerConsumption = typeof powerConsumption.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type HotelFinancials = typeof hotelFinancials.$inferSelect;
export type InsertSystemMetrics = z.infer<typeof insertSystemMetricsSchema>;
export type InsertNetworkPerformance = z.infer<typeof insertNetworkPerformanceSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertPowerConsumption = z.infer<typeof insertPowerConsumptionSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type InsertHotelFinancials = z.infer<typeof insertHotelFinancialsSchema>;
