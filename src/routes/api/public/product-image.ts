import { createFileRoute } from "@tanstack/react-router";

// Proxies product photos from the accounting server (plain HTTP) so the
// storefront can display them over HTTPS without mixed-content blocking.
export const Route = createFileRoute("/api/public/product-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { isAllowedImageUrl } = await import("@/lib/zargar.server");
        const target = new URL(request.url).searchParams.get("u");

        if (!target || !isAllowedImageUrl(target)) {
          return new Response("Invalid image url", { status: 400 });
        }

        try {
          const upstream = await fetch(target, { signal: AbortSignal.timeout(15_000) });
          if (!upstream.ok || !upstream.body) {
            return new Response("Image unavailable", { status: 502 });
          }
          return new Response(upstream.body, {
            status: 200,
            headers: {
              "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
              "cache-control": "public, max-age=86400",
            },
          });
        } catch {
          return new Response("Image unavailable", { status: 502 });
        }
      },
    },
  },
});
