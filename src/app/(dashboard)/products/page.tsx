'use client';

import React, { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Box, UploadCloud, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────────────────
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  inventory: number;
  image: string;
  variants: { size: string; stock: number }[];
};

type StatusType = 'In Stock' | 'Out of Stock';

// ── Mock Data ────────────────────────────────────────────────────────────────
const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=96&h=96&fit=crop',
  'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=96&h=96&fit=crop',
];

const INITIAL_PRODUCTS: Product[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: 'ADHD T shirt',
  category: 'T-Shirt',
  price: 65,
  inventory: i % 3 === 2 ? 0 : 42,
  image: PRODUCT_IMAGES[i % PRODUCT_IMAGES.length],
  variants: [
    { size: 'S', stock: i % 3 === 2 ? 0 : 10 },
    { size: 'M', stock: i % 3 === 2 ? 0 : 15 },
    { size: 'L', stock: i % 3 === 2 ? 0 : 12 },
    { size: 'XL', stock: i % 3 === 2 ? 0 : 5 },
  ],
}));

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [page, setPage] = useState(1);

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Add modal state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit modal local state
  const [editPrice, setEditPrice] = useState('');
  const [editStatus, setEditStatus] = useState<StatusType>('In Stock');
  const [editVariants, setEditVariants] = useState<{ size: string; stock: number }[]>([]);
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const editFileRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const pageProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openEdit(p: Product) {
    setEditProduct(p);
    setEditPrice(String(p.price));
    setEditStatus(p.inventory > 0 ? 'In Stock' : 'Out of Stock');
    setEditVariants(p.variants.map(v => ({ ...v })));
    setEditImagePreview(p.image);
  }

  function saveEdit() {
    if (!editProduct) return;
    setProducts(prev =>
      prev.map(p =>
        p.id === editProduct.id
          ? {
              ...p,
              price: Number(editPrice) || p.price,
              inventory: editVariants.reduce((s, v) => s + v.stock, 0),
              variants: editVariants,
              image: editImagePreview || p.image,
            }
          : p
      )
    );
    setEditProduct(null);
  }

  function handleEditImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setEditImagePreview(URL.createObjectURL(file));
  }

  function confirmDelete() {
    if (!deleteProduct) return;
    setProducts(prev => prev.filter(p => p.id !== deleteProduct.id));
    setDeleteProduct(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6 md:p-8">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of all products and their current inventory status
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="self-start sm:self-auto bg-[#3B82F6] hover:bg-[#2563EB] text-white h-10 px-5 gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-black/5 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-muted/30">
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Price</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Inventory</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3.5 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {pageProducts.map((p) => {
                const inStock = p.inventory > 0;
                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-black/5 bg-slate-100">
                          <img src={p.image} alt={p.name} className="h-10 w-10 object-cover" />
                        </div>
                        <span className="font-medium text-foreground">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{p.category}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-foreground">${p.price}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{p.inventory} in stock</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                        inStock
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      )}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="h-8 w-8 flex items-center justify-center rounded-md border border-black/10 text-muted-foreground hover:text-foreground hover:border-black/20 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteProduct(p)}
                          className="h-8 w-8 flex items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-black/5 px-5 py-3">
          <p className="text-xs text-primary">
            Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, products.length)} of {products.length} products
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-black/10 text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                  page === p
                    ? "bg-[#3B82F6] text-white"
                    : "border border-black/10 text-muted-foreground hover:bg-muted/50"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-black/10 text-muted-foreground hover:bg-muted/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ══ ADD PRODUCT MODAL ══════════════════════════════════════════════════ */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-xl p-0 gap-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-500">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-[#3B82F6]">Add New Product</DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Fill in the details for add new product</p>
              </div>
            </div>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-5 overflow-y-auto max-h-[65vh]">
            <h4 className="text-sm font-semibold">Product Details</h4>
            <div className="space-y-1.5">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" placeholder="e.g., premium tshirt" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="addCategory">Category</Label>
                <Input id="addCategory" placeholder="e.g., t-shirt" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addPrice">Price</Label>
                <Input id="addPrice" placeholder="$422" type="number" min={0} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="addStock">Stock</Label>
                <Input id="addStock" placeholder="83" type="number" min={0} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addSize">Available size</Label>
                <Input id="addSize" placeholder="S" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product Image</Label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full sm:w-48 h-32 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 text-muted-foreground hover:border-primary/40 hover:bg-primary/2 transition-colors overflow-hidden"
              >
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  : <><UploadCloud className="h-5 w-5" /><span className="text-xs">Add product image</span></>
                }
              </button>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-black/5 px-6 py-4">
            <Button variant="outline" onClick={() => setAddOpen(false)} className="w-full sm:w-auto h-10 px-6 rounded-lg">Cancel</Button>
            <Button onClick={() => setAddOpen(false)} className="w-full sm:w-auto h-10 px-6 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white">Add Product</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ EDIT PRODUCT MODAL ════════════════════════════════════════════════ */}
      <Dialog open={!!editProduct} onOpenChange={(o) => !o && setEditProduct(null)}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-black/5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-500">
                <Pencil className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-[#3B82F6]">Edit Product</DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Update status, price and inventory variants</p>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-5 space-y-6 overflow-y-auto max-h-[65vh]">
            {/* Price + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="editPrice">Price ($)</Label>
                <Input
                  id="editPrice"
                  type="number"
                  min={0}
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <div className="flex gap-2 pt-1">
                  {(['In Stock', 'Out of Stock'] as StatusType[]).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditStatus(s)}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                        editStatus === s
                          ? s === 'In Stock'
                            ? "bg-amber-50 border-amber-300 text-amber-700"
                            : "bg-red-50 border-red-300 text-red-600"
                          : "border-black/10 text-muted-foreground hover:bg-muted/40"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory Variants */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Inventory by Variant</Label>
              <div className="rounded-xl border border-black/8 overflow-hidden divide-y divide-black/5">
                <div className="grid grid-cols-2 bg-muted/40 px-4 py-2.5">
                  <span className="text-xs font-medium text-muted-foreground">Size</span>
                  <span className="text-xs font-medium text-muted-foreground">Stock</span>
                </div>
                {editVariants.map((v, idx) => (
                  <div key={v.size} className="grid grid-cols-2 items-center px-4 py-3 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 bg-white text-xs font-semibold">
                        {v.size}
                      </span>
                      <span className="text-sm text-foreground">{v.size} — {editProduct?.name}</span>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={e => {
                        const updated = [...editVariants];
                        updated[idx] = { ...updated[idx], stock: Number(e.target.value) };
                        setEditVariants(updated);
                      }}
                      className="h-9 w-28"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Image */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Product Image</Label>
              <input
                ref={editFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleEditImageChange}
              />
              <div className="flex items-end gap-4">
                {/* Current / preview */}
                <div className="h-24 w-24 shrink-0 rounded-xl overflow-hidden border border-black/10 bg-slate-100">
                  <img src={editImagePreview} alt="Product" className="h-full w-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => editFileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 h-24 flex-1 rounded-xl border-2 border-dashed border-black/15 text-muted-foreground hover:border-primary/40 hover:bg-primary/2 transition-colors text-xs"
                >
                  <UploadCloud className="h-5 w-5" />
                  Replace image
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-black/5 px-6 py-4">
            <Button variant="outline" onClick={() => setEditProduct(null)} className="w-full sm:w-auto h-10 px-6 rounded-lg">Cancel</Button>
            <Button onClick={saveEdit} className="w-full sm:w-auto h-10 px-6 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ DELETE CONFIRMATION MODAL ══════════════════════════════════════════ */}
      <Dialog open={!!deleteProduct} onOpenChange={(o) => !o && setDeleteProduct(null)}>
        <DialogContent
          className="w-full max-w-[calc(100%-2rem)] sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl"
          showCloseButton={false}
        >
          <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-100">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Delete Product?</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-medium text-foreground">&ldquo;{deleteProduct?.name}&rdquo;</span>?<br />
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-t border-black/5 px-8 py-5">
            <Button
              onClick={confirmDelete}
              className="w-full h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              Yes, Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteProduct(null)}
              className="w-full h-11 rounded-xl font-medium"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
