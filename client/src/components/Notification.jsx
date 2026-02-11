import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ type = 'info', message, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const themes = {
        success: {
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            text: 'text-emerald-50'
        },
        error: {
            icon: <AlertCircle className="w-5 h-5 text-red-400" />,
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            text: 'text-red-50'
        },
        alert: {
            icon: <Info className="w-5 h-5 text-amber-400" />,
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            text: 'text-amber-50'
        },
        info: {
            icon: <Info className="w-5 h-5 text-blue-400" />,
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            text: 'text-blue-50'
        }
    };

    const theme = themes[type] || themes.info;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4 animate-slide-up">
            <div className={`glass ${theme.bg} ${theme.border} border rounded-2xl p-4 shadow-2xl flex items-start gap-3 backdrop-blur-xl`}>
                <div className="mt-0.5">{theme.icon}</div>
                <div className="flex-1">
                    <div className={`text-sm font-bold capitalize mb-0.5 ${theme.text}`}>{type}</div>
                    <div className="text-sm text-gray-300 leading-relaxed font-medium">{message}</div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Notification;
