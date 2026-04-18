'use client';

import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, MoreVertical,
  Eye, Pencil, Trash2, AlertTriangle, User,
  Mail, ShoppingBag, Calendar, DollarSign, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
type Customer = {
  id: number;
  name: string;
  email: string;
  spent: number;
  orders: number;
  lastOrder: string;
  status: 'Active' | 'Inactive';
  joined: string;
  phone: string;
  orderHistory: {
    id: string;
    date: string;
    total: number;
    status: 'Delivered' | 'Shipped' | 'Pending' | 'Cancelled';
  }[];
};

// ── Mock data ──────────────────────────────────────────────────────────────────
const INITIAL_CUSTOMERS: Customer[] = [
  { id: 1,  name: 'Alex Johnson',   email: 'alex@example.com',    spent: 450.50, orders: 4, lastOrder: '2023-10-24', status: 'Active',   joined: '2022-03-14', phone: '+1 (555) 101-0001', orderHistory: [{ id: 'ADHD-5421', date: '2023-10-24', total: 130, status: 'Pending' }, { id: 'ADHD-5400', date: '2023-09-12', total: 65, status: 'Delivered' }, { id: 'ADHD-5385', date: '2023-08-01', total: 190, status: 'Delivered' }, { id: 'ADHD-5370', date: '2023-07-05', total: 65, status: 'Delivered' }] },
  { id: 2,  name: 'Jordan Smith',   email: 'jordan@example.com',  spent: 450.50, orders: 3, lastOrder: '2023-10-24', status: 'Active',   joined: '2022-05-22', phone: '+1 (555) 101-0002', orderHistory: [{ id: 'ADHD-5420', date: '2023-10-24', total: 65, status: 'Shipped' }, { id: 'ADHD-5390', date: '2023-09-15', total: 195, status: 'Delivered' }, { id: 'ADHD-5360', date: '2023-07-10', total: 190, status: 'Delivered' }] },
  { id: 3,  name: 'Casey Rivers',   email: 'casey@example.com',   spent:  65.00, orders: 2, lastOrder: '2023-10-24', status: 'Inactive', joined: '2023-01-08', phone: '+1 (555) 101-0003', orderHistory: [{ id: 'ADHD-5419', date: '2023-10-24', total: 352, status: 'Shipped' }, { id: 'ADHD-5350', date: '2023-06-28', total: 65, status: 'Cancelled' }] },
  { id: 4,  name: 'Morgan Lee',     email: 'morgan@example.com',  spent: 890.20, orders: 7, lastOrder: '2023-10-23', status: 'Active',   joined: '2021-11-30', phone: '+1 (555) 101-0004', orderHistory: [{ id: 'ADHD-5418', date: '2023-10-23', total: 125, status: 'Delivered' }, { id: 'ADHD-5395', date: '2023-09-20', total: 260, status: 'Delivered' }, { id: 'ADHD-5340', date: '2023-06-10', total: 505, status: 'Delivered' }] },
  { id: 5,  name: 'Olivia Smith',   email: 'olivia@example.com',  spent: 170.20, orders: 1, lastOrder: '2023-10-23', status: 'Active',   joined: '2023-04-19', phone: '+1 (555) 101-0005', orderHistory: [{ id: 'ADHD-5416', date: '2023-10-23', total: 65, status: 'Cancelled' }] },
  { id: 6,  name: 'Liam Johnson',   email: 'liam@example.com',    spent: 520.00, orders: 5, lastOrder: '2023-10-22', status: 'Active',   joined: '2022-08-05', phone: '+1 (555) 101-0006', orderHistory: [{ id: 'ADHD-5415', date: '2023-10-22', total: 260, status: 'Delivered' }, { id: 'ADHD-5380', date: '2023-08-12', total: 130, status: 'Delivered' }] },
  { id: 7,  name: 'Noah Williams',  email: 'noah@example.com',    spent:  95.00, orders: 1, lastOrder: '2023-10-21', status: 'Inactive', joined: '2023-06-01', phone: '+1 (555) 101-0007', orderHistory: [{ id: 'ADHD-5414', date: '2023-10-21', total: 95, status: 'Pending' }] },
  { id: 8,  name: 'Emma Brown',     email: 'emma@example.com',    spent: 780.00, orders: 6, lastOrder: '2023-10-20', status: 'Active',   joined: '2021-09-15', phone: '+1 (555) 101-0008', orderHistory: [{ id: 'ADHD-5413', date: '2023-10-20', total: 390, status: 'Shipped' }, { id: 'ADHD-5375', date: '2023-08-05', total: 390, status: 'Delivered' }] },
  { id: 9,  name: 'James Jones',    email: 'james@example.com',   spent:  45.00, orders: 1, lastOrder: '2023-10-19', status: 'Inactive', joined: '2023-07-22', phone: '+1 (555) 101-0009', orderHistory: [{ id: 'ADHD-5412', date: '2023-10-19', total: 45, status: 'Delivered' }] },
  { id: 10, name: 'Ava Martinez',   email: 'ava@example.com',     spent: 260.00, orders: 2, lastOrder: '2023-10-18', status: 'Active',   joined: '2022-12-10', phone: '+1 (555) 101-0010', orderHistory: [{ id: 'ADHD-5411', date: '2023-10-18', total: 130, status: 'Shipped' }, { id: 'ADHD-5365', date: '2023-07-14', total: 130, status: 'Delivered' }] },
  { id: 11, name: 'Isabella Davis', email: 'bella@example.com',   spent: 195.00, orders: 3, lastOrder: '2023-10-17', status: 'Active',   joined: '2023-02-28', phone: '+1 (555) 101-0011', orderHistory: [{ id: 'ADHD-5410', date: '2023-10-17', total: 65, status: 'Pending' }, { id: 'ADHD-5388', date: '2023-09-01', total: 65, status: 'Delivered' }] },
  { id: 12, name: 'Ethan Wilson',   email: 'ethan@example.com',   spent: 325.00, orders: 4, lastOrder: '2023-10-16', status: 'Active',   joined: '2022-06-18', phone: '+1 (555) 101-0012', orderHistory: [{ id: 'ADHD-5405', date: '2023-10-16', total: 130, status: 'Delivered' }, { id: 'ADHD-5370', date: '2023-07-20', total: 195, status: 'Delivered' }] },
];

