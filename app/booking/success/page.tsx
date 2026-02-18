"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Home, Printer } from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// @ts-ignore
import QRCode from "qrcode";

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const airline = searchParams.get("airline") || "Sky Explore Flight";
    const amount = searchParams.get("amount");
    const name = searchParams.get("name") || "Passenger";

    const generatePDF = async () => {
        const doc = new jsPDF();

        // 1. High-Resolution QR Code (Fixing the "Kharab" look)
        const qrData = `PASSENGER: ${name}\nAIRLINE: ${airline}\nPAYMENT: ${paymentId}\nTOTAL: INR ${amount}`;

        // Scale badhane se QR sharp ho jata hai
        const qrCodeDataUri = await QRCode.toDataURL(qrData, {
            errorCorrectionLevel: 'H',
            margin: 1,
            scale: 12,
            color: {
                dark: "#000000",
                light: "#ffffff"
            }
        });

        // 2. Header Design (Full Width)
        doc.setFillColor(2, 6, 23);
        doc.rect(0, 0, 210, 45, "F");

        doc.setFontSize(26);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("SKY EXPLORE", 105, 22, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("OFFICIAL ELECTRONIC TICKET & BOOKING CONFIRMATION", 105, 32, { align: "center" });

        // 3. QR Code Placement (Moved to prevent overlap)
        // Positioned at top-right inside the white area
        doc.addImage(qrCodeDataUri, 'PNG', 150, 50, 45, 45, undefined, 'SLOW');

        // 4. Booking Title
        doc.setTextColor(2, 6, 23);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Passenger Journey Details", 15, 60);

        // 5. Details Table (Adjusted startY to avoid QR)
        autoTable(doc, {
            startY: 70,
            margin: { right: 65 }, // Right margin badhaya taaki QR ke niche text na dabe
            head: [['Description', 'Information']],
            body: [
                ['Passenger Name', name.toUpperCase()],
                ['Airline / Carrier', airline],
                ['Payment ID', paymentId || 'N/A'],
                ['Total Amount', `INR ${amount}`],
                ['Status', 'CONFIRMED'],
                ['Booking Date', new Date().toLocaleDateString('en-IN')],
            ],
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { cellPadding: 6, fontSize: 10 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45 } }
        });

        // 6. Footer
        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("---------------------------------------------------------------------------------------------------", 105, finalY + 20, { align: "center" });
        doc.text("This is a system-generated ticket. For support, contact help@skyexplore.com", 105, finalY + 25, { align: "center" });

        doc.save(`Ticket_${paymentId}.pdf`);
    };

    return (
        <main className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 font-sans">
            <div className="max-w-xl w-full text-center space-y-8 bg-slate-900/40 p-10 rounded-[50px] border border-slate-800 backdrop-blur-3xl shadow-2xl">

                <div className="flex justify-center">
                    <div className="bg-emerald-500/10 p-5 rounded-full border border-emerald-500/20">
                        <CheckCircle className="w-16 h-16 text-emerald-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter">Booking Confirmed!</h1>
                    <p className="text-slate-400 font-medium">Ticket details have been sent to your email.</p>
                </div>

                <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 text-left space-y-4">
                    <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Passenger</span>
                        <span className="text-sm font-black text-white">{name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Payment ID</span>
                        <span className="text-[10px] font-mono text-blue-400">{paymentId}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                        onClick={generatePDF}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                    >
                        <Printer className="w-5 h-5" /> DOWNLOAD TICKET
                    </Button>

                    <Link href="/" className="w-full">
                        <Button variant="outline" className="w-full border-slate-800 hover:bg-slate-800 text-slate-300 font-black py-8 rounded-2xl">
                            <Home className="w-5 h-5 mr-2" /> NEW SEARCH
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}