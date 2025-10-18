<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ✅ Halaman utama (Dashboard)
Route::get('/', function () {
    return Inertia::render('Dashboard', [
        'title' => 'Dashboard Laundry',
    ]);
});

// ✅ Halaman Login
Route::get('/login', function () {
    return Inertia::render('LoginPage', [
        'title' => 'Login',
    ]);
});

// ✅ Halaman Register
Route::get('/register', function () {
    return Inertia::render('RegisterPages', [
        'title' => 'Register',
    ]);
});

// ✅ Halaman Produk
Route::get('/products', function () {
    return Inertia::render('ProductsPage', [
        'title' => 'Manajemen Produk',
    ]);
});

// ✅ Halaman Pelanggan
Route::resource('customers', CustomerController::class);
Route::get('/products', [ProductController::class, 'index'])->name('product.index');
Route::post('/products', [ProductController::class, 'store'])->name('product.store');
Route::put('/products/{id}', [ProductController::class, 'update'])->name('product.update');
Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('product.destroy');

// ✅ Halaman Transaksi
Route::get('/transactions', function () {
    return Inertia::render('TransactionsPage', [
        'title' => 'Daftar Transaksi',
    ]);
});

// ✅ Halaman Detail Transaksi
Route::get('/bills/{id}', function ($id) {
    return Inertia::render('TransactionDetailPage', [
        'title' => 'Detail Transaksi',
        'id' => $id,
    ]);
});
