import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "",
        });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
        const response = await api.post("/auth/register", form);
        alert("Pendaftaran berhasil");
        navigate("/login");
    } catch (error) {
        console.log("Pendaftaran Gagal:", error);
        alert("Pendaftaran Gagal. Cek data yang diisi");
    }
};

 const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Pendaftaran User Baru
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input name="name"
              type="text"
              placeholder="Masukkan namaa lengkap"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input name="email"
              type="email"
              placeholder="Masukkan e-mail"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Username
            </label>
            <input name="username"
              type="text"
              placeholder="Masukkan username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input name="password"
              type="password"
              placeholder="Masukkan Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
                Pilih Role
            </label>
            <select name="role"
            value={form.role}
            onChange={handleChange}
            required>
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Daftar
          </button>
        </form>
        </div>
        </div>
);
}
