import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X, Package, BarChart3 } from "lucide-react";
import api from "../services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", type: "kg" });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Gagal fetch produk:", err);
      setProducts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: form.name,
        price: parseInt(form.price, 10),
        type: form.type,
      };

      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setForm({ name: "", price: "", type: "kg" });
      setEditId(null);
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Gagal menyimpan produk:", err.response?.data || err.message);
      alert("Gagal menyimpan produk.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (produk) => {
    setForm({
      name: produk.name,
      price: produk.price,
      type: produk.type || "kg",
    });
    setEditId(produk.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert("Gagal menghapus produk.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hitung statistik
  const totalProduk = products.length;
  const totalHarga = products.reduce((acc, p) => acc + Number(p.price), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Total Produk</h4>
            <p className="text-lg font-bold">{totalProduk}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
          <div className="bg-green-100 text-green-600 p-3 rounded-lg">
            <BarChart3 size={24} />
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Total Harga</h4>
            <p className="text-lg font-bold">
              Rp {totalHarga.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-3">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
            <Plus size={24} />
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Tambah Produk</h4>
            <button
              onClick={() => {
                setForm({ name: "", price: "", type: "kg" });
                setEditId(null);
                setIsModalOpen(true);
              }}
              className="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-lg shadow transition"
            >
              Tambah Baru
            </button>
          </div>
        </div>
      </div>

      {/* Card Utama */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Manajemen Produk
              </h2>
              <p className="text-sm text-gray-500">
                Kelola daftar produk laundry dengan lebih mudah
              </p>
            </div>
          </div>
        </div>

        {/* Tabel Produk */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-blue-50 text-gray-700 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nama Produk</th>
                <th className="px-4 py-3 text-left">Harga</th>
                <th className="px-4 py-3 text-left">Satuan</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-t hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-blue-700 font-semibold">
                      Rp {Number(p.price).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          p.type === "kg"
                            ? "bg-blue-100 text-blue-700"
                            : p.type === "pcs"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {p.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    Belum ada produk tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative transform scale-95 animate-zoomIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              {editId ? "✏️ Edit Produk" : "➕ Tambah Produk"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nama Produk
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Harga
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Satuan
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="kg">Kg</option>
                  <option value="pcs">Pcs</option>
                  <option value="set">Set</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
                >
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
