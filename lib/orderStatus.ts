import { TOrderStatus, TPaymentStatus } from "@/types";


export function getOrderStatusStyle(status: TOrderStatus) {
    const map: Record<TOrderStatus, { label: string; className: string }> = {
        placed: { label: "Placed", className: "bg-muted/10 text-muted" },
        confirmed: { label: "Confirmed", className: "bg-primary/10 text-primary" },
        shipped: { label: "Shipped", className: "bg-warning/10 text-warning" },
        delivered: { label: "Delivered", className: "bg-success/10 text-success" },
        cancelled: { label: "Cancelled", className: "bg-error/10 text-error" },
    }
    return map[status]
}

export function getPaymentStatusStyle(status: TPaymentStatus) {
    const map: Record<TPaymentStatus, { label: string; className: string }> = {
        pending: { label: "Payment Pending", className: "bg-warning/10 text-warning" },
        paid: { label: "Paid", className: "bg-success/10 text-success" },
        failed: { label: "Payment Failed", className: "bg-error/10 text-error" },
    }
    return map[status]
}