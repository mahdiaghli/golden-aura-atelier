import { getStoredUsers } from "./auth";
import { listAdminEvents } from "./admin-events";
import { getOrders } from "./orders";
import { listCustomOrders, listGoldOrders } from "./requests";
import { listReviews } from "./reviews";

export function getAdminSnapshot() {
  const orders = getOrders();
  const goldOrders = listGoldOrders();
  const customOrders = listCustomOrders();
  const reviews = listReviews();
  const users = getStoredUsers();
  const events = listAdminEvents();

  const orderRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const orderProfit = Math.round(
    orders.reduce(
      (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.price * 0.07, 0),
      0,
    ),
  );
  const goldRevenue = goldOrders.reduce((sum, order) => sum + order.amount, 0);
  const shipmentCount =
    orders.filter((order) => order.status === "In transit" || order.status === "Delivered").length +
    goldOrders.filter((order) => order.status === "shipped" || order.status === "done").length;

  return {
    orders,
    goldOrders,
    customOrders,
    reviews,
    users,
    events,
    totals: {
      orders: orders.length,
      requests: goldOrders.length + customOrders.length,
      users: users.length,
      reviews: reviews.length,
      shipments: shipmentCount,
      revenue: orderRevenue + goldRevenue,
      profit: orderProfit,
    },
  };
}

export const ADMIN_PANEL_EVENTS = [
  "aurum-orders-v1:changed",
  "aurum-gold-orders-v1:changed",
  "aurum-custom-orders-v1:changed",
  "aurum-product-reviews-v1:changed",
  "aurum-admin-events-v1:changed",
  "aurum-users:changed",
] as const;
