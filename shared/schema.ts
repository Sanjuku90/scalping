import { pgTable, text, serial, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models so they are included in the schema
export * from "./models/auth";

export const signals = pgTable("signals", {
  id: serial("id").primaryKey(),
  pair: text("pair").notNull(), // e.g. "EUR/USD", "BTC/USD"
  direction: text("direction", { enum: ["BUY", "SELL"] }).notNull(),
  entryPrice: numeric("entry_price").notNull(),
  stopLoss: numeric("stop_loss").notNull(),
  takeProfit: numeric("take_profit").notNull(),
  status: text("status", { enum: ["ACTIVE", "HIT_TP", "HIT_SL", "CLOSED"] }).default("ACTIVE").notNull(),
  analysis: text("analysis"), // Detailed reasoning
  imageUrl: text("image_url"), // Chart image
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  resultPips: numeric("result_pips"), // Profit/Loss in pips
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  price: numeric("price").notNull(),
  change: numeric("change"),
  changePercent: text("change_percent"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSignalSchema = createInsertSchema(signals).omit({ 
  id: true, 
  createdAt: true, 
  closedAt: true,
  resultPips: true 
});

export type Signal = typeof signals.$inferSelect;
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type MarketData = typeof marketData.$inferSelect;

export type CreateSignalRequest = InsertSignal;
export type UpdateSignalRequest = Partial<InsertSignal>;
