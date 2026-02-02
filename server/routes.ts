import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { fetchMarketPrice, generateSignals } from "./market";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // Market Data endpoint
  app.get("/api/market/:symbol", isAuthenticated, async (req, res) => {
    const symbol = String(req.params.symbol);
    const data = await fetchMarketPrice(symbol);
    if (!data) return res.status(404).json({ message: "Data not found" });
    res.json(data);
  });

  // Manual trigger for signal generation (Admin/System only in real world)
  app.post("/api/admin/generate-signals", isAuthenticated, async (req, res) => {
    await generateSignals();
    res.json({ message: "Signals generated based on real market data" });
  });
  
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

  // Create signal
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

  // Initial trigger
  generateSignals().catch(console.error);

  return httpServer;
}
