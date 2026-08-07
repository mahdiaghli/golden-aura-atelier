import { createFileRoute } from "@tanstack/react-router";
import { WalletPage } from "@/components/wallet/WalletPage";

export const Route = createFileRoute("/wallet")({
  component: WalletPage,
});