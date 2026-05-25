import { useContext } from "react";
import SortingChart from "./components/SortingChart";
import SortingProvider, { SortingContext } from "./contexts/SortingContext";
import ShaderBackground from "./components/ui/shader-background";
import AlgoInfo from "./components/AlgoInfo";
import ActivityLog from "./components/ActivityLog";

function DashboardLayout() {
    const { sortingState } = useContext(SortingContext);
    
    return (
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col xl:flex-row items-start gap-4 xl:gap-6 justify-center">
            {/* Left Sidebar */}
            <aside className="w-full xl:w-[260px] shrink-0 order-2 xl:order-1">
                <AlgoInfo algorithm={sortingState.algorithm} />
            </aside>
            
            {/* Center Column */}
            <main className="w-full xl:w-[760px] xl:max-w-[760px] shrink-0 order-1 xl:order-2">
                <SortingChart />
            </main>
            
            {/* Right Sidebar */}
            <aside className="w-full xl:w-[260px] shrink-0 order-3 xl:order-3">
                <ActivityLog />
            </aside>
        </div>
    );
}

function App() {
    return (
        <SortingProvider>
            <div className="min-h-screen relative overflow-x-hidden">
                {/* Animated WebGL shader background */}
                <ShaderBackground />

                {/* Navbar */}
                <nav className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="AlgoVision Logo" className="h-9 w-auto object-contain" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/30 font-medium tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse inline-block" />
                        Sorting Visualizer
                    </div>
                </nav>

                {/* Dashboard Layout */}
                <DashboardLayout />
            </div>
        </SortingProvider>
    );
}

export default App;
