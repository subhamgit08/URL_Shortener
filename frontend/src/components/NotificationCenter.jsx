import React from "react";
import { X, BellOff, BellRing } from "lucide-react";

export default function NotificationCenter({ 
    onClose, 
    isSubscribed, 
    onSubscribe, 
    onUnsubscribe, 
    notifications,
    onDeleteNotification // NEW: Added delete handler prop
}) {
    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800/80 bg-neutral-900/50">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-blue-400" />
                    Notifications
                </h3>
                <div className="flex items-center gap-1">
                    {isSubscribed && (
                        <button 
                            onClick={onUnsubscribe} 
                            title="Unsubscribe" 
                            className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        >
                            <BellOff className="w-4 h-4" />
                        </button>
                    )}
                    <button 
                        onClick={onClose} 
                        className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto max-h-[350px]">
                {!isSubscribed ? (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                            <BellRing className="w-6 h-6" />
                        </div>
                        <h4 className="text-white font-medium mb-2">Stay Updated</h4>
                        <p className="text-sm text-neutral-400 mb-6 px-4">
                            Subscribe to receive real-time updates and important announcements.
                        </p>
                        <button
                            onClick={onSubscribe}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                        >
                            Subscribe Now
                        </button>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-neutral-500 text-sm">You have no new notifications.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((msg, index) => (
                            <div key={index} className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-200 relative group">
                                {/* NEW: Delete button that appears on hover */}
                                <button 
                                    onClick={() => onDeleteNotification(index)}
                                    className="absolute top-2 right-2 p-1.5 text-blue-400/30 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete notification"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                                
                                <div className="flex items-start gap-3 pr-4">
                                    <span className="text-lg mt-0.5">🔔</span>
                                    <p className="text-sm leading-relaxed">{msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}