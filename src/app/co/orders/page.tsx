import { OrderListWithErrorBoundary } from "~/app/_components/global/errorBoundary";

export default function OrdersPage() {
  return <OrderListWithErrorBoundary pageSize={6} />;
}