'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Eye, Truck, CheckCircle, XCircle, Calendar, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

type OrderItem = {
  name: string;
  image: string;
  size: string;
  color: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  orderItems: OrderItem[];
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ADHD-5421', customer: 'Alex Johnson',   date: '2023-10-24', items: 2, total: 130.00, status: 'Pending',
    trackingNumber: 'USPS9405511899223456789012',
    orderItems: [
      { name: 'ADHD T-Shirt', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=T', size: 'M', color: 'Blue', qty: 1, price: 65 },
      { name: 'Hyperfocus Hoodie', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=H', size: 'L', color: 'Purple', qty: 1, price: 65 },
    ],
  },
  {
    id: 'ADHD-5420', customer: 'Jordan Smith',   date: '2023-10-23', items: 1, total: 65.00, status: 'Shipped',
    trackingNumber: 'USPS9405511899223456781111',
    orderItems: [
      { name: 'ADHD T-Shirt', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=T', size: 'S', color: 'White', qty: 1, price: 65 },
    ],
  },
  {
    id: 'ADHD-5419', customer: 'Casey Rivers',   date: '2023-10-22', items: 5, total: 352.00, status: 'Shipped',
    trackingNumber: 'USPS9405511899223456782222',
    orderItems: [
      { name: 'Hyperfocus Hoodie', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=H', size: 'M', color: 'Purple', qty: 3, price: 195 },
      { name: 'ADHD T-Shirt', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=T', size: 'L', color: 'Black', qty: 2, price: 157 },
    ],
  },
  {
    id: 'ADHD-5418', customer: 'Morgan Lee',     date: '2023-10-21', items: 3, total: 125.00, status: 'Delivered',
    trackingNumber: 'USPS9405511899223456783333',
    orderItems: [
      { name: 'ADHD Planner', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=P', size: 'N/A', color: 'Teal', qty: 1, price: 45 },
      { name: 'ADHD T-Shirt', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=T', size: 'M', color: 'Blue', qty: 2, price: 80 },
    ],
  },
  {
    id: 'ADHD-5417', customer: 'Morgan Lee',     date: '2023-10-10', items: 2, total: 98.00, status: 'Delivered',
    trackingNumber: 'USPS9405511899223456784444',
    orderItems: [
      { name: 'Hyperfocus Hoodie', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=H', size: 'M', color: 'Green', qty: 1, price: 65 },
      { name: 'ADHD T-Shirt', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=T', size: 'S', color: 'White', qty: 1, price: 33 },
    ],
  },
  {
    id: 'ADHD-5416', customer: 'Olivia Smith',   date: '2023-10-09', items: 1, total: 65.00, status: 'Cancelled',
    trackingNumber: 'N/A',
    orderItems: [
      { name: 'ADHD T-Shirt', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=T', size: 'L', color: 'Black', qty: 1, price: 65 },
    ],
  },
  {
    id: 'ADHD-5415', customer: 'Liam Johnson',   date: '2023-10-08', items: 4, total: 260.00, status: 'Delivered',
    trackingNumber: 'USPS9405511899223456786666',
    orderItems: [
      { name: 'Hyperfocus Hoodie', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=H', size: 'XL', color: 'Purple', qty: 2, price: 130 },
      { name: 'ADHD T-Shirt', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=T', size: 'L', color: 'Blue', qty: 2, price: 130 },
    ],
  },
  {
    id: 'ADHD-5414', customer: 'Noah Williams',  date: '2023-10-07', items: 1, total: 95.00, status: 'Pending',
    trackingNumber: 'N/A',
    orderItems: [
      { name: 'ADHD Planner', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=P', size: 'N/A', color: 'Blue', qty: 1, price: 95 },
    ],
  },
  {
    id: 'ADHD-5413', customer: 'Emma Brown',     date: '2023-10-06', items: 6, total: 390.00, status: 'Shipped',
    trackingNumber: 'USPS9405511899223456787777',
    orderItems: [
      { name: 'Hyperfocus Hoodie', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=H', size: 'M', color: 'Black', qty: 6, price: 390 },
    ],
  },
  {
    id: 'ADHD-5412', customer: 'James Jones',    date: '2023-10-05', items: 1, total: 45.00, status: 'Delivered',
    trackingNumber: 'USPS9405511899223456788888',
    orderItems: [
      { name: 'ADHD Sticker Pack', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=S', size: 'N/A', color: 'Mixed', qty: 1, price: 45 },
    ],
  },
  {
    id: 'ADHD-5411', customer: 'Ava Martinez',   date: '2023-10-04', items: 2, total: 130.00, status: 'Shipped',
    trackingNumber: 'USPS9405511899223456789999',
    orderItems: [
      { name: 'ADHD T-Shirt', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=T', size: 'S', color: 'Pink', qty: 2, price: 130 },
    ],
  },
  {
    id: 'ADHD-5410', customer: 'Isabella Davis', date: '2023-10-03', items: 3, total: 195.00, status: 'Pending',
    trackingNumber: 'N/A',
    orderItems: [
      { name: 'Hyperfocus Hoodie', image: 'https://placehold.co/72x72/e2e8f0/94a3b8?text=H', size: 'L', color: 'Grey', qty: 3, price: 195 },
    ],
  },
];

const PAGE_SIZE = 10;

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending:   'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Shipped:   'bg-gray-100 text-gray-600 border border-gray-200',
  Delivered: 'bg-green-50 text-green-700 border border-green-200',
  Cancelled: 'bg-red-50 text-red-600 border border-red-200',
};

// ── Kebab Menu ─────────────────────────────────────────────────────────────────
function OrderMenu({
  order,
  onView,
  onMarkShipped,
  onMarkDelivered,
  onCancel,
}: {
  order: Order;
  onView: () => void;
  onMarkShipped: () => void;
  onMarkDelivered: () => void;
  onCancel: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-50 w-48 rounded-xl border border-black/5 bg-white shadow-lg py-1 text-sm">
          <button onClick={() => { setOpen(false); onView(); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-muted/50 transition-colors text-foreground">
            <Eye className="h-4 w-4 text-muted-foreground" /> View Details
          </button>
          {!isCancelled && order.status !== 'Delivered' && (
            <>
              <button onClick={() => { setOpen(false); onMarkShipped(); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-muted/50 transition-colors text-foreground">
                <Truck className="h-4 w-4 text-muted-foreground" /> Mark Shipped
              </button>
              <button onClick={() => { setOpen(false); onMarkDelivered(); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-muted/50 transition-colors text-foreground">
                <CheckCircle className="h-4 w-4 text-muted-foreground" /> Mark Delivered
              </button>
            </>
          )}
          {!isCancelled && (
            <>
              <div className="my-1 border-t border-black/5" />
              <button onClick={() => { setOpen(false); onCancel(); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-500">
                <XCircle className="h-4 w-4" /> Cancel Order
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [page, setPage] = useState(1);

  // Modal state
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ order: Order; action: 'shipped' | 'delivered' | 'cancel' } | null>(null);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);
  const pageOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function applyStatus(orderId: string, status: OrderStatus) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setConfirmModal(null);
  }

  const confirmConfig = confirmModal ? {
    shipped:   { title: 'Mark as Shipped?',   body: `Mark order ${confirmModal.order.id} as Shipped?`, btnLabel: 'Mark Shipped', btnClass: 'bg-blue-500 hover:bg-blue-600 text-white', icon: <Truck className="h-8 w-8 text-blue-500" />, iconBg: 'bg-blue-50 border-blue-100' },
    delivered: { title: 'Mark as Delivered?', body: `Confirm that order ${confirmModal.order.id} has been delivered?`, btnLabel: 'Mark Delivered', btnClass: 'bg-green-500 hover:bg-green-600 text-white', icon: <CheckCircle className="h-8 w-8 text-green-500" />, iconBg: 'bg-green-50 border-green-100' },
    cancel:    { title: 'Cancel Order?',      body: `Are you sure you want to cancel order ${confirmModal.order.id}? This action cannot be undone.`, btnLabel: 'Yes, Cancel', btnClass: 'bg-red-500 hover:bg-red-600 text-white', icon: <AlertTriangle className="h-8 w-8 text-red-500" />, iconBg: 'bg-red-50 border-red-100' },
  }[confirmModal.action] : null;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6 md:p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Orders</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of recent orders</p>
      </div>

      {/* ── Mobile card list (hidden on md+) ─────────────────────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {pageOrders.map((order) => (
          <div key={order.id} className="rounded-xl border border-black/5 bg-white shadow-sm p-4 space-y-3">
            {/* Top: Order ID + Status + Menu */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setViewOrder(order)}
                className="font-semibold text-[#3B82F6] hover:underline underline-offset-2 text-sm"
              >
                {order.id}
              </button>
              <div className="flex items-center gap-2">
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[order.status])}>
                  {order.status}
                </span>
                <OrderMenu
                  order={order}
                  onView={() => setViewOrder(order)}
                  onMarkShipped={() => setConfirmModal({ order, action: 'shipped' })}
                  onMarkDelivered={() => setConfirmModal({ order, action: 'delivered' })}
                  onCancel={() => setConfirmModal({ order, action: 'cancel' })}
                />
              </div>
            </div>
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium text-foreground">{order.customer}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-foreground">{order.date}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Items</p>
                <p className="text-foreground">{order.orderItems.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-foreground">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile pagination */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-primary">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, orders.length)} of {orders.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-black/10 text-muted-foreground disabled:opacity-40 disabled:pointer-events-none">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={cn("h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                  page === p ? "bg-[#3B82F6] text-white" : "border border-black/10 text-muted-foreground hover:bg-muted/50")}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-black/10 text-muted-foreground disabled:opacity-40 disabled:pointer-events-none">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop table (hidden on mobile) ─────────────────────────────── */}
      <div className="hidden md:block rounded-xl border border-black/5 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-muted/20">
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Order ID</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Date</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Item</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {pageOrders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-2.5 whitespace-nowrap">
                  <button onClick={() => setViewOrder(order)}
                    className="font-medium text-[#3B82F6] hover:text-[#2563EB] hover:underline underline-offset-2 transition-colors">
                    {order.id}
                  </button>
                </td>
                <td className="px-5 py-2.5 whitespace-nowrap text-foreground">{order.customer}</td>
                <td className="px-5 py-2.5 whitespace-nowrap text-muted-foreground">{order.date}</td>
                <td className="px-5 py-2.5 whitespace-nowrap text-muted-foreground">{order.orderItems.length}</td>
                <td className="px-5 py-2.5 whitespace-nowrap text-foreground">${order.total.toFixed(2)}</td>
                <td className="px-5 py-2.5 whitespace-nowrap">
                  <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", STATUS_STYLES[order.status])}>
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-2.5 whitespace-nowrap text-right">
                  <OrderMenu
                    order={order}
                    onView={() => setViewOrder(order)}
                    onMarkShipped={() => setConfirmModal({ order, action: 'shipped' })}
                    onMarkDelivered={() => setConfirmModal({ order, action: 'delivered' })}
                    onCancel={() => setConfirmModal({ order, action: 'cancel' })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Desktop pagination */}
        <div className="flex items-center justify-between border-t border-black/5 px-5 py-3">
          <p className="text-xs text-primary">
            Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, orders.length)} of {orders.length} orders
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-black/10 text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={cn("h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                  page === p ? "bg-[#3B82F6] text-white" : "border border-black/10 text-muted-foreground hover:bg-muted/50")}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-black/10 text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>


      {/* ══ VIEW DETAILS MODAL ═══════════════════════════════════════════════════ */}
      <Dialog open={!!viewOrder} onOpenChange={(o) => !o && setViewOrder(null)}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-xl p-0 gap-0 overflow-hidden rounded-2xl" showCloseButton={false}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-black/5">
            <DialogTitle className="text-xl font-semibold">Order History</DialogTitle>
          </DialogHeader>

          {viewOrder && (
            <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Order card */}
              <div className="rounded-xl border border-black/8 overflow-hidden">
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-2.5 border-b border-black/5">
                  <div>
                    <p className="font-semibold text-foreground">Order {viewOrder.id}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(viewOrder.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", STATUS_STYLES[viewOrder.status])}>
                      {viewOrder.status === 'Delivered' && <CheckCircle className="h-3.5 w-3.5" />}
                      {viewOrder.status === 'Shipped' && <Truck className="h-3.5 w-3.5" />}
                      {viewOrder.status}
                    </span>
                    <Button variant="outline" size="sm" className="h-8 px-4 rounded-full text-xs border-violet-300 text-violet-600 hover:bg-violet-50">
                      Track Order
                    </Button>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-black/5">
                  {viewOrder.orderItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 px-5 py-2.5">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-black/5 bg-slate-100">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Size: {item.size} • Color: {item.color} • Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-foreground shrink-0">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer: tracking + total */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-2.5 border-t border-black/5 bg-muted/10">
                  <p className="text-xs text-muted-foreground">
                    Tracking: <span className="font-mono">{viewOrder.trackingNumber}</span>
                  </p>
                  <p className="text-sm font-bold text-foreground">Total: ${viewOrder.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-black/5 px-6 py-2.5 flex justify-end">
            <Button variant="outline" onClick={() => setViewOrder(null)} className="h-10 px-6 rounded-xl">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ CONFIRM ACTION MODAL (Shipped / Delivered / Cancel) ════════════════ */}
      <Dialog open={!!confirmModal} onOpenChange={(o) => !o && setConfirmModal(null)}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl" showCloseButton={false}>
          {confirmModal && confirmConfig && (
            <>
              <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center gap-4">
                <div className={cn("flex h-16 w-16 items-center justify-center rounded-full border", confirmConfig.iconBg)}>
                  {confirmConfig.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{confirmConfig.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{confirmConfig.body}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-black/5 px-8 py-5">
                <Button
                  className={cn("w-full h-11 rounded-xl font-medium", confirmConfig.btnClass)}
                  onClick={() => applyStatus(
                    confirmModal.order.id,
                    confirmModal.action === 'shipped' ? 'Shipped' : confirmModal.action === 'delivered' ? 'Delivered' : 'Cancelled'
                  )}
                >
                  {confirmConfig.btnLabel}
                </Button>
                <Button variant="outline" className="w-full h-11 rounded-xl font-medium" onClick={() => setConfirmModal(null)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
