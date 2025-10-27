<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\Product;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TransactionsExport;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    /**
     * 🔹 Ambil semua transaksi (dengan optional filter tanggal dan status)
     */
    public function transactions(Request $request)
    {
        $query = Bill::with(['customer', 'billDetails.product']);

        // Filter status jika dikirim dari frontend
        if ($request->has('status') && $request->status !== 'ALL') {
            $query->where('status', $request->status);
        }

        // Filter tanggal jika dikirim
        if ($request->has('start') && $request->has('end')) {
            $query->whereBetween('created_at', [
                $request->start . ' 00:00:00',
                $request->end . ' 23:59:59'
            ]);
        }

        $data = $query->get();
        return response()->json($data);
    }

    /**
     * 🔹 Data pelanggan (opsional, untuk laporan pelanggan)
     */
    public function customers()
    {
        return response()->json(\App\Models\Customers::all());
    }

    /**
     * 🔹 Data produk (opsional)
     */
    public function products()
    {
        return response()->json(Product::all());
    }

    /**
     * 🔹 Export PDF dengan filter (status & tanggal)
     */
    public function exportTransactionsPdf(Request $request)
    {
        $query = Bill::with('customer', 'billDetails.product');

        if ($request->has('status') && $request->status !== 'ALL') {
            $query->where('status', $request->status);
        }

        if ($request->has('start') && $request->has('end')) {
            $query->whereBetween('created_at', [
                $request->start . ' 00:00:00',
                $request->end . ' 23:59:59'
            ]);
        }

        $transactions = $query->get();

        $pdf = PDF::loadView('reports.transactions', compact('transactions'))
            ->setPaper('a4', 'portrait');

        return $pdf->download('transactions_report.pdf');
    }

    /**
     * 🔹 Export Excel dengan filter (status & tanggal)
     */
    public function exportTransactionsExcel(Request $request)
    {
        $status = $request->status ?? 'ALL';
        $start = $request->start ?? null;
        $end = $request->end ?? null;

        return Excel::download(new TransactionsExport($status, $start, $end), 'transactions_report.xlsx');
    }
}
