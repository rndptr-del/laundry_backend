<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bills', function (Blueprint $table) {
    $table->string('id', 36)->primary();
    $table->string('customer_id');
    $table->string('user_id');
    $table->decimal('total_amount', 12, 2)->default(0);
    $table->decimal('paid_amount', 12, 2)->default(0);
    $table->string('status')->default('UNPAID');
    $table->timestamp('payment_date')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
