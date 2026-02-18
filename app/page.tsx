"use client";

import React, { useState, useMemo } from "react";
import { SearchForm } from "@/components/search-form";
import { FlightCard } from "@/components/flight-card";

export default function Page() {
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAirline, setSelectedAirline] = useState<string>("ALL");

  const searchFlights = async (data: { origin: string; destination: string; date: string }) => {
    setLoading(true);
    setError(null);
    setFlights([]);
    setSelectedAirline("ALL"); // Reset filter on new search

    try {
      const res = await fetch(
        `/api/flights?origin=${data.origin}&destination=${data.destination}&date=${data.date}`
      );

      const result = await res.json();

      if (Array.isArray(result)) {
        // LOW TO HIGH SORTING
        const sorted = result.sort((a: any, b: any) =>
          parseFloat(a.price.total) - parseFloat(b.price.total)
        );
        setFlights(sorted);
        if (result.length === 0) setError("Koi flights nahi mili is route par.");
      } else {
        setError("API se sahi response nahi mila.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredFlights = useMemo(() => {
    if (selectedAirline === "ALL") return flights;
    return flights.filter(f => f.itineraries[0].segments[0].carrierCode === selectedAirline);
  }, [flights, selectedAirline]);

  // Unique Airlines in Results
  const availableAirlines = useMemo(() => {
    const codes = flights.map(f => f.itineraries[0].segments[0].carrierCode);
    return ["ALL", ...Array.from(new Set(codes))];
  }, [flights]);

  return (
    <main className="min-h-screen bg-[#020617] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-black tracking-tighter mb-2 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            SKY EXPLORE
          </h1>
          <p className="text-slate-400 font-bold">Smartest Way to Travel</p>
        </header>

        <SearchForm onSearch={searchFlights} loading={loading} />

        {/* Airline Filters */}
        {!loading && flights.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 items-center justify-center">
            <p className="text-[10px] font-black text-slate-500 uppercase mr-2">Filter by Airline:</p>
            {availableAirlines.map(code => (
              <button
                key={code}
                onClick={() => setSelectedAirline(code)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${selectedAirline === code
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                  }`}
              >
                {code === "ALL" ? "SHOW ALL" : code}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="mt-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-black animate-pulse">OPTIMIZING PRICES...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFlights.length > 0 && (
                <div className="flex justify-between items-center mb-6">
                  <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    {filteredFlights.length} Flights Found
                  </p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Sorted by Lowest Price
                  </p>
                </div>
              )}
              {filteredFlights.map((f, i) => (
                <FlightCard key={f.id || i} flight={f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}