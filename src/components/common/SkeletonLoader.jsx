import React from "react";

export default function SkeletonLoader({ count = 4, type = "product" }) {
    if (type === "banner") {
        return (
            <div className="mt-4 px-5">
                <div className="w-full h-[320px] md:h-[500px] rounded-2xl bg-gray-200 animate-pulse" />
            </div>
        );
    }

    if (type === "category") {
        return (
            <div className="px-5 mt-12 mb-12 flex gap-3 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="min-w-[80px] h-[90px] rounded-2xl bg-gray-100 animate-pulse flex flex-col items-center justify-center gap-2 p-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div className="w-12 h-3 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Product List Skeleton
    // Product List Skeleton
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div key={i} className="w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="h-40 bg-gray-200 animate-pulse w-full" />
                    <div className="p-3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                        <div className="flex justify-between mt-2">
                            <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
