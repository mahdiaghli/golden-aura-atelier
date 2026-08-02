import { useQuery } from "@tanstack/react-query";
import { getLiveInventory, type LiveInventoryEntry } from "@/lib/zargar.functions";

export function proxiedImage(url: string) {
  return `/api/public/product-image?u=${encodeURIComponent(url)}`;
}

/** Live images + stock counts keyed by product code, from the accounting API. */
export function useLiveInventory() {
  const query = useQuery({
    queryKey: ["zargar-inventory"],
    queryFn: () => getLiveInventory(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    items: query.data?.items ?? {},
    error: query.data?.error,
    isLoading: query.isLoading,
  };
}

export function liveEntryFor(
  items: Record<string, LiveInventoryEntry>,
  code: string | undefined,
): LiveInventoryEntry | undefined {
  if (!code) return undefined;
  return items[code.toUpperCase()];
}
