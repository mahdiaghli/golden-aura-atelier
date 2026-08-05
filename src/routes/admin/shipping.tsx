import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/shipping")({
  component: AdminShippingPage,
});

type ShipRow = {
  id: string;
  user: string;
  address: string;
  method: string;
  status: "ready" | "packed" | "shipped";
};

const INITIAL: ShipRow[] = [
  {
    id: "ORD-1035",
    user: "سارا محمدی",
    address: "مشهد، بین حر ۷ و ۹…",
    method: "تیپاکس",
    status: "ready",
  },
  {
    id: "ORD-1031",
    user: "علی رضایی",
    address: "تهران، …",
    method: "پست",
    status: "packed",
  },
];

function AdminShippingPage() {
  const [rows, setRows] = useState(INITIAL);

  const advance = (id: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (r.status === "ready") return { ...r, status: "packed" };
        if (r.status === "packed") return { ...r, status: "shipped" };
        return r;
      }),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Shipping</p>
        <h1 className="mt-1 font-serif text-3xl">مدیریت ارسال</h1>
      </div>

      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-4 rounded-2xl border border-onyx/10 bg-parchment/90 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-mono text-xs text-onyx/45">{r.id}</p>
              <p className="mt-1 font-medium">{r.user}</p>
              <p className="mt-1 text-sm text-onyx/55">{r.address}</p>
              <p className="mt-1 text-xs text-onyx/40">روش: {r.method}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-onyx/5 px-3 py-1 text-[11px]">
                {r.status === "ready" ? "آماده بسته‌بندی" : r.status === "packed" ? "بسته‌بندی‌شده" : "ارسال‌شده"}
              </span>
              {r.status !== "shipped" && (
                <Button type="button" className="h-9 rounded-xl text-xs" onClick={() => advance(r.id)}>
                  {r.status === "ready" ? "بسته‌بندی شد" : "علامت ارسال"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}