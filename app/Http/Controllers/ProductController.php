<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Ambil semua produk
    public function index()
    {
        $Products = Product::all();
        return Inertia::render('ProductsPage', ['products' => $Products]);
    }

    // Simpan produk baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'type'  => 'required|string|max:50',
        ]);

        $product = Product::create($validated);
        return redirect()->route('product.index')->with('success', 'Produk berhasil ditambahkan');
    }

    // Tampilkan produk berdasarkan ID
    public function show($id)
    {
        return Product::findOrFail($id);
    }

    // Update produk
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'type'  => 'required|string|max:50',
        ]);

        $product = Product::findOrFail($id);
        $product->update($validated);
        return redirect()->route('product.index')->with('success', 'Produk berhasil diperbarui!');
    }

    // Hapus produk
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('product.index')->with('success', 'Produk berhasil dihapus');
    }
}
