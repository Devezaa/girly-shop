import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorDisplay({ message = "Something went wrong.", onRetry }) {
    return (
        <div role="alert" className="flex flex-col items-center justify-center py-20 px-5 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Oops!</h3>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition-colors"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            )}
        </div>
    );
}
