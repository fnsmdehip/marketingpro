import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema with Stripe integration fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  subscriptionTier: text("subscription_tier"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content schema for managing content pieces
export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content"),
  contentType: text("content_type").notNull(), // blog, social, email, etc.
  status: text("status").notNull(), // draft, scheduled, published
  scheduledDate: timestamp("scheduled_date"),
  publishedDate: timestamp("published_date"),
  platformId: integer("platform_id"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform schema for social media and publishing platforms
export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  platformType: text("platform_type").notNull(), // twitter, facebook, wordpress, etc.
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  isActive: boolean("is_active").default(true),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Usage tracking
export const aiUsages = pgTable("ai_usages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  requestType: text("request_type").notNull(), // text, image, etc.
  provider: text("provider").notNull(), // openai, anthropic, etc.
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  totalTokens: integer("total_tokens"),
  cost: integer("cost"), // in cents
  timestamp: timestamp("timestamp").defaultNow(),
});

// AI Providers configuration
export const aiProviders = pgTable("ai_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  apiKey: text("api_key"),
  isActive: boolean("is_active").default(true),
  usageCount: integer("usage_count").default(0),
  failureCount: integer("failure_count").default(0),
  lastFailureTimestamp: timestamp("last_failure_timestamp"),
  config: json("config"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for use in forms and validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertContentSchema = createInsertSchema(contents).pick({
  userId: true,
  title: true,
  content: true,
  contentType: true,
  status: true,
  scheduledDate: true,
  platformId: true,
  metadata: true,
});

export const insertPlatformSchema = createInsertSchema(platforms).pick({
  userId: true,
  name: true,
  platformType: true,
  accessToken: true,
  refreshToken: true,
  tokenExpiry: true,
  metadata: true,
});

export const insertAiUsageSchema = createInsertSchema(aiUsages).pick({
  userId: true,
  requestType: true,
  provider: true,
  promptTokens: true,
  completionTokens: true,
  totalTokens: true,
  cost: true,
  timestamp: true,
});

export const insertAiProviderSchema = createInsertSchema(aiProviders).pick({
  name: true,
  apiKey: true,
  isActive: true,
  config: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;

export type InsertPlatform = z.infer<typeof insertPlatformSchema>;
export type Platform = typeof platforms.$inferSelect;

export type InsertAiUsage = z.infer<typeof insertAiUsageSchema>;
export type AiUsage = typeof aiUsages.$inferSelect;

export type InsertAiProvider = z.infer<typeof insertAiProviderSchema>;
export type AiProvider = typeof aiProviders.$inferSelect;
