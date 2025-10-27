<?php

namespace App\Exports;

use App\Models\Bill;
use Maatwebsite\Excel\Concerns\FromCollection;

class TransactionsExport implements FromCollection
{
    protected $status;
    protected $start;
    protected $end;

    public function __construct($status = 'ALL', $start = null, $end = null)
    {
        $this->status = $status;
        $this->start = $start;
        $this->end = $end;
    }

    public function collection()
    {
        $query = Bill::with('customer', 'billDetails.product');

        if ($this->status && $this->status !== 'ALL') {
            $query->where('status', $this->status);
        }

        if ($this->start && $this->end) {
            $query->whereBetween('created_at', [
                $this->start . ' 00:00:00',
                $this->end . ' 23:59:59'
            ]);
        }

        return $query->get();
    }
}
