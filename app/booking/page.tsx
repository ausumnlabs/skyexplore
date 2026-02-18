"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ChevronLeft, Ticket, User, Mail, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

// Alag component banaya searchParams use karne ke liye
function BookingContent() {
    const searchParams = useSearchParams();
    const apiPrice = Number(searchParams.get("price") || 0);
    const airline = searchParams.get("airline") || "Flight";

    const [passenger, setPassenger] = useState({ name: "", email: "", phone: "" });

    const displayBaseFare = Math.round(apiPrice * 0.8);
    const displayTaxes = (apiPrice - displayBaseFare) + 700;
    const discount = 600;
    const grandTotal = (displayBaseFare + displayTaxes) - discount;

    const handlePayment = async () => {
        if (!passenger.name || !passenger.email || !passenger.phone) {
            alert("Please fill all details!"); return;
        }
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: grandTotal }),
            });
            const order = await response.json();
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "SKY EXPLORE",
                order_id: order.id,
                handler: async function (res: any) {
                    await fetch("/api/send-ticket", {
                        method: "POST",
                        body: JSON.stringify({ payment_id: res.razorpay_payment_id, passenger, airline, amount: grandTotal })
                    });
                    window.location.href = `/booking/success?payment_id=${res.razorpay_payment_id}&amount=${grandTotal}&airline=${airline}&name=${passenger.name}`;
                },
                prefill: { name: passenger.name, email: passenger.email, contact: passenger.phone },
                theme: { color: "#2563eb" },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <h1 className="text-4xl font-black italic">PASSENGER DETAILS</h1>
                <Card className="bg-slate-900/40 border-slate-800 p-8 rounded-3xl">
                    <div className="space-y-4">
                        <input placeholder="Full Name" className="w-full bg-slate-950 border-slate-800 p-4 rounded-xl text-sm" onChange={(e) => setPassenger({ ...passenger, name: e.target.value })} />
                        <input placeholder="Email Address" className="w-full bg-slate-950 border-slate-800 p-4 rounded-xl text-sm" onChange={(e) => setPassenger({ ...passenger, email: e.target.value })} />
                        <input placeholder="Phone Number" className="w-full bg-slate-950 border-slate-800 p-4 rounded-xl text-sm" onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })} />
                    </div>
                </Card>
            </div>
            <div className="space-y-6">
                <Card className="bg-slate-900 border-slate-800 p-8 rounded-[40px] shadow-2xl">
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm"><span>Base Fare</span><span>₹{displayBaseFare.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm"><span>Taxes & Fees</span><span>₹{displayTaxes.toLocaleString()}</span></div>
                        <div className="flex justify-between text-emerald-400 font-bold"><span>Discount</span><span>-₹{discount}</span></div>
                        <div className="h-[1px] bg-slate-800 my-4"></div>
                        <div className="flex justify-between items-center"><span className="text-4xl font-black text-white">₹{grandTotal.toLocaleString()}</span></div>
                    </div>
                    <Button onClick={handlePayment} className="w-full mt-10 bg-blue-600 font-black py-8 rounded-2xl">CONFIRM & PAY</Button>
                </Card>
            </div>
        </div>
    );
}

// Main Export with Suspense
export default function BookingPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-white p-4 md:p-12">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            <div className="max-w-5xl mx-auto">
                <Suspense fallback={<div className="text-center py-20 text-blue-500 font-black animate-pulse">LOADING BOOKING ENGINE...</div>}>
                    <BookingContent />
                </Suspense>
            </div>
        </main>
    );
}