<?php

use Illuminate\Http\Request;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;

Route::apiResource('products', ProductController::class);
Route::apiResource( 'customers', CustomerController::class);

Route::get('/reports/transactions', [ReportController::class, 'transactions']);
Route::get('/reports/customers', [ReportController::class, 'customers']);
Route::get('/reports/products', [ReportController::class, 'products']);
Route::get('/reports/transactions/export/pdf', [ReportController::class, 'exportTransactionsPdf']);
Route::get('/reports/transactions/export/excel', [ReportController::class, 'exportTransactionsExcel']);

Route::post('/bills/{id}/confirm-payment', [BillController::class, 'confirmPayment']);
Route::apiResource('users', UserController::class);
Route::get('/bills', [BillController::class, 'index']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/bills', [BillController::class, 'store']);
Route::put('/bills/{id}', [BillController::class, 'update']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});