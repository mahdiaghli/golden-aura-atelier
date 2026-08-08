export type AdminEventType =
  | "review_submitted"
  | "order_created"
  | "order_status_updated"
  | "user_signed_up"
  | "user_signed_in"
  | "phone_code_requested"
  | "gold_order_created"
  | "gold_order_status_updated"
  | "custom_order_created"
  | "custom_order_status_updated"
  | "share_copied";

export type AdminEvent = {
  id: string;
  type: AdminEventType;
  title: string;
  entityType: "review" | "order" | "user" | "transaction" | "request" | "shipment" | "product";
  entityId?: string;
  createdAt: string;
  amount?: number;
  profit?: number;
  status?: string;
  details?: Record<string, string | number | boolean | null | undefined>;
};

const ADMIN_EVENTS_KEY = "aurum-admin-events-v1";

function readEvents(): AdminEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(ADMIN_EVENTS_KEY);
    return raw ? (JSON.parse(raw) as AdminEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: AdminEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_EVENTS_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent(`${ADMIN_EVENTS_KEY}:changed`));
}

export function listAdminEvents(): AdminEvent[] {
  return readEvents();
}

export function recordAdminEvent(
  input: Omit<AdminEvent, "id" | "createdAt">,
): AdminEvent {
  const nextEvent: AdminEvent = {
    ...input,
    id: `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  writeEvents([nextEvent, ...readEvents()]);
  return nextEvent;
}
