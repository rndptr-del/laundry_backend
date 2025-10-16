import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, CreditCard } from "lucide-react";
import api from "../services/api";

export default function TransactionDetailPage() {
  const { id } = useParams();
  const [bills, setBills] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, [id]);

  const fetchBills = async () => {
    try {
      const res = await api.get("/bills");
      const allBills = Array.isArray(res.data) ? res.data : [];

      const selected = allBills.find((b) => String(b.id) === String(id));
      if (!selected) return;

      const customerBills = allBills.filter(
        (b) => b.customer?.id === selected.customer?.id
      );

      setCustomer(selected.customer);
      setBills(customerBills);
    } catch (err) {
      console.error("Gagal ambil data bills:", err);
    }
  };

  const handleConfirmPayment = async () => {
    const unpaidBill = bills.find((b) => b.status === "UNPAID");
    if (!unpaidBill) return alert("Semua transaksi sudah dibayar!");

    const totalAmount = unpaidBill.bill_details?.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    try {
      const res = await api.post(`/bills/${unpaidBill.id}/confirm-payment`, {
        amount: totalAmount,
      });
      setSelectedBill(res.data.bill);
      setIsReceiptOpen(true);
      fetchBills();
    } catch (err) {
      console.error("Gagal konfirmasi pembayaran:", err);
      alert("❌ Gagal konfirmasi pembayaran");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatCurrency = (val) =>
    `Rp ${Number(val || 0).toLocaleString("id-ID")},-`;

  const totalAll = bills.reduce(
    (acc, bill) =>
      acc +
      (bill.bill_details || []).reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      ),
    0
  );

  return (
    <div className="flex-1 bg-gray-100 min-h-screen p-6">
      {/* Card Utama */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Detail Transaksi Pelanggan
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow-sm"
          >
            ⬅️ Kembali
          </button>
        </div>

        {/* Info Pelanggan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Nama Pelanggan</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {customer?.name || "-"}
            </h3>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Jumlah Transaksi</p>
            <h3 className="text-lg font-semibold text-gray-800">
              {bills.length} Transaksi
            </h3>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Keseluruhan</p>
            <h3 className="text-lg font-semibold text-blue-700">
              {formatCurrency(totalAll)}
            </h3>
          </div>
        </div>

        {/* Tombol Konfirmasi */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleConfirmPayment}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
          >
            <CreditCard className="w-5 h-5" />
            Konfirmasi Pembayaran
          </button>
        </div>

        {/* Tabel transaksi */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="px-4 py-3 border">Kode Transaksi</th>
                <th className="px-4 py-3 border">PIC Transaksi</th>
                <th className="px-4 py-3 border">Tanggal</th>
                <th className="px-4 py-3 border">Paket Laundry</th>
                <th className="px-4 py-3 border text-center">Qty</th>
                <th className="px-4 py-3 border text-right">Total</th>
                <th className="px-4 py-3 border text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) =>
                (bill.bill_details || []).map((item, idx) => (
                  <tr
                    key={`${bill.id}-${idx}`}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-2 border">{bill.id}</td>
                    <td className="px-4 py-2 border text-center">
                      {bill.user?.name || "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatDate(bill.created_at)}
                    </td>
                    <td className="px-4 py-2 border">{item.product?.name}</td>
                    <td className="px-4 py-2 border text-center">
                      {item.qty} Kg
                    </td>
                    <td className="px-4 py-2 border text-right">
                      {formatCurrency(item.price * item.qty)}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {bill.status === "PAID" ? (
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                          Lunas
                        </span>
                      ) : (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                          Belum Lunas
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Struk */}
      {isReceiptOpen && selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[380px]">
            <h2 className="text-center font-bold text-lg mb-2 text-blue-700">
              🧺 Laundry Bersih
            </h2>
            <p className="text-sm text-center mb-4 text-gray-600">
              Struk Pembayaran #{selectedBill.id}
            </p>

            <div className="text-sm mb-2">
              <p><strong>Customer:</strong> {selectedBill.customer?.name}</p>
              <p>
                <strong>Tanggal:</strong>{" "}
                {new Date(selectedBill.payment_date).toLocaleString("id-ID")}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-semibold">LUNAS</span>
              </p>
            </div>

            <table className="w-full text-xs border-t border-b my-3">
              <thead>
                <tr>
                  <th className="text-left">Produk</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Harga</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.bill_details?.map((d) => (
                  <tr key={d.id}>
                    <td>{d.product?.name}</td>
                    <td className="text-right">{d.qty}</td>
                    <td className="text-right">
                      Rp {d.price.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right font-bold text-sm mt-2">
              Total: Rp{" "}
              {selectedBill.bill_details
                ?.reduce((sum, d) => sum + d.qty * d.price, 0)
                .toLocaleString("id-ID")}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsReceiptOpen(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
