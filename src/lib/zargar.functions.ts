import { createServerFn } from "@tanstack/react-start";

export type LiveInventoryEntry = {
  images: string[];
  quantity: number;
  isExists: boolean;
};

export type LiveInventoryResponse = {
  items: Record<string, LiveInventoryEntry>;
  count: number;
  error?: string;
};

/**
 * Pulls per-product images + availability from the Zargar accounting web API.
 * Falls back to an empty map (catalog images / static data) when the accounting
 * server is unreachable, so the storefront never breaks.
 */
export const getLiveInventory = createServerFn({ method: "GET" }).handler(
  async (): Promise<LiveInventoryResponse> => {
    const { getInventory } = await import("./zargar.server");
    const { data, error } = await getInventory();

    const items: Record<string, LiveInventoryEntry> = {};
    for (const [code, item] of Object.entries(data)) {
      items[code] = { images: item.images, quantity: item.quantity, isExists: item.isExists };
    }

    return { items, count: Object.keys(items).length, ...(error ? { error } : {}) };
  },
);
