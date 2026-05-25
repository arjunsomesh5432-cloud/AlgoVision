import { Lightbulb } from "lucide-react";

const algoData = {
    bubble_sort: {
        name: "Bubble Sort",
        description: "Repeatedly steps through the list, compares adjacent elements and swaps them if out of order.",
        best:  { label: "O(n)",   color: "bg-lime-700"   },
        avg:   { label: "O(n²)",  color: "bg-red-800"    },
        worst: { label: "O(n²)",  color: "bg-red-800"    },
        space: { label: "O(1)",   color: "bg-green-800"  },
        pseudocode: `for i = 0 to n-1
  for j = 0 to n-i-2
    if A[j] > A[j+1]
      swap(A[j], A[j+1])`,
        tips: [
            "Despite being slow, Bubble Sort is optimal for nearly-sorted arrays.",
            "It is a stable sort, meaning it preserves the relative order of equal elements.",
            "Often used purely for educational purposes due to its simplicity."
        ]
    },
    selection_sort: {
        name: "Selection Sort",
        description: "Repeatedly selects the minimum element from the unsorted region and moves it to the sorted region.",
        best:  { label: "O(n²)",  color: "bg-red-800"    },
        avg:   { label: "O(n²)",  color: "bg-red-800"    },
        worst: { label: "O(n²)",  color: "bg-red-800"    },
        space: { label: "O(1)",   color: "bg-green-800"  },
        pseudocode: `for i = 0 to n-1
  min = i
  for j = i+1 to n-1
    if A[j] < A[min]
      min = j
  swap(A[i], A[min])`,
        tips: [
            "Selection Sort makes exactly O(n) swaps, which is useful when memory write operations are expensive.",
            "It is an in-place comparison sort, requiring no extra memory.",
            "It is generally not a stable sort, as it can swap non-adjacent elements."
        ]
    },
    insertion_sort: {
        name: "Insertion Sort",
        description: "Builds the sorted array one element at a time by inserting each new element into its correct position.",
        best:  { label: "O(n)",   color: "bg-lime-700"   },
        avg:   { label: "O(n²)",  color: "bg-red-800"    },
        worst: { label: "O(n²)",  color: "bg-red-800"    },
        space: { label: "O(1)",   color: "bg-green-800"  },
        pseudocode: `for i = 1 to n-1
  key = A[i]
  j = i - 1
  while j >= 0 and A[j] > key
    A[j+1] = A[j]
    j = j - 1
  A[j+1] = key`,
        tips: [
            "Highly efficient for small data sets or arrays that are already mostly sorted.",
            "Often used as the recursive base case in more complex algorithms like Quick Sort or Merge Sort.",
            "It is an adaptive, stable, and in-place sorting algorithm."
        ]
    },
    merge_sort: {
        name: "Merge Sort",
        description: "Recursively divides the array into halves, sorts each half, then merges the sorted halves.",
        best:  { label: "O(n log n)", color: "bg-yellow-600" },
        avg:   { label: "O(n log n)", color: "bg-yellow-600" },
        worst: { label: "O(n log n)", color: "bg-yellow-600" },
        space: { label: "O(n)",       color: "bg-orange-700" },
        pseudocode: `split(A, start, end)
  if start < end
    mid = (start + end) / 2
    split(A, start, mid)
    split(A, mid+1, end)
    merge(A, start, mid, end)`,
        tips: [
            "Guarantees O(n log n) performance in all cases, making it highly reliable.",
            "It is a stable sort, which is why it's often the default sorting algorithm in standard libraries (like Python's Timsort).",
            "It requires O(n) auxiliary space, making it less memory efficient than in-place algorithms like Quick Sort."
        ]
    },
    quick_sort: {
        name: "Quick Sort",
        description: "Selects a pivot, partitions array into elements less than/greater than pivot, recursively sorts partitions.",
        best:  { label: "O(n log n)", color: "bg-yellow-600" },
        avg:   { label: "O(n log n)", color: "bg-yellow-600" },
        worst: { label: "O(n²)",      color: "bg-red-800"    },
        space: { label: "O(log n)",   color: "bg-lime-700"   },
        pseudocode: `sort(A, low, high)
  if low < high
    p = partition(A, low, high)
    sort(A, low, p - 1)
    sort(A, p + 1, high)`,
        tips: [
            "In practice, it is usually faster than other O(n log n) algorithms because its inner loop can be efficiently implemented.",
            "The choice of pivot is critical; a bad pivot strategy can easily degrade performance to O(n²).",
            "It is typically implemented as an unstable, in-place sort."
        ]
    },
    radix_sort: {
        name: "Radix Sort",
        description: "Sorts integers digit by digit from least significant to most significant digit using stable sort.",
        best:  { label: "O(nk)",    color: "bg-yellow-600" },
        avg:   { label: "O(nk)",    color: "bg-yellow-600" },
        worst: { label: "O(nk)",    color: "bg-yellow-600" },
        space: { label: "O(n + k)", color: "bg-orange-700" },
        pseudocode: `for each digit i from 1 to k
  distribute elements to buckets
  collect elements from buckets
  // stable sort by digit i`,
        tips: [
            "It is a non-comparative integer sorting algorithm.",
            "Can be faster than O(n log n) algorithms for sorting large numbers of small integers.",
            "Requires extra memory for buckets, which increases its space complexity footprint to O(n + k)."
        ]
    },
};

function Badge({ label, color }) {
    return (
        <span className={`${color} text-white text-xs font-mono px-2 py-0.5 rounded`}>
            {label}
        </span>
    );
}

function AlgoInfo({ algorithm }) {
    const info = algoData[algorithm];
    if (!info) return null;

    return (
        <div className="glass rounded-2xl p-5 sticky top-4 flex flex-col max-h-[calc(100vh-32px)]">
            {/* Header */}
            <div className="mb-4 shrink-0">
                <h2 className="font-bold text-xl md:text-2xl gradient-text mb-2">{info.name}</h2>
                <p className="text-white/50 text-xs leading-relaxed">{info.description}</p>
            </div>

            <div className="w-full h-px bg-white/5 mb-4 shrink-0" />

            <div className="flex-1 overflow-y-auto pr-2 premium-scrollbar">
                {/* Complexity grid */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                    {[
                        { label: "Best",   value: info.best  },
                        { label: "Avg",    value: info.avg   },
                        { label: "Worst",  value: info.worst },
                        { label: "Space",  value: info.space },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-white/[0.03] border border-white/5 rounded-lg p-2 flex flex-col gap-1.5">
                            <span className="text-[9px] text-white/35 uppercase tracking-wider font-semibold">{label}</span>
                            <div>
                                <Badge label={value.label} color={value.color} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full h-px bg-white/5 mb-4" />

                {/* Pseudocode */}
                <h3 className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-3">Pseudocode</h3>
                <pre className="bg-black/30 border border-white/5 rounded-xl p-3 text-[10px] sm:text-xs text-[#a89dff] font-mono overflow-x-auto mb-5">
                    <code>{info.pseudocode}</code>
                </pre>

                <div className="w-full h-px bg-white/5 mb-5" />

                {/* Tips & Fun Facts */}
                <h3 className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb size={16} className="text-yellow-400" /> Did you know?
                </h3>
                <ul className="space-y-3 pb-2">
                    {info.tips.map((tip, index) => (
                        <li key={index} className="text-xs text-white/50 leading-relaxed flex items-start gap-2">
                            <span className="text-[#00d4ff]/50 mt-0.5 shrink-0">•</span>
                            <span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AlgoInfo;
