import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type SignalInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useSignals() {
  return useQuery({
    queryKey: [api.signals.list.path],
    queryFn: async () => {
      const res = await fetch(api.signals.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch signals");
      return api.signals.list.responses[200].parse(await res.json());
    },
  });
}

export function useSignal(id: number) {
  return useQuery({
    queryKey: [api.signals.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.signals.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch signal");
      return api.signals.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSignal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SignalInput) => {
      // Ensure numeric strings are handled if coming from form
      const res = await fetch(api.signals.create.path, {
        method: api.signals.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create signal");
      }
      return api.signals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.signals.list.path] });
      toast({
        title: "Signal Created",
        description: "The trading signal has been published successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSignal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<SignalInput>) => {
      const url = buildUrl(api.signals.update.path, { id });
      const res = await fetch(url, {
        method: api.signals.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update signal");
      return api.signals.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.signals.list.path] });
      toast({
        title: "Signal Updated",
        description: "Status and details have been updated.",
      });
    },
  });
}

export function useDeleteSignal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.signals.delete.path, { id });
      const res = await fetch(url, {
        method: api.signals.delete.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete signal");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.signals.list.path] });
      toast({
        title: "Signal Deleted",
        description: "The signal has been removed.",
      });
    },
  });
}
