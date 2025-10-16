import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Users, Package, ShoppingCart } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ customerId: "", productId: "", quantity: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchBills();
  }, []);

  const fetchData = async () => {
    const custRes = await api.get("/customers");
    const prodRes = await api.get("/products");
    setCustomers(custRes.data || []);
    setProducts(prodRes.data || []);
  };

  const fetchBills = async () => {
    try {
      const billRes = await api.get("/bills");
      setTransactions(billRes.data || []);
    } catch (err) {
      console.error("Gagal ambil transaksi:", err);
    }
  };

  // Konfirmasi pembayaran (pindah nanti ke detail page)
  const handleConfirmPayment = async (billId, amount) => {
    try {
      const res = await api.post(`/bills/${billId}/confirm-payment`, { amount });
      setSelectedBill(res.data.bill);
      fetchBills();
    } catch (err) {
      alert("❌ Gagal konfirmasi pembayaran");
    }
  };

  const handleSaveCart = async () => {
    if (cart.length === 0) return alert("Keranjang masih kosong!");

    const user = JSON.parse(localStorage.getItem("user"));
    const billId = `bill-${Date.now()}`;

    const payload = {
      id: billId,
      customerId: form.customerId,
      userId: String(user.id),
      billDetails: cart.map((item, index) => ({
        id: `detail-${Date.now()}-${index}`,
        qty: item.qty,
        price: item.price,
        product: item,
      })),
    };

    try {
      await api.post("/bills", payload);
      setForm({ customerId: "", productId: "", quantity: 1 });
      setCart([]);
      setIsModalOpen(false);
      fetchBills();
    } catch (err) {
      console.error("Gagal menyimpan transaksi:", err);
      alert("❌ Gagal menyimpan transaksi");
    }
  };

  const grouped = transactions.reduce((acc, trx) => {
    const id = trx.customer.id;
    if (!acc[id]) {
      acc[id] = { customer: trx.customer, count: 1, bills: [trx] };
    } else {
      acc[id].count++;
      acc[id].bills.push(trx);
    }
    return acc;
  }, {});
  const groupedArray = Object.values(grouped);

  return (
    <div className="flex-1 bg-gray-100 min-h-screen p-6">
      {/* Card utama */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-blue-700">🧾 Manajemen Transaksi</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            ➕ Tambah Transaksi
          </button>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pelanggan</p>
              <h3 className="text-xl font-bold text-gray-800">{customers.length}</h3>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Produk</p>
              <h3 className="text-xl font-bold text-gray-800">{products.length}</h3>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Transaksi</p>
              <h3 className="text-xl font-bold text-gray-800">{transactions.length}</h3>
            </div>
          </div>
        </div>

        {/* Tabel Transaksi */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border rounded-lg overflow-hidden">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">Kode Pelanggan</th>
                <th className="px-4 py-2 text-left">Nama Pelanggan</th>
                <th className="px-4 py-2 text-center">Jumlah Transaksi</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {groupedArray.length > 0 ? (
                groupedArray.map(({ customer, count, bills }) => (
                  <tr key={customer.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2 font-mono">{customer.id}</td>
                    <td className="px-4 py-2">{customer.name}</td>
                    <td className="px-4 py-2 text-center">{count}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => navigate(`/bills/${bills[0].id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500 italic">
                    Belum ada transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Transaksi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-5xl relative animate-fadeIn">
            {/* Tombol close */}
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl transition"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            {/* Header biru */}
            <div className="bg-blue-600 text-white rounded-xl p-4 mb-6 shadow-md">
              <h3 className="text-xl font-semibold text-center tracking-wide">
                🧾 Form Tambah Transaksi
              </h3>
            </div>

            {/* Grid dua card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card kiri - Form Input */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <h4 className="font-semibold text-lg mb-4 text-blue-700">
                  🧍 Data Transaksi
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Pelanggan
                    </label>
                    <select
                      name="customerId"
                      value={form.customerId}
                      onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                      required
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="">-- Pilih Pelanggan --</option>
                      {customers.map((cust) => (
                        <option key={cust.id} value={cust.id}>
                          {cust.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Produk
                    </label>
                    <select
                      name="productId"
                      value={form.productId}
                      onChange={(e) => setForm({ ...form, productId: e.target.value })}
                      required
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300"
                    >
                      <option value="">-- Pilih Produk --</option>
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} - Rp{prod.price.toLocaleString("id-ID")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Jumlah
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      required
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const selectedProduct = products.find((p) => p.id === form.productId);
                      if (!selectedProduct) return alert("Pilih produk terlebih dahulu!");
                      const newItem = {
                        ...selectedProduct,
                        qty: Number(form.quantity),
                        subtotal: selectedProduct.price * Number(form.quantity),
                      };
                      setCart((prev) => [...prev, newItem]);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold shadow transition"
                  >
                    ➕ Tambah ke Keranjang
                  </button>
                </div>
              </div>

              {/* Card kanan - Keranjang Belanja */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <h4 className="font-semibold text-lg mb-4 text-gray-700">
                  🛒 Keranjang Belanja
                </h4>

                {cart.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border rounded-lg overflow-hidden">
                      <thead className="bg-gray-100 text-gray-800">
                        <tr>
                          <th className="px-3 py-2 text-left">Produk</th>
                          <th className="px-3 py-2 text-center">Qty</th>
                          <th className="px-3 py-2 text-right">Subtotal</th>
                          <th className="px-3 py-2 text-center">❌</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, i) => (
                          <tr key={i} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-1">{item.name}</td>
                            <td className="px-3 py-1 text-center">{item.qty}</td>
                            <td className="px-3 py-1 text-right">
                              Rp {item.subtotal.toLocaleString("id-ID")}
                            </td>
                            <td className="px-3 py-1 text-center">
                              <button
                                onClick={() =>
                                  setCart((prev) => prev.filter((_, idx) => idx !== i))
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-between mt-4 font-semibold text-gray-700">
                      <span>Total:</span>
                      <span>
                        Rp{" "}
                        {cart
                          .reduce((sum, item) => sum + item.subtotal, 0)
                          .toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      onClick={handleSaveCart}
                      className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold shadow transition"
                    >
                      💾 Simpan Transaksi
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-center mt-12">
                    Keranjang masih kosong.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
