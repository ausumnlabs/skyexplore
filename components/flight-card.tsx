"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Clock, ArrowRight, ShieldCheck, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import Link from "next/link";
const getAirlineName = (code: string) => {
    const airlines: { [key: string]: string } = {
        '6E': 'IndiGo', 'AI': 'Air India', 'UK': 'Vistara', 'QP': 'Akasa Air',
        'SG': 'SpiceJet', 'IX': 'Air India Express'
    };
    return airlines[code] || 'International Flight';
};

export function FlightCard({ flight }: any) {
    const [showDetails, setShowDetails] = useState(false);

    if (!flight || !flight.itineraries || flight.itineraries.length === 0) return null;

    const itinerary = flight.itineraries[0];
    const segments = itinerary.segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    const airlineCode = firstSegment.carrierCode;
    const stops = segments.length - 1;
    const priceInINR = Math.round(parseFloat(flight.price.total) * 90);

    // Time Formatter helper
    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Card className="mb-6 bg-slate-900/60 border-slate-800 hover:border-blue-500/50 transition-all overflow-hidden shadow-2xl">
            <CardContent className="p-0">
                {/* Main Card Header (Same as before) */}
                <div className="flex flex-col lg:flex-row items-center justify-between p-6 gap-6">
                    <div className="flex items-center gap-6 flex-[2] w-full">
                        <div className="flex flex-col items-center min-w-[100px]">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center font-black text-slate-900 text-xl mb-2">
                                {airlineCode}
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase text-center">{getAirlineName(airlineCode)}</p>
                        </div>

                        <div className="flex items-center justify-between flex-1 gap-4">
                            <div className="text-left">
                                <p className="text-3xl font-black text-white">{firstSegment.departure.iataCode}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">{formatTime(firstSegment.departure.at)}</p>
                            </div>

                            <div className="flex flex-col items-center flex-1 max-w-[150px]">
                                <p className={`text-[10px] font-black uppercase mb-1 ${stops === 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                    {stops === 0 ? 'Direct' : `${stops} Stop${stops > 1 ? 's' : ''}`}
                                </p>
                                <div className="h-[2px] w-full bg-slate-800 relative">
                                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                                </div>
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="mt-2 text-[10px] text-blue-400 font-bold flex items-center gap-1 hover:underline"
                                >
                                    {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    VIEW DETAILS
                                </button>
                            </div>

                            <div className="text-right">
                                <p className="text-3xl font-black text-white">{lastSegment.arrival.iataCode}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">{formatTime(lastSegment.arrival.at)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-8 w-full lg:w-auto justify-between">
                        <div className="text-right">
                            <p className="text-4xl font-black text-white">₹{priceInINR.toLocaleString('en-IN')}</p>
                            {/* // Button ko Link se wrap karein */}
                            <Link
                                href={{
                                    pathname: '/booking',
                                    query: { flightId: flight.id, price: priceInINR, airline: getAirlineName(airlineCode) }
                                }}
                            >
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl mt-2 flex items-center gap-2 active:scale-95 transition-all">
                                    Select <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Detailed Journey Section */}
                {showDetails && (
                    <div className="bg-[#020617] p-8 border-t border-slate-800 animate-in slide-in-from-top duration-300">
                        <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-6">Flight Journey Details</h4>
                        <div className="space-y-8">
                            {segments.map((seg: any, idx: number) => (
                                <div key={idx} className="relative">
                                    <div className="flex gap-6">
                                        <div className="flex flex-col items-center">
                                            <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-slate-950 z-10"></div>
                                            {idx !== segments.length - 1 && <div className="w-[1px] h-full bg-slate-800 my-1"></div>}
                                        </div>

                                        <div className="flex-1 pb-6">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                                <div>
                                                    <p className="text-white font-black text-lg">{seg.departure.iataCode} → {seg.arrival.iataCode}</p>
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase mt-1">
                                                        {getAirlineName(seg.carrierCode)} | {seg.carrierCode}-{seg.number}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                                        <span className="text-blue-400 uppercase font-black">Dep:</span> {formatTime(seg.departure.at)}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                                                        <span className="text-orange-400 uppercase font-black">Arr:</span> {formatTime(seg.arrival.at)}
                                                    </p>
                                                </div>

                                                <div className="md:text-right">
                                                    <p className="text-xs text-slate-300 font-bold bg-slate-900 px-3 py-1 rounded-full inline-block">
                                                        Duration: {seg.duration.replace('PT', '').toLowerCase()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Layover Detail Calculation */}
                                            {idx < segments.length - 1 && (
                                                <div className="mt-6 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="w-4 h-4 text-orange-400" />
                                                        <div>
                                                            <p className="text-[11px] text-orange-400 font-black uppercase tracking-tight">
                                                                Layover at {seg.arrival.iataCode}
                                                            </p>
                                                            <p className="text-[10px] text-slate-500 font-medium">Change planes in {seg.arrival.iataCode}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}