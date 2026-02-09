import React, { useState } from 'react';
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Mail,
    MessageSquare,
    Phone,
    Shield,
    Info,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export default function RefundPolicy({ isDashboard = false }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const policies = [
        {
            id: "1",
            title: "1. No Refunds on Opt-Out or Cancellation",
            subsections: [
                {
                    title: "Refund Policy",
                    content: "Once a subscription has been purchased and activated, no refunds will be issued under any circumstances."
                },
                {
                    title: "Final Payments",
                    content: "All payments made towards our platform, courses, or any other paid services are final and non-refundable."
                },
                {
                    title: "Service Shutdown",
                    content: "In the event of an unexpected or abrupt shutdown of services, the platform shall not be obligated to provide refunds for any fees, subscriptions, or payments made by users. This includes, but is not limited to: • Subscription fees • Course payments • Any other paid offerings"
                },
                {
                    title: "Cancellation Policy",
                    content: "Cancellations or mid-term opt-outs are not permitted to ensure fairness and consistency for all users."
                }
            ]
        }
    ];

    return (
        <div className={`${isDashboard ? "bg-transparent" : "min-h-screen " + (isDark ? "bg-black" : "bg-white")} text-foreground selection:bg-blue-500/20`}>
            <main className={`container mx-auto px-6 ${isDashboard ? "py-0" : "py-12 md:py-20"} max-w-4xl`}>
                {/* Only show title if not in dashboard (dashboard provides its own header) */}
                {!isDashboard && (
                    <div className="mb-12 text-left">
                        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                            Cancellation, Refund Policy & Terms
                        </h1>
                    </div>
                )}

                {/* Policy Card */}
                <div className={`${isDark ? "bg-[#0a0a0a] border-white/[0.08]" : "bg-white border-slate-200"} border rounded-2xl overflow-hidden shadow-2xl transition-colors`}>
                    <div className="p-8 md:p-12 space-y-12">
                        {policies.map((section) => (
                            <div key={section.id} className="space-y-10">
                                <h2 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
                                    {section.title}
                                </h2>
                                <div className="space-y-10">
                                    {section.subsections.map((sub, idx) => (
                                        <div key={idx} className="space-y-3">
                                            <h3 className={`text-lg font-bold tracking-tight uppercase ${isDark ? "text-white" : "text-slate-800"}`}>
                                                {sub.title}
                                            </h3>
                                            <p className={`text-lg leading-relaxed font-normal ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                                {sub.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Minimal Footer */}
                <div className={`mt-20 flex flex-col items-center gap-6 ${isDark ? "opacity-20" : "opacity-40"}`}>
                    {!isDashboard && <div className={`h-px w-full bg-gradient-to-r from-transparent via-${isDark ? "white" : "slate-300"}/20 to-transparent`} />}
                    <p className="text-xs font-medium tracking-widest uppercase">© 2026 Campus Career Platform</p>
                </div>
            </main>
        </div>
    );
}