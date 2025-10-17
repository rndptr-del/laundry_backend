<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use COM;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customers::all();
        return Inertia::render('CustomersPage', ['customers' => $customers]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:50',
            'phoneNumber' => 'required|string|max:20',
            'address' => 'required|string|max:50',
        ]);

        $customer = Customers::create($validate);
        return redirect()->route('customers.index')->with('success', 'Pelanggan berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $customer = Customers::find($id);
        if (!$customer) return response()->json(['message' => 'Customer not found'], 404);
        return $customer;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customers $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $customer = Customers::find($id);
        if (!$customer) return redirect()->back()->with('error', 'Customer tidak ditemukan.');

        $validate = $request->validate([
            'name' => 'sometimes|required|string|max:50',
            'phoneNumber' => 'sometimes|required|string|max:20',
            'address' => 'required|string|max:50',
        ]);

        $customer->update($validate);
        return redirect()->route('customers.index')->with('success', 'Data pelanggan berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        $customer = Customers::find($id);
        if (!$customer) return redirect()->back()->with('error', 'Customer tidak ditemukan.');

        $customer->delete();
        return redirect()->route('customers.index')->with('success', 'Data pelanggan berhasil dihapus');
    }
}
