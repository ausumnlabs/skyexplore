"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Autosuggest } from "@/components/ui/autosuggest";
import { PlaneTakeoff, PlaneLanding, CalendarSearch } from "lucide-react";

export function SearchForm({ onSearch, loading }: any) {
    const [formData, setFormData] = React.useState({ origin: "", destination: "", date: "" });

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSearch(formData); }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">

            <Autosuggest
                placeholder="From (Delhi)"
                value={formData.origin}
                onChange={(val: string) => setFormData({ ...formData, origin: val })}
                icon={PlaneTakeoff}
            />

            <Autosuggest
                placeholder="To (Mumbai)"
                value={formData.destination}
                onChange={(val: string) => setFormData({ ...formData, destination: val })}
                icon={PlaneLanding}
            />

            <div className="relative">
                <CalendarSearch className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                    type="date"
                    className="w-full pl-10 h-12 bg-slate-950 border border-slate-800 rounded-md text-white px-3"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
            </div>

            <Button type="submit" disabled={loading} className="h-12 bg-blue-600 hover:bg-blue-700 font-bold">
                {loading ? "Searching..." : "Find Flights"}
            </Button>
        </form>
    );
}