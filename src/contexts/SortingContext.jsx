import { createContext, useState, useRef } from "react";

import { getRandomNumber, getDigit, mostDigits } from "../helpers/math";

export const SortingContext = createContext();

const speedMap = {
    "slow":   1000,
    "normal":  500,
    "fast":    250,
};

/** Sentinel thrown to cleanly unwind async sort call-stacks on Stop. */
class SortStopped extends Error {
    constructor() { super("sort_stopped"); }
}

// ── Complexity metadata (used by UI for live display) ─────────────────────────
export const ALGO_META = {
    bubble_sort:    { name: "Bubble Sort",    avg: "O(n²)",      label: "Quadratic"    },
    insertion_sort: { name: "Insertion Sort", avg: "O(n²)",      label: "Quadratic"    },
    selection_sort: { name: "Selection Sort", avg: "O(n²)",      label: "Quadratic"    },
    merge_sort:     { name: "Merge Sort",     avg: "O(n log n)", label: "Linearithmic" },
    quick_sort:     { name: "Quick Sort",     avg: "O(n log n)", label: "Linearithmic" },
    radix_sort:     { name: "Radix Sort",     avg: "O(nk)",      label: "Linear*"      },
};

function SortingProvider({ children }) {
    const [sortingState, setSortingState] = useState({
        array:     [],
        delay:     speedMap["slow"],
        algorithm: "bubble_sort",
        sorted:    false,
        sorting:   false,
    });

    // ── Pause / Stop refs ─────────────────────────────────────────────────────
    const [isPaused, setIsPaused]  = useState(false);
    const isPausedRef              = useRef(false);
    const isStoppedRef             = useRef(false);
    const isSortingRef             = useRef(false);
    const originalArrayRef         = useRef([]);

    // ── Live stats ────────────────────────────────────────────────────────────
    // Refs hold the authoritative counts — async loops always read the latest
    // value without stale-closure issues.  State mirrors them for re-renders.
    const comparisonsRef = useRef(0);
    const swapsRef       = useRef(0);
    const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });

    // ── Activity Log ──────────────────────────────────────────────────────────
    const [activityLog, setActivityLog] = useState([]);
    
    const addLog = (message, type = 'info') => {
        setActivityLog((prev) => [...prev, { id: Date.now() + Math.random(), message, type }]);
    };
    
    const clearLog = () => {
        setActivityLog([]);
    };

    const incrementComparisons = () => {
        comparisonsRef.current++;
        setStats((prev) => ({ ...prev, comparisons: comparisonsRef.current }));
    };

    const incrementSwaps = () => {
        swapsRef.current++;
        setStats((prev) => ({ ...prev, swaps: swapsRef.current }));
    };

    const resetStats = () => {
        comparisonsRef.current = 0;
        swapsRef.current       = 0;
        setStats({ comparisons: 0, swaps: 0 });
    };

    // ── Pause-aware delay ─────────────────────────────────────────────────────
    const waitWhilePaused = () => {
        return new Promise(resolve => {
            const check = setInterval(() => {
                if (!isPausedRef.current || isStoppedRef.current) {
                    clearInterval(check);
                    resolve();
                }
            }, 100);
        });
    };

    const checkPauseStop = async () => {
        if (isStoppedRef.current) throw new SortStopped();
        if (isPausedRef.current) {
            await waitWhilePaused();
            if (isStoppedRef.current) throw new SortStopped();
        }
    };

    const pauseAwareDelay = async (ms) => {
        await checkPauseStop();
        await new Promise((r) => setTimeout(r, ms));
        await checkPauseStop();
    };

    // ── Core array helpers ────────────────────────────────────────────────────
    const changeBar = (index, payload) => {
        setSortingState((prev) => ({
            ...prev,
            array: prev.array.map((item, i) =>
                i === index ? { ...item, ...payload } : item
            ),
        }));
    };

    const generateSortingArray = (sorting) => {
        const generatedArray = Array.from({ length: 12 }, () => ({
            value: getRandomNumber(60, 1000),
            state: "idle",
        }));
        resetStats();
        clearLog();
        setSortingState((prev) => ({
            ...prev,
            array:   generatedArray,
            sorted:  false,
            sorting: sorting || false,
        }));
    };

    const setCustomArray = (values) => {
        const generatedArray = values.map((val) => ({ value: val, state: "idle" }));
        resetStats();
        clearLog();
        setSortingState((prev) => ({
            ...prev,
            array:   generatedArray,
            sorted:  false,
            sorting: false,
        }));
    };

    // ── Sorting algorithms ────────────────────────────────────────────────────

    const bubbleSort = async () => {
        const arr = sortingState.array.map((item) => item.value);
        for (let i = 0; i < arr.length; i++) {
            await checkPauseStop();
            for (let j = 0; j < arr.length - i - 1; j++) {
                await checkPauseStop();
                changeBar(j,     { state: "selected" });
                changeBar(j + 1, { state: "selected" });
                await pauseAwareDelay(sortingState.delay);

                incrementComparisons();              // arr[j] vs arr[j+1]
                addLog(`Comparing ${arr[j]} vs ${arr[j + 1]}`, 'compare');
                if (arr[j] > arr[j + 1]) {
                    incrementSwaps();                // true swap
                    addLog(`Swapped ${arr[j]} and ${arr[j + 1]}`, 'swap');
                    let temp = arr[j];
                    arr[j]     = arr[j + 1];
                    changeBar(j,     { value: arr[j + 1], state: "swap" });
                    arr[j + 1] = temp;
                    changeBar(j + 1, { value: temp, state: "swap" });
                    await pauseAwareDelay(sortingState.delay);
                }

                changeBar(j,     { state: "idle" });
                changeBar(j + 1, { state: "idle" });
            }
        }
        addLog(`Bubble Sort complete!`, 'action');
    };

    const insertionSort = async () => {
        const arr = sortingState.array.map((item) => item.value);
        for (let i = 1; i < arr.length; i++) {
            await checkPauseStop();
            let current = arr[i];
            let j = i - 1;
            changeBar(i, { value: current, state: "selected" });
            addLog(`Inserting ${current}`, 'action');

            while (j > -1) {
                await checkPauseStop();
                incrementComparisons();              // current vs arr[j]
                addLog(`Comparing ${current} vs ${arr[j]}`, 'compare');
                if (current >= arr[j]) break;

                incrementSwaps();                    // element shift (counts as move)
                addLog(`Shifting ${arr[j]} to the right`, 'swap');
                arr[j + 1] = arr[j];
                changeBar(j + 1, { value: arr[j], state: "swap" });
                j--;
                await pauseAwareDelay(sortingState.delay);
                changeBar(j + 2, { value: arr[j + 1], state: "idle" });
            }

            arr[j + 1] = current;
            changeBar(j + 1, { value: current, state: "swap" });
            addLog(`Placed ${current} into correct position`, 'swap');
            await pauseAwareDelay(sortingState.delay);
            changeBar(j + 1, { state: "idle" });
        }
        addLog(`Insertion Sort complete!`, 'action');
    };

    const selectionSort = async () => {
        const arr = sortingState.array.map((item) => item.value);
        for (let i = 0; i < arr.length; i++) {
            await checkPauseStop();
            let min = i;
            changeBar(min, { state: "selected" });
            addLog(`Finding minimum for position ${i}`, 'action');

            for (let j = i + 1; j < arr.length; j++) {
                await checkPauseStop();
                changeBar(j, { state: "selected" });
                await pauseAwareDelay(sortingState.delay);

                incrementComparisons();              // arr[j] vs arr[min]
                addLog(`Comparing ${arr[j]} vs current min ${arr[min]}`, 'compare');
                if (arr[j] < arr[min]) {
                    addLog(`New minimum found: ${arr[j]}`, 'action');
                    changeBar(min, { state: "idle" });
                    min = j;
                    changeBar(min, { state: "selected" });
                } else {
                    changeBar(j, { state: "idle" });
                }
            }

            if (min !== i) {
                incrementSwaps();                    // true swap of min into place
                addLog(`Swapped ${arr[i]} and ${arr[min]}`, 'swap');
                let temp = arr[i];
                arr[i]   = arr[min];
                changeBar(i,   { value: arr[min], state: "swap" });
                arr[min] = temp;
                changeBar(min, { value: temp,     state: "swap" });
                await pauseAwareDelay(sortingState.delay);
                changeBar(i,   { state: "idle" });
                changeBar(min, { state: "idle" });
            } else {
                changeBar(i,   { state: "idle" });
                changeBar(min, { state: "idle" });
            }
        }
        addLog(`Selection Sort complete!`, 'action');
    };

    const mergeSort = async () => {
        const arr = sortingState.array.map((item) => item.value);
        await mergeSortHelper(arr);
        addLog(`Merge Sort complete!`, 'action');
    };
    async function mergeSortHelper(arr, start = 0, end = arr.length - 1) {
        if (start >= end) return;
        const middle = Math.floor((start + end) / 2);
        addLog(`Dividing array at index ${middle}`, 'action');
        await mergeSortHelper(arr, start, middle);
        await mergeSortHelper(arr, middle + 1, end);
        await mergeSortMerger(arr, start, middle, end);
    }
    async function mergeSortMerger(arr, start, middle, end) {
        addLog(`Merging subarrays [${start}-${middle}] and [${middle+1}-${end}]`, 'action');
        let left  = arr.slice(start, middle + 1);
        let right = arr.slice(middle + 1, end + 1);
        let i = 0, j = 0, k = start;

        while (i < left.length && j < right.length) {
            await checkPauseStop();
            incrementComparisons();                  // left[i] vs right[j]
            addLog(`Comparing ${left[i]} vs ${right[j]}`, 'compare');
            if (left[i] < right[j]) {
                incrementSwaps();                    // placement into merged array
                addLog(`Placing ${left[i]} into merged array`, 'swap');
                changeBar(k, { value: left[i],  state: "swap" });
                arr[k++] = left[i++];
            } else {
                incrementSwaps();                    // placement into merged array
                addLog(`Placing ${right[j]} into merged array`, 'swap');
                changeBar(k, { value: right[j], state: "swap" });
                arr[k++] = right[j++];
            }
            await pauseAwareDelay(sortingState.delay);
        }
        while (i < left.length) {
            await checkPauseStop();
            incrementSwaps();
            addLog(`Placing remaining ${left[i]}`, 'swap');
            changeBar(k, { value: left[i], state: "swap" });
            arr[k++] = left[i++];
            await pauseAwareDelay(sortingState.delay);
        }
        while (j < right.length) {
            await checkPauseStop();
            incrementSwaps();
            addLog(`Placing remaining ${right[j]}`, 'swap');
            changeBar(k, { value: right[j], state: "swap" });
            arr[k++] = right[j++];
            await pauseAwareDelay(sortingState.delay);
        }
        for (let i = start; i <= end; i++) {
            await checkPauseStop();
            changeBar(i, { value: arr[i], state: "idle" });
        }
    }

    const quickSort = async () => {
        const arr = sortingState.array.map((item) => item.value);
        await quickSortHelper(arr);
        addLog(`Quick Sort complete!`, 'action');
    };
    const quickSortHelper = async (arr, start = 0, end = arr.length - 1) => {
        if (start >= end) return;
        const pivot = arr[Math.floor((start + end) / 2)];
        addLog(`Pivot selected: ${pivot}`, 'action');
        let i = start, j = end;

        while (i <= j) {
            await checkPauseStop();
            while (arr[i] < pivot) { 
                await checkPauseStop();
                incrementComparisons(); 
                addLog(`Comparing ${arr[i]} < pivot (${pivot})`, 'compare');
                i++; 
            }
            incrementComparisons(); 

            while (arr[j] > pivot) { 
                await checkPauseStop();
                incrementComparisons(); 
                addLog(`Comparing ${arr[j]} > pivot (${pivot})`, 'compare');
                j--; 
            }
            incrementComparisons(); 

            if (i <= j) {
                incrementSwaps();                    // true swap
                addLog(`Swapped ${arr[i]} and ${arr[j]}`, 'swap');
                [arr[i], arr[j]] = [arr[j], arr[i]];
                changeBar(i, { value: arr[i], state: "swap" });
                changeBar(j, { value: arr[j], state: "swap" });
                await pauseAwareDelay(sortingState.delay);
                changeBar(i, { value: arr[i], state: "idle" });
                changeBar(j, { value: arr[j], state: "idle" });
                i++;
                j--;
            }
        }
        await quickSortHelper(arr, start, j);
        await quickSortHelper(arr, i,     end);
    };

    const radixSort = async () => {
        let arr = sortingState.array.map((item) => item.value);
        let maxDigitCount = mostDigits(arr);

        for (let k = 0; k < maxDigitCount; k++) {
            await checkPauseStop();
            addLog(`Processing digit ${k + 1}`, 'action');
            let digitBuckets = Array.from({ length: 10 }, () => []);
            for (let i = 0; i < arr.length; i++) {
                await checkPauseStop();
                digitBuckets[getDigit(arr[i], k)].push(arr[i]);
                incrementSwaps();                    // bucket placement
                addLog(`Placed ${arr[i]} in bucket ${getDigit(arr[i], k)}`, 'compare');
            }
            arr = [].concat(...digitBuckets);

            addLog(`Reconstructing array from buckets`, 'action');
            for (let i = 0; i < arr.length; i++) {
                changeBar(i, { value: arr[i], state: "swap" });
                await pauseAwareDelay(sortingState.delay);
                changeBar(i, { value: arr[i], state: "idle" });
            }
        }
        addLog(`Radix Sort complete!`, 'action');
    };

    const algorithmMap = {
        "bubble_sort":    bubbleSort,
        "insertion_sort": insertionSort,
        "selection_sort": selectionSort,
        "merge_sort":     mergeSort,
        "quick_sort":     quickSort,
        "radix_sort":     radixSort,
    };

    // ── Sort runner ───────────────────────────────────────────────────────────
    const startVisualizing = async () => {
        if (sortingState.sorting || sortingState.sorted) return;

        // Snapshot array and reset everything before sort begins.
        originalArrayRef.current = sortingState.array.map((bar) => ({ ...bar, state: "idle" }));
        isPausedRef.current  = false;
        isStoppedRef.current = false;
        isSortingRef.current = true;
        setIsPaused(false);
        resetStats();
        clearLog();
        addLog(`Starting ${ALGO_META[sortingState.algorithm].name}...`, 'action');

        setSortingState((prev) => ({ ...prev, sorting: true, sorted: false }));

        try {
            await algorithmMap[sortingState.algorithm]();
            if (!isStoppedRef.current) {
                setSortingState((prev) => ({ ...prev, sorted: true, sorting: false }));
            }
        } catch (e) {
            if (!(e instanceof SortStopped)) throw e;
        } finally {
            isPausedRef.current  = false;
            isStoppedRef.current = false;
            isSortingRef.current = false;
            setIsPaused(false);
        }
    };

    // ── Pause / Resume / Stop ─────────────────────────────────────────────────
    const pauseSorting = () => {
        addLog(`Paused`, 'compare');
        isPausedRef.current = true;
        setIsPaused(true);
    };

    const resumeSorting = () => {
        addLog(`Resumed`, 'action');
        isPausedRef.current = false;
        setIsPaused(false);
    };

    const stopSorting = () => {
        isPausedRef.current  = false;
        isStoppedRef.current = true;
        isSortingRef.current = false;
        setIsPaused(false);
        // Reset bars back to original unsorted array & re-enable buttons
        setSortingState((prev) => ({
            ...prev,
            array: originalArrayRef.current.map((item) => ({ value: item.value, state: "idle" })),
            sorting: false,
            sorted: false,
        }));
        clearLog();
        resetStats();
    };

    // ── Speed / Algorithm ─────────────────────────────────────────────────────
    const changeSortingSpeed = (e) => {
        setSortingState((prev) => ({
            ...prev,
            delay: speedMap[e.target.value] || 500,
        }));
    };

    const changeAlgorithm = (algorithm) => {
        setSortingState((prev) => ({ ...prev, algorithm }));
    };

    return (
        <SortingContext.Provider
            value={{
                sortingState,
                isPaused,
                stats,
                activityLog,
                generateSortingArray,
                setCustomArray,
                startVisualizing,
                pauseSorting,
                resumeSorting,
                stopSorting,
                changeSortingSpeed,
                changeAlgorithm,
            }}
        >
            {children}
        </SortingContext.Provider>
    );
}

export default SortingProvider;
