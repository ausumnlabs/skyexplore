"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "./input";

export function Autosuggest({ placeholder, value, onChange, icon: Icon }: any) {
    const [suggestions, setSuggestions] = useState([]);
    const [show, setShow] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Click outside hone par dropdown band karne ke liye
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShow(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchAirports = async () => {
            if (value.length > 1) {
                try {
                    const res = await fetch(`/api/airports?keyword=${value}`);

                    // Safety Check: Agar response HTML hai (status 404/500), toh error handle karein
                    const contentType = res.headers.get("content-type");
                    if (!contentType || !contentType.includes("application/json")) {
                        console.error("Oops! API ne JSON nahi bheja");
                        setSuggestions([]);
                        return;
                    }

                    const data = await res.json();
                    setSuggestions(data);
                    setShow(true);
                } catch (err) {
                    console.error("Fetch failed:", err);
                    setSuggestions([]);
                }
            }
        };
        const timer = setTimeout(fetchAirports, 300);
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="relative w-full" ref={containerRef}>
            <Icon className="absolute left-3 top-3.5 h-5 w-5 text-slate-500 z-20" />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e: any) => onChange(e.target.value)}
                onFocus={() => value.length > 1 && setShow(true)}
                className="pl-10 h-12 bg-slate-950 border-slate-800 text-white focus:border-blue-500"
            />

            {/* Dropdown List - Iska Z-index aur Background check karein */}
            {show && suggestions.length > 0 && (
                <div className="absolute top-[105%] left-0 w-full bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden z-[999] shadow-2xl">
                    {suggestions.map((s: any, i) => (
                        <div
                            key={i}
                            className="p-4 hover:bg-blue-600/20 cursor-pointer text-sm flex justify-between items-center border-b border-slate-800/50 last:border-0"
                            onClick={() => {
                                onChange(s.iataCode);
                                setShow(false);
                            }}
                        >
                            <div className="flex flex-col">
                                <span className="font-bold text-white">{s.name}</span>
                                <span className="text-[10px] text-slate-500">{s.detailedName}</span>
                            </div>
                            <span className="bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono font-bold text-xs">
                                {s.iataCode}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}