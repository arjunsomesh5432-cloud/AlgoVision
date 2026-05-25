import React, { useEffect, useRef, useContext } from 'react';
import { SortingContext } from '../contexts/SortingContext';

function ActivityLog() {
    const { activityLog } = useContext(SortingContext);
    const logEndRef = useRef(null);

    // Auto-scroll to newest entry
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activityLog]);

    return (
        <div className="glass rounded-2xl p-5 sticky top-4 flex flex-col max-h-[calc(100vh-32px)]">
            <h3 className="font-bold text-lg text-white mb-4 shrink-0">Activity Log</h3>
            
            <div className="w-full h-px bg-white/5 mb-4 shrink-0" />

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 premium-scrollbar">
                {activityLog.length === 0 ? (
                    <div className="text-white/30 text-sm italic text-center mt-4">Waiting to sort...</div>
                ) : (
                    activityLog.map(log => {
                        let colorClass = "text-white/60";
                        if (log.type === "swap") colorClass = "text-[#00d4ff]";
                        if (log.type === "compare") colorClass = "text-white/40";
                        if (log.type === "action") colorClass = "text-[#a89dff] font-medium";

                        return (
                            <div key={log.id} className={`text-sm ${colorClass} animate-fade-in`}>
                                {log.message}
                            </div>
                        );
                    })
                )}
                <div ref={logEndRef} />
            </div>
        </div>
    );
}

export default ActivityLog;
