<?php

use Illuminate\Http\Request;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;

Route::apiResource('produk', ProdukController::class);
Route::apiResource('customers', CustomerController::class);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});