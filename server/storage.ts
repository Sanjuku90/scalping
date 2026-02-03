import { db } from "./db";
import {
  signals,
  type Signal,
  type InsertSignal,
  type UpdateSignalRequest,
  marketData,
  type MarketData
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  getSignals(): Promise<Signal[]>;
  getSignal(id: number): Promise<Signal | undefined>;
  createSignal(signal: InsertSignal): Promise<Signal>;
  updateSignal(id: number, updates: UpdateSignalRequest): Promise<Signal>;
  deleteSignal(id: number): Promise<void>;
  
  // Market Data
  getMarketData(symbol: string): Promise<MarketData | undefined>;
  updateMarketData(data: Omit<MarketData, "id" | "updatedAt">): Promise<MarketData>;
  getAllMarketData(): Promise<MarketData[]>;
}

export class DatabaseStorage implements IStorage {
  // Auth storage delegation
  getUser = authStorage.getUser;
  upsertUser = authStorage.upsertUser;

  async getSignals(): Promise<Signal[]> {
    return await db.select().from(signals).orderBy(desc(signals.createdAt));
  }

  async getSignal(id: number): Promise<Signal | undefined> {
    const [signal] = await db.select().from(signals).where(eq(signals.id, id));
    return signal;
  }

  async createSignal(insertSignal: InsertSignal): Promise<Signal> {
    const [signal] = await db.insert(signals).values(insertSignal).returning();
    return signal;
  }

  async updateSignal(id: number, updates: UpdateSignalRequest): Promise<Signal> {
    const [updated] = await db
      .update(signals)
      .set(updates)
      .where(eq(signals.id, id))
      .returning();
    return updated;
  }

  async deleteSignal(id: number): Promise<void> {
    await db.delete(signals).where(eq(signals.id, id));
  }

  async getMarketData(symbol: string): Promise<MarketData | undefined> {
    const [data] = await db.select().from(marketData).where(eq(marketData.symbol, symbol));
    return data;
  }

  async updateMarketData(data: Omit<MarketData, "id" | "updatedAt">): Promise<MarketData> {
    const [updated] = await db
      .insert(marketData)
      .values(data)
      .onConflictDoUpdate({
        target: marketData.symbol,
        set: {
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          updatedAt: new Date(),
        }
      })
      .returning();
    return updated;
  }

  async getAllMarketData(): Promise<MarketData[]> {
    return await db.select().from(marketData);
  }
}

export const storage = new DatabaseStorage();
