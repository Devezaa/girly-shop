import React from "react";
import { Star, CheckCircle } from "lucide-react";

export default function ReviewsRail({ reviews = [] }) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <div className="mt-10 px-5">
            <h3 className="font-bold text-gray-900 text-lg tracking-tight mb-4">Lovely Reviews</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5 snap-x snap-mandatory scroll-smooth md:grid md:grid-cols-3 md:mx-0 md:px-0 md:overflow-visible">
                {reviews.map((review, idx) => (
                    <div key={idx} className="min-w-[220px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 snap-center group">
                        <div
                            className="flex gap-1 text-[#FFB040]"
                            aria-label={`Rated ${review.rating} out of 5 stars`}
                        >
                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                        <p className="text-gray-600 text-xs italic">"{review.comment}"</p>
                        <div className="flex items-center gap-2 mt-auto">
                            <div className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 text-[10px] font-bold">
                                {review.name[0]}
                            </div>
                            <span className="text-xs font-semibold text-gray-800">{review.name}</span>
                            <CheckCircle size={10} className="text-blue-400 ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
