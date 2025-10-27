<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Laporan Transaksi Laundry</title>
  <style>
    body { font-family: sans-serif; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #000; padding: 6px; text-align: left; }
  </style>
</head>
<body>
  <h2>Laporan Transaksi Laundry</h2>
  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Pelanggan</th>
        <th>Total</th>
        <th>Status</th>
        <th>Tanggal</th>
      </tr>
    </thead>
    <tbody>
      @foreach($transactions as $t)
        <tr>
          <td>{{ $loop->iteration }}</td>
          <td>{{ $t->customer->name }}</td>
          <td>{{ number_format($t->total_amount, 0, ',', '.') }}</td>
          <td>{{ $t->status }}</td>
          <td>{{ $t->created_at->format('d-m-Y') }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>
</body>
</html>