const PAGE_SIZE = 10;

const ORDER_STATUS_STYLES: Record<string, string> = {
  Pending:   'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Shipped:   'bg-gray-100 text-gray-600 border border-gray-200',
  Delivered: 'bg-green-50 text-green-700 border border-green-200',
  Cancelled: 'bg-red-50 text-red-600 border border-red-200',
};

// ── Avatar initials ────────────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-indigo-500'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sizeClass = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-16 w-16 text-xl' }[size];
  return (
    <div className={cn("rounded-full flex items-center justify-center font-semibold text-white shrink-0", color, sizeClass)}>
      {initials}
    </div>
  );
}

// ── Kebab Menu ─────────────────────────────────────────────────────────────────
function CustomerMenu({ customer, onView, onEdit, onDelete }: {
  customer: Customer;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
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
          <button onClick={() => { setOpen(false); onEdit(); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-muted/50 transition-colors text-foreground">
            <Pencil className="h-4 w-4 text-muted-foreground" /> Edit Customer
          </button>
          <div className="my-1 border-t border-black/5" />
          <button onClick={() => { setOpen(false); onDelete(); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-500">
            <Trash2 className="h-4 w-4" /> Delete Customer
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [page, setPage] = useState(1);

  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);

  // edit form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const totalPages = Math.ceil(customers.length / PAGE_SIZE);
  const pageCustomers = customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openEdit(c: Customer) {
    setEditCustomer(c);
    setEditName(c.name);
    setEditEmail(c.email);
    setEditPhone(c.phone);
  }

  function saveEdit() {
    if (!editCustomer) return;
    setCustomers(prev => prev.map(c =>
      c.id === editCustomer.id ? { ...c, name: editName, email: editEmail, phone: editPhone } : c
    ));
    setEditCustomer(null);
  }

  function confirmDelete() {
    if (!deleteCustomer) return;
    setCustomers(prev => prev.filter(c => c.id !== deleteCustomer.id));
    setDeleteCustomer(null);
  }

  const Pagination = () => (
    <div className="flex items-center gap-1">
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
        className="h-8 w-8 flex items-center justify-center rounded-md border border-black/10 text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
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
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6 md:p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Customers</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of all customer details</p>
      </div>

      {/* ── Mobile cards ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {pageCustomers.map(c => (
          <div key={c.id} className="rounded-xl border border-black/5 bg-white shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={c.name} size="sm" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                  c.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200')}>
                  {c.status}
                </span>
                <CustomerMenu customer={c} onView={() => setViewCustomer(c)} onEdit={() => openEdit(c)} onDelete={() => setDeleteCustomer(c)} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="font-semibold text-foreground">${c.spent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="text-foreground">{c.orders}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Order</p>
                <p className="text-foreground">{c.lastOrder}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-primary">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, customers.length)} of {customers.length}</p>
          <Pagination />
        </div>
      </div>

      {/* ── Desktop table ─────────────────────────────────────────────── */}
      <div className="hidden md:block rounded-xl border border-black/5 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-muted/20">
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">File Name</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Registration</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Spent</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Orders</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Last Order</th>
              <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {pageCustomers.map(c => (
              <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} size="sm" />
                    <div>
                      <button
                        onClick={() => setViewCustomer(c)}
                        className="font-medium text-foreground hover:text-[#3B82F6] hover:underline underline-offset-2 transition-colors text-sm"
                      >
                        {c.name}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-2.5 whitespace-nowrap text-muted-foreground">{c.email}</td>
                <td className="px-5 py-2.5 whitespace-nowrap font-medium text-foreground">${c.spent.toFixed(2)}</td>
                <td className="px-5 py-2.5 whitespace-nowrap text-muted-foreground">{c.orders}</td>
                <td className="px-5 py-2.5 whitespace-nowrap text-muted-foreground">{c.lastOrder}</td>
                <td className="px-5 py-2.5 whitespace-nowrap">
                  <CustomerMenu customer={c} onView={() => setViewCustomer(c)} onEdit={() => openEdit(c)} onDelete={() => setDeleteCustomer(c)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-black/5 px-5 py-3">
          <p className="text-xs text-primary">Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, customers.length)} of {customers.length} customers</p>
          <Pagination />
        </div>
      </div>

      {/* ══ VIEW DETAILS MODAL ═══════════════════════════════════════════════ */}
      <Dialog open={!!viewCustomer} onOpenChange={o => !o && setViewCustomer(null)}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-xl p-0 gap-0 overflow-hidden rounded-2xl" showCloseButton={false}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-black/5">
            <DialogTitle className="text-xl font-semibold">Customer Details</DialogTitle>
          </DialogHeader>

          {viewCustomer && (
            <div className="overflow-y-auto max-h-[70vh]">
              {/* Profile header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 border-b border-black/5">
                <Avatar name={viewCustomer.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{viewCustomer.name}</h3>
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      viewCustomer.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200')}>
                      {viewCustomer.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{viewCustomer.email}</p>
                  <p className="text-sm text-muted-foreground">{viewCustomer.phone}</p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 divide-x divide-black/5 border-b border-black/5">
                {[
                  { label: 'Total Spent', value: `$${viewCustomer.spent.toFixed(2)}`, icon: DollarSign },
                  { label: 'Total Orders', value: viewCustomer.orders, icon: ShoppingBag },
                  { label: 'Member Since', value: viewCustomer.joined, icon: Calendar },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex flex-col items-center gap-1 py-2.5 px-3 text-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-semibold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Order history */}
              <div className="px-6 py-2.5">
                <h4 className="text-sm font-semibold mb-3">Order History</h4>
                <div className="rounded-xl border border-black/8 overflow-hidden divide-y divide-black/5">
                  {viewCustomer.orderHistory.map(o => (
                    <div key={o.id} className="flex items-center justify-between px-4 py-3 gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", ORDER_STATUS_STYLES[o.status])}>
                          {o.status}
                        </span>
                        <span className="text-sm font-semibold text-foreground">${o.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-black/5 px-6 py-2.5 flex justify-end">
            <Button variant="outline" onClick={() => setViewCustomer(null)} className="h-10 px-6 rounded-xl">Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ EDIT CUSTOMER MODAL ══════════════════════════════════════════════ */}
      <Dialog open={!!editCustomer} onOpenChange={o => !o && setEditCustomer(null)}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl" showCloseButton={false}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-black/5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-500">
                <Pencil className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-[#3B82F6]">Edit Customer</DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Update customer information</p>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="editCustName">Full Name</Label>
              <Input id="editCustName" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editCustEmail">Email Address</Label>
              <Input id="editCustEmail" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editCustPhone">Phone Number</Label>
              <Input id="editCustPhone" type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 border-t border-black/5 px-6 py-2.5">
            <Button variant="outline" onClick={() => setEditCustomer(null)} className="w-full sm:w-auto h-10 px-6 rounded-xl">Cancel</Button>
            <Button onClick={saveEdit} className="w-full sm:w-auto h-10 px-6 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ DELETE CONFIRMATION MODAL ════════════════════════════════════════ */}
      <Dialog open={!!deleteCustomer} onOpenChange={o => !o && setDeleteCustomer(null)}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl" showCloseButton={false}>
          <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-100">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Delete Customer?</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-medium text-foreground">&ldquo;{deleteCustomer?.name}&rdquo;</span>?<br />
                All their data and order history will be permanently removed.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-black/5 px-8 py-5">
            <Button onClick={confirmDelete} className="w-full h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium">Yes, Delete</Button>
            <Button variant="outline" onClick={() => setDeleteCustomer(null)} className="w-full h-11 rounded-xl font-medium">Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
