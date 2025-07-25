<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Customers;
use COM;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Customers::all();
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
        return response()->json($customer, 201);
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
        if (!$customer) return response()->json(['message' => 'Customer not found'], 404);

        $validate = $request->validate([
            'name' => 'sometimes|required|string|max:50',
            'phoneNumber' => 'sometimes|required|string|max:20',
            'address' => 'required|string|max:50',
        ]);

        $customer->update($validate);
        return $customer;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        $customer = Customers::find($id);
        if (!$customer) return response()->json(['message' => 'Customer not found'], 404);

        $customer->delete();
        return response()->json(['message' => 'Customer deleted']);
    }
}
