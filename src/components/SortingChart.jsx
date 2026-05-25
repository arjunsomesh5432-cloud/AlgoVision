import { useContext, useEffect, useRef, useState } from "react";
import { Play, Pause, Square, Shuffle, Pencil, Gauge, Zap, ArrowLeftRight, ArrowUpDown, LayoutList, Check, Turtle, Rocket } from "lucide-react";

import { SortingContext } from "../contexts/SortingContext";
import { ALGO_META } from "../contexts/SortingContext";
import { PremiumSelect } from "./ui/PremiumSelect";

const algorithms = [
    { key: "bubble_sort",    label: "Bubble Sort"    },
    { key: "insertion_sort", label: "Insertion Sort" },
    { key: "selection_sort", label: "Selection Sort" },
    { key: "merge_sort",     label: "Merge Sort"     },
    { key: "quick_sort",     label: "Quick Sort"     },
    { key: "radix_sort",     label: "Radix Sort"     },
];

const delayToLabel = { 1000: "Slow", 500: "Normal", 250: "Fast" };

function SortingChart() {
    const {
        sortingState,
        isPaused,
        stats,
        generateSortingArray,
        setCustomArray,
        startVisualizing,
        pauseSorting,
        resumeSorting,
        stopSorting,
        changeSortingSpeed,
        changeAlgorithm,
    } = useContext(SortingContext);

    // ── Local UI state ────────────────────────────────────────
    const [customInput, setCustomInput] = useState("");
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customInputWarning, setCustomInputWarning] = useState("");

    // Generate initial array on mount
    useEffect(() => {
        generateSortingArray();
    }, []);

    // ── Helpers ──────────────────────────────────────────────
    const getBarClass = (bar) => {
        if (sortingState.sorted) return "bar bar-sorted";
        return `bar bar-${bar.state}`;
    };

    const getBarTextClass = (bar) => {
        if (sortingState.sorted) return "pl-1.5 text-xs text-emerald-200/70";
        return bar.state === "idle"
            ? "pl-1.5 text-xs text-blue-200/70"
            : "pl-1.5 text-xs text-yellow-200/70";
    };

    const speedLabel = delayToLabel[sortingState.delay] ?? "Normal";

    return (
        <div className="flex flex-col gap-5">

            {/* ── Algorithm Selector ── */}
            <div className="glass rounded-2xl p-5">
                <p className="text-[10px] text-white/35 uppercase tracking-widest mb-4 font-semibold">
                    Choose Algorithm
                </p>
                <div className="flex flex-wrap gap-2">
                    {algorithms.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => changeAlgorithm(key)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                sortingState.algorithm === key
                                    ? "bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] text-white shadow-lg shadow-[#6c63ff]/25"
                                    : "bg-white/5 text-white/55 hover:bg-white/10 hover:text-white border border-white/10"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Chart ── */}
            <div className="glass rounded-2xl p-5 relative z-50">
                <div className="mb-5 chart-container rounded-xl">
                    {sortingState.array.map((bar, i) => (
                        <div key={i} className="bar-container">
                            {sortingState.array.length <= 20 && (
                                <p className="bar-label">{bar.value}</p>
                            )}
                            <div
                                className={`select-none ${getBarClass(bar)}`}
                                style={{ height: `${Math.max(1, (bar.value / 1000) * 100)}%` }}
                            />
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 flex-wrap">

                    {/* ── Start (hidden while sorting) ── */}
                    {!sortingState.sorting && (
                        <button
                            onClick={startVisualizing}
                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] text-white text-sm font-semibold shadow-lg shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <Play size={16} /> Start
                        </button>
                    )}

                    {/* ── Pause / Resume (visible while sorting) ── */}
                    {sortingState.sorting && !isPaused && (
                        <button
                            onClick={pauseSorting}
                            className="px-6 py-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-semibold hover:bg-yellow-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <Pause size={16} /> Pause
                        </button>
                    )}
                    {sortingState.sorting && isPaused && (
                        <button
                            onClick={resumeSorting}
                            className="px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <Play size={16} className="animate-pulse" /> Resume
                        </button>
                    )}

                    {/* ── Stop (visible while sorting) ── */}
                    {sortingState.sorting && (
                        <button
                            onClick={stopSorting}
                            className="px-6 py-2.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-semibold hover:bg-red-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <Square size={16} /> Stop
                        </button>
                    )}

                    {/* ── Random Array (disabled while sorting) ── */}
                    <button
                        disabled={sortingState.sorting}
                        onClick={() => generateSortingArray()}
                        className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/65 text-sm font-medium hover:bg-white/10 hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Shuffle size={16} /> Random Array
                    </button>

                    {/* ── Custom Array (disabled while sorting) ── */}
                    <button
                        disabled={sortingState.sorting}
                        onClick={() => setShowCustomInput(!showCustomInput)}
                        className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 ${
                            showCustomInput
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-white/5 border-white/10 text-white/65 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        <Pencil size={16} /> Custom Array
                    </button>

                    {/* ── Speed selector (disabled while sorting) ── */}
                    <PremiumSelect
                        disabled={sortingState.sorting}
                        value={speedLabel.toLowerCase()}
                        options={[
                            { value: "slow",   label: "Slow",   icon: <Turtle size={16} /> },
                            { value: "normal", label: "Normal", icon: <Zap size={16} /> },
                            { value: "fast",   label: "Fast",   icon: <Rocket size={16} /> },
                        ]}
                        onChange={(val) => changeSortingSpeed({ target: { value: val } })}
                    />
                </div>
            </div>

            {/* Custom Input Form */}
            {showCustomInput && (
                <div className="glass rounded-2xl p-5 animate-fade-in">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const values = customInput
                            .split(",")
                            .map((v) => parseInt(v.trim()))
                            .filter((v) => !isNaN(v) && v > 0 && v <= 1000);
                        
                        if (values.length > 0) {
                            // limit to max 14 elements to not break UI
                            const limitedValues = values.slice(0, 14);
                            setCustomArray(limitedValues);
                            setShowCustomInput(false);
                            setCustomInput("");
                        }
                    }} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={customInput}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9,\s]/g, "");
                                const items = val.split(",");
                                
                                if (items.length > 14) {
                                    setCustomInputWarning("Maximum limit of 14 numbers reached.");
                                    return;
                                }

                                const hasTooLarge = items.some((item) => {
                                    const num = parseInt(item.trim());
                                    return !isNaN(num) && num > 1000;
                                });

                                if (hasTooLarge) {
                                    setCustomInputWarning("Numbers cannot exceed 1000.");
                                    return;
                                }

                                setCustomInputWarning("");
                                setCustomInput(val);
                            }}
                            placeholder="Enter comma separated numbers (1-1000), e.g. 5, 200, 800"
                            className="flex-1 bg-[#0f0f1a]/50 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/50 transition-all"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all"
                        >
                            Set Array
                        </button>
                    </form>
                    {customInputWarning && (
                        <p className="text-red-400 text-xs mt-3 ml-2 animate-fade-in">{customInputWarning}</p>
                    )}
                </div>
            )}

            {/* ── Stats Bar ── */}
            <div className="glass rounded-2xl overflow-hidden">

                {/* Complexity strip */}
                {(() => {
                    const meta = ALGO_META[sortingState.algorithm];
                    const isNlogn = meta?.avg.includes("log");
                    const isLinear = meta?.label === "Linear*";
                    return meta ? (
                        <div className="px-5 py-3 flex items-center gap-3 border-b border-white/5 bg-white/[0.015]">
                            <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                                {meta.name}
                            </span>
                            <span className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] text-white/30 uppercase tracking-widest">Avg. Time</span>
                                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                                    isLinear ? "bg-sky-500/15 text-sky-300" :
                                    isNlogn  ? "bg-yellow-500/15 text-yellow-300" :
                                               "bg-red-500/15 text-red-300"
                                }`}>
                                    {meta.avg}
                                </span>
                            </span>
                        </div>
                    ) : null;
                })()}

                {/* Stat cards */}
                <div className="px-5 py-4 flex flex-wrap items-center gap-4">

                    {/* Comparisons */}
                    <div className="flex items-center gap-2.5 min-w-[130px]">
                        <div className="w-8 h-8 rounded-lg bg-[#6c63ff]/15 flex items-center justify-center shrink-0 text-[#6c63ff]">
                            <ArrowLeftRight size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/35 uppercase tracking-widest font-semibold leading-none mb-0.5">Comparisons</p>
                            <p className={`text-lg font-bold tabular-nums transition-colors duration-150 ${
                                sortingState.sorting ? "text-[#a89dff]" : "text-white"
                            }`}>{stats.comparisons.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-white/5 hidden sm:block" />

                    {/* Swaps / Moves */}
                    <div className="flex items-center gap-2.5 min-w-[110px]">
                        <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center shrink-0 text-[#00d4ff]">
                            <ArrowUpDown size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/35 uppercase tracking-widest font-semibold leading-none mb-0.5">
                                {["merge_sort", "radix_sort"].includes(sortingState.algorithm) ? "Writes" : "Swaps"}
                            </p>
                            <p className={`text-lg font-bold tabular-nums transition-colors duration-150 ${
                                sortingState.sorting ? "text-[#5ef0ff]" : "text-white"
                            }`}>{stats.swaps.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-white/5 hidden sm:block" />

                    {/* Array Size */}
                    <div className="flex items-center gap-2.5 min-w-[100px]">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                            <LayoutList size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/35 uppercase tracking-widest font-semibold leading-none mb-0.5">Array Size</p>
                            <p className="text-lg font-bold text-white tabular-nums">{sortingState.array.length}</p>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-white/5 hidden sm:block" />

                    {/* Speed */}
                    <div className="flex items-center gap-2.5 min-w-[90px]">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0 text-yellow-500">
                            <Gauge size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/35 uppercase tracking-widest font-semibold leading-none mb-0.5">Speed</p>
                            <p className="text-lg font-bold text-white">{speedLabel}</p>
                        </div>
                    </div>

                    {/* Sorted badge */}
                    <div className="ml-auto">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-500 ${
                            sortingState.sorted
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                                : sortingState.sorting
                                    ? isPaused
                                        ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/25"
                                        : "bg-[#6c63ff]/15 text-[#a89dff] border border-[#6c63ff]/25"
                                    : "bg-white/5 text-white/20 border border-white/5"
                        }`}>
                            <span className={`w-2 h-2 rounded-full transition-all duration-500 ${
                                sortingState.sorted
                                    ? "bg-emerald-400 animate-pulse"
                                    : sortingState.sorting
                                        ? isPaused ? "bg-yellow-400" : "bg-[#6c63ff] animate-pulse"
                                        : "bg-white/20"
                            }`} />
                            {sortingState.sorted
                                ? <span className="flex items-center gap-1.5">Sorted <Check size={14} strokeWidth={3} /></span>
                                : sortingState.sorting
                                    ? isPaused ? "Paused" : "Sorting..."
                                    : "Unsorted"}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SortingChart;
