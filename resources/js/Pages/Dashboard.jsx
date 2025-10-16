import { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
  Home,
  ShoppingBag,
  Users,
  Receipt,
  LogOut,
  Menu,
  X,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalTransactions: 0,
    totalIncome: 0,
    doneOrders: 0,
    inProgress: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [weeklyIncome, setWeeklyIncome] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    router.visit("/login"); // Inertia navigation
  };

  const navLinks = [
    { href: "/", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/products", label: "Produk", icon: <ShoppingBag size={18} /> },
    { href: "/customers", label: "Pelanggan", icon: <Users size={18} /> },
    { href: "/transactions", label: "Transaksi", icon: <Receipt size={18} /> },
  ];

  // 🔹 Ambil data dari API Laravel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes, billRes] = await Promise.all([
          axios.get("http://localhost:8000/api/customers"),
          axios.get("http://localhost:8000/api/products"),
          axios.get("http://localhost:8000/api/bills"),
        ]);

        const customers = custRes.data.data || custRes.data;
        const products = prodRes.data.data || prodRes.data;
        const bills = billRes.data.data || billRes.data;

        // Hitung statistik
        const totalIncome = bills.reduce((sum, b) => sum + Number(b.total || 0), 0);
        const doneOrders = bills.filter((b) => b.status === "Selesai").length;
        const inProgress = bills.filter((b) => b.status === "Proses").length;

        // Ambil transaksi terbaru (maks 5)
        const recent = [...bills]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        // Buat data untuk grafik (kelompokkan berdasarkan hari)
        const grouped = bills.reduce((acc, bill) => {
          const date = new Date(bill.created_at).toLocaleDateString("id-ID", {
            weekday: "short",
          });
          acc[date] = (acc[date] || 0) + Number(bill.total || 0);
          return acc;
        }, {});

        const weeklyData = Object.entries(grouped).map(([day, income]) => ({
          day,
          income,
        }));

        setStats({
          totalCustomers: customers.length,
          totalProducts: products.length,
          totalTransactions: bills.length,
          totalIncome,
          doneOrders,
          inProgress,
        });
        setRecentTransactions(recent);
        setWeeklyIncome(weeklyData);
      } catch (err) {
        console.error("Gagal ambil data dashboard:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside
        className={`bg-white shadow-md w-64 p-5 flex flex-col justify-between fixed inset-y-0 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <span className="text-blue-600 text-3xl">🧺</span>
            <h1 className="text-2xl font-bold text-blue-700">Enigma Laundry</h1>
          </div>

          <nav className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition duration-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* TOP NAVBAR (Mobile Only) */}
        <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center md:hidden">
          <h1 className="text-lg font-bold text-blue-700">Enigma Laundry</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <main className="flex-1 p-6 space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            👋 Selamat Datang di Dashboard Laundry
          </h2>
          <p className="text-gray-500 mb-6">
            Lihat ringkasan kinerja dan transaksi terbaru hari ini.
          </p>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Total Pelanggan" value={stats.totalCustomers} icon={<Users />} color="blue" />
            <Card title="Total Produk" value={stats.totalProducts} icon={<ShoppingBag />} color="indigo" />
            <Card title="Total Transaksi" value={stats.totalTransactions} icon={<Receipt />} color="green" />
            <Card title="Pendapatan" value={`Rp ${stats.totalIncome.toLocaleString()}`} icon={<DollarSign />} color="purple" />
            <Card title="Pesanan Selesai" value={stats.doneOrders} icon={<CheckCircle />} color="blue" />
            <Card title="Sedang Diproses" value={stats.inProgress} icon={<Clock />} color="yellow" />
          </div>

          {/* GRAFIK */}
          <div className="bg-white shadow rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📈 Grafik Pendapatan Mingguan
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyIncome}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* TRANSAKSI TERBARU */}
          <div className="bg-white shadow rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🧾 Transaksi Terbaru
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">ID</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">Pelanggan</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">Total</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((trx) => (
                    <tr key={trx.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{trx.id}</td>
                      <td className="px-4 py-2">{trx.customer?.nama || "N/A"}</td>
                      <td className="px-4 py-2">Rp {Number(trx.total).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-md font-semibold ${
                            trx.status === "Selesai"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <footer className="bg-white py-4 text-center text-sm text-gray-500 border-t mt-6">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-blue-600 font-semibold">Enigma Laundry</span>. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

// 🧩 Komponen kecil untuk card ringkasan
function Card({ title, value, icon, color }) {
  return (
    <div className="bg-white shadow rounded-xl p-5 flex items-center justify-between">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      </div>
      <div className={`text-${color}-500`}>{icon}</div>
    </div>
  );
}
