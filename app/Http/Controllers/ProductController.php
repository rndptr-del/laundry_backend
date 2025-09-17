<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Ambil semua produk
    public function index()
    {
        return Product::all();
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

        return response()->json($product, 201);
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

        return response()->json($product, 200);
    }

    // Hapus produk
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(null, 204);
    }
}
