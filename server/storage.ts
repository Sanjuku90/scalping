import {
  signals,
  type Signal,
  type InsertSignal,
  type UpdateSignalRequest,
  marketData,
  type MarketData,
  type User,
} from "@shared/schema";

export interface IStorage {
  // Auth
  getUser(id: number): Promise<User | undefined>;
  upsertUser(user: any): Promise<User>;

  // Signals
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private signals: Map<number, Signal>;
  private marketData: Map<string, MarketData>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.signals = new Map();
    this.marketData = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(user: any): Promise<User> {
    const id = Number(user.id);
    const existing = this.users.get(id);
    const newUser: User = { 
      ...user, 
      id,
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getSignals(): Promise<Signal[]> {
    return Array.from(this.signals.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getSignal(id: number): Promise<Signal | undefined> {
    return this.signals.get(id);
  }

  async createSignal(insertSignal: InsertSignal): Promise<Signal> {
    const id = this.currentId++;
    const signal: Signal = {
      ...insertSignal,
      id,
      createdAt: new Date(),
      isPremium: insertSignal.isPremium ?? false,
      style: insertSignal.style ?? "DAILY",
      category: insertSignal.category ?? "FOREX",
      analysis: insertSignal.analysis ?? null,
      imageUrl: insertSignal.imageUrl ?? null,
      status: insertSignal.status ?? "ACTIVE",
      closedAt: null,
      resultPips: null,
    };
    this.signals.set(id, signal);
    return signal;
  }

  async updateSignal(id: number, updates: UpdateSignalRequest): Promise<Signal> {
    const existing = this.signals.get(id);
    if (!existing) throw new Error("Signal not found");
    const updated = { ...existing, ...updates };
    this.signals.set(id, updated);
    return updated;
  }

  async deleteSignal(id: number): Promise<void> {
    this.signals.delete(id);
  }

  async getMarketData(symbol: string): Promise<MarketData | undefined> {
    return this.marketData.get(symbol);
  }

  async updateMarketData(data: Omit<MarketData, "id" | "updatedAt">): Promise<MarketData> {
    const existing = this.marketData.get(data.symbol);
    const updated: MarketData = {
      ...data,
      id: existing?.id || this.currentId++,
      updatedAt: new Date()
    };
    this.marketData.set(data.symbol, updated);
    return updated;
  }

  async getAllMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values());
  }
}

export const storage = new MemStorage();
