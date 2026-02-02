import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Loader2 } from "lucide-react";

const ASSETS = {
  CRYPTO: [
    { value: "BTC/USD", label: "Bitcoin" },
    { value: "ETH/USD", label: "Ethereum" },
    { value: "BNB/USD", label: "Binance Coin" },
    { value: "XRP/USD", label: "Ripple XRP" },
    { value: "SOL/USD", label: "Solana" },
    { value: "ADA/USD", label: "Cardano" },
    { value: "DOGE/USD", label: "Dogecoin" },
  ],
  FOREX: [
    { value: "EUR/USD", label: "EUR/USD" },
    { value: "GBP/USD", label: "GBP/USD" },
    { value: "USD/JPY", label: "USD/JPY" },
    { value: "AUD/USD", label: "AUD/USD" },
    { value: "USD/CHF", label: "USD/CHF" },
    { value: "USD/CAD", label: "USD/CAD" },
  ],
  STOCKS: [
    { value: "AAPL", label: "Apple" },
    { value: "TSLA", label: "Tesla" },
    { value: "MSFT", label: "Microsoft" },
    { value: "GOOGL", label: "Google" },
    { value: "NVDA", label: "Nvidia" },
    { value: "META", label: "Meta" },
  ]
};

const STYLES = [
  { value: "SCALPING", label: "Scalping (1-15 min)" },
  { value: "DAILY", label: "Daily (Intraday)" },
  { value: "SWING", label: "Swing (Plusieurs jours)" },
];

export function InstantSignalDialog() {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [style, setStyle] = useState("DAILY");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { symbol: string, style: string }) => {
      const res = await apiRequest("POST", "/api/signals/instant", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signals"] });
      toast({
        title: "Signal Généré",
        description: `L'IA a terminé son analyse ${style.toLowerCase()} et a trouvé une position.`,
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Analyse Échouée",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-primary hover-elevate active-elevate-2 gap-2">
          <Brain className="w-5 h-5" />
          Analyse Instantanée
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Analyse Instantanée par IA</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Technique de Trading</label>
            <Select onValueChange={setStyle} value={style}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un style..." />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Actif financier</label>
            <Select onValueChange={setSymbol} value={symbol}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un actif..." />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">Crypto</div>
                {ASSETS.CRYPTO.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value}>
                    {asset.label}
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase mt-2">Forex</div>
                {ASSETS.FOREX.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value}>
                    {asset.label}
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase mt-2">Actions</div>
                {ASSETS.STOCKS.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value}>
                    {asset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => mutation.mutate({ symbol, style })}
            disabled={!symbol || !style || mutation.isPending}
            className="w-full mt-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse IA en cours...
              </>
            ) : (
              "Lancer l'Analyse Elite"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
