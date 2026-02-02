import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // Protect all signal routes with authentication
  // For a real app, you might want to allow public access to list but restricted details,
  // but for "Trading Signals" usually it's members only.
  
  // List signals
  app.get(api.signals.list.path, isAuthenticated, async (req, res) => {
    const signals = await storage.getSignals();
    res.json(signals);
  });

  // Get signal details
  app.get(api.signals.get.path, isAuthenticated, async (req, res) => {
    const signal = await storage.getSignal(Number(req.params.id));
    if (!signal) {
      return res.status(404).json({ message: 'Signal not found' });
    }
    res.json(signal);
  });

  // Create signal (In a real app, restrict this to Admin only)
  app.post(api.signals.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.signals.create.input.parse(req.body);
      const signal = await storage.createSignal(input);
      res.status(201).json(signal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Update signal
  app.patch(api.signals.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.signals.update.input.parse(req.body);
      const signal = await storage.updateSignal(Number(req.params.id), input);
      if (!signal) {
        return res.status(404).json({ message: 'Signal not found' });
      }
      res.json(signal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Delete signal
  app.delete(api.signals.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteSignal(Number(req.params.id));
    res.status(204).end();
  });

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getSignals();
  if (existing.length === 0) {
    console.log("Seeding database with initial signals...");
    
    await storage.createSignal({
      pair: "BTC/USD",
      direction: "BUY",
      entryPrice: "42500.00",
      stopLoss: "41000.00",
      takeProfit: "45000.00",
      status: "ACTIVE",
      analysis: "Bitcoin is forming a strong support base at 42k. Bullish divergence on RSI suggests a reversal.",
      imageUrl: "https://s3.tradingview.com/snapshots/b/BtcUsdChart_placeholder.png",
      isPremium: true
    });

    await storage.createSignal({
      pair: "EUR/USD",
      direction: "SELL",
      entryPrice: "1.0950",
      stopLoss: "1.1020",
      takeProfit: "1.0800",
      status: "ACTIVE",
      analysis: "Euro facing resistance at key fibonacci level. Expecting a pullback to test lower support.",
      isPremium: false
    });

    await storage.createSignal({
      pair: "GOLD (XAU/USD)",
      direction: "BUY",
      entryPrice: "2030.50",
      stopLoss: "2015.00",
      takeProfit: "2060.00",
      status: "HIT_TP",
      analysis: "Gold broke out of the consolidation channel. Target hit successfully.",
      isPremium: true
    });
  }
}
