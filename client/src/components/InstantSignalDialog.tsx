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

const ASSETS = [
  { value: "EUR/USD", label: "EUR/USD (Forex)" },
  { value: "GBP/USD", label: "GBP/USD (Forex)" },
  { value: "BTC/USD", label: "Bitcoin (Crypto)" },
  { value: "ETH/USD", label: "Ethereum (Crypto)" },
  { value: "AAPL", label: "Apple (Stock)" },
  { value: "TSLA", label: "Tesla (Stock)" },
  { value: "MSFT", label: "Microsoft (Stock)" },
  { value: "GOOGL", label: "Google (Stock)" },
];

export function InstantSignalDialog() {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (symbol: string) => {
      const res = await apiRequest("POST", "/api/signals/instant", { symbol });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signals"] });
      toast({
        title: "Signal Généré",
        description: "L'IA a terminé son analyse et a trouvé une position.",
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
            <label className="text-sm font-medium">Choisir un actif</label>
            <Select onValueChange={setSymbol} value={symbol}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un actif..." />
              </SelectTrigger>
              <SelectContent>
                {ASSETS.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value}>
                    {asset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => mutation.mutate(symbol)}
            disabled={!symbol || mutation.isPending}
            className="w-full mt-2"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              "Lancer l'Analyse Scalping"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
