import { useEffect, useState } from "react";
import { Users, UserPlus, Activity } from "lucide-react";
import { useForm, usePage, router } from "@inertiajs/react";
import {route} from "ziggy-js";

export default function CustomersPage() {
  const {customers} = usePage().props;
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data, setData, post, put, delete: destroy, reset} = useForm ({
    name: "",
    phoneNumber: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
      if (editId) {
        router.put(route("customers.update",{customer: editId}), data, {
          onSuccess: () => {
            reset();
            setEditId(null);
            setIsModalOpen(false);
          },
        });
      } else {
        router.post(route("customers.store"), data, {
          onSuccess: () => {
            reset();
            setIsModalOpen(false);
          },
        });
      }
    };

  const handleEdit = (cust) => {
    setData({
      name: cust.name,
      phoneNumber: cust.phoneNumber,
      address: cust.address,
    });
    setEditId(cust.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus pelanggan ini?")) {
      router.delete(`/customers/${id}`);
    }
  };

  // Statistik dummy (nanti bisa dihubungkan ke API)
  const totalCustomers = customers.length;
  const newThisWeek = Math.floor(customers.length / 5); // contoh hitungan dummy
  const activeCustomers = Math.floor(customers.length / 2); // contoh hitungan dummy

  return (
    <div className="flex-1 bg-gray-100 min-h-screen p-6">
      {/* Card Utama */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-blue-700">
            👥 Manajemen Pelanggan
          </h2>
          <button
            onClick={() => {
              reset();
              setEditId(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            ➕ Tambah Pelanggan
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
              <h3 className="text-xl font-bold text-gray-800">{totalCustomers}</h3>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pelanggan Baru Minggu Ini</p>
              <h3 className="text-xl font-bold text-gray-800">{newThisWeek}</h3>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pelanggan Aktif</p>
              <h3 className="text-xl font-bold text-gray-800">{activeCustomers}</h3>
            </div>
          </div>
        </div>

        {/* Tabel Pelanggan */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm border rounded-lg overflow-hidden">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Nomor HP</th>
                <th className="px-4 py-2 text-left">Alamat</th>
                <th className="px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">{c.id}</td>
                    <td className="px-4 py-2">{c.name}</td>
                    <td className="px-4 py-2">{c.phoneNumber}</td>
                    <td className="px-4 py-2">{c.address}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Belum ada data pelanggan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">
              {editId ? "✏️ Edit Pelanggan" : "📝 Form Tambah Pelanggan"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData( "name", e.target.value )}
                  className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
                  placeholder="Nama Pelanggan"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Nomor HP
                </label>
                <input
                  type="text"
                  value={data.phoneNumber}
                  onChange={(e) =>
                    setData("phoneNumber", e.target.value )}
                  className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Alamat
                </label>
                <input
                  type="text"
                  value={data.address}
                  onChange={(e) =>
                    setData("address", e.target.value )}
                  className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
                  placeholder="Alamat lengkap"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editId ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
