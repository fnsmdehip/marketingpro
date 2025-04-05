import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  plan: text("plan").default("free").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Content model
export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  mediaUrls: json("media_urls").$type<string[]>(),
  platforms: json("platforms").$type<string[]>(),
  scheduleType: text("schedule_type").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  status: text("status").default("draft").notNull(),
  aiEnhanced: boolean("ai_enhanced").default(false),
  aiModel: text("ai_model"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContentSchema = createInsertSchema(contents).pick({
  userId: true,
  title: true,
  body: true,
  mediaUrls: true,
  platforms: true,
  scheduleType: true,
  scheduledAt: true,
  status: true,
  aiEnhanced: true,
  aiModel: true,
});

// Platform model
export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platform: text("platform").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  username: text("username"),
  accountId: text("account_id"),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlatformSchema = createInsertSchema(platforms).pick({
  userId: true,
  platform: true,
  accessToken: true,
  refreshToken: true,
  tokenExpiry: true,
  username: true,
  accountId: true,
  status: true,
});

// AI Usage model
export const aiUsage = pgTable("ai_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  provider: text("provider").notNull(),
  requestType: text("request_type").notNull(),
  requestCount: integer("request_count").default(1).notNull(),
  status: text("status").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertAiUsageSchema = createInsertSchema(aiUsage).pick({
  userId: true,
  provider: true,
  requestType: true,
  requestCount: true,
  status: true,
});

// AI Provider model
export const aiProviders = pgTable("ai_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  endpoint: text("endpoint").notNull(),
  status: text("status").default("active").notNull(),
  hourlyLimit: integer("hourly_limit").notNull(),
  dailyLimit: integer("daily_limit").notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  lastUsed: timestamp("last_used").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAiProviderSchema = createInsertSchema(aiProviders).pick({
  name: true,
  endpoint: true,
  status: true,
  hourlyLimit: true,
  dailyLimit: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;

export type InsertPlatform = z.infer<typeof insertPlatformSchema>;
export type Platform = typeof platforms.$inferSelect;

export type InsertAiUsage = z.infer<typeof insertAiUsageSchema>;
export type AiUsage = typeof aiUsage.$inferSelect;

export type InsertAiProvider = z.infer<typeof insertAiProviderSchema>;
export type AiProvider = typeof aiProviders.$inferSelect;
