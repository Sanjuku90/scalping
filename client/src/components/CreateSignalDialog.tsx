import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertSignalSchema } from "@shared/schema";
import { useCreateSignal } from "@/hooks/use-signals";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Schema refinement for numeric strings
const formSchema = insertSignalSchema.extend({
  entryPrice: z.string().min(1, "Entry price is required"),
  stopLoss: z.string().min(1, "Stop loss is required"),
  takeProfit: z.string().min(1, "Take profit is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateSignalDialog() {
  const [open, setOpen] = useState(false);
  const createSignal = useCreateSignal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pair: "",
      direction: "BUY",
      entryPrice: "",
      stopLoss: "",
      takeProfit: "",
      analysis: "",
      imageUrl: "",
      isPremium: false,
      status: "ACTIVE"
    },
  });

  const onSubmit = (data: FormValues) => {
    createSignal.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> New Signal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Publish New Signal</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pair"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pair</FormLabel>
                    <FormControl>
                      <Input placeholder="BTC/USD" {...field} className="bg-background border-border" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BUY" className="text-green-500 font-bold">BUY (Long)</SelectItem>
                        <SelectItem value="SELL" className="text-red-500 font-bold">SELL (Short)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="entryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} className="bg-background border-border font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-red-400">Stop Loss</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} className="bg-background border-border font-mono text-red-400" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="takeProfit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-400">Take Profit</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} className="bg-background border-border font-mono text-green-400" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="analysis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Analysis</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain your reasoning..." 
                      className="resize-none bg-background border-border min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chart Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} className="bg-background border-border" value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPremium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3 shadow-sm bg-background">
                  <div className="space-y-0.5">
                    <FormLabel>Premium Signal</FormLabel>
                    <div className="text-[10px] text-muted-foreground">
                      Only visible to subscribers
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-blue-500 font-bold"
              disabled={createSignal.isPending}
            >
              {createSignal.isPending ? "Publishing..." : "Publish Signal"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
