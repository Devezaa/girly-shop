
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Promotions = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch promotions from our local JSON (served via API or imported directly if we change architecture)
        // For now, mimicking API fetch from our local file structure via public folder if we moved it, 
        // but since we are dev, we can actually just fetch from the server endpoint if we make one.
        // Or simpler: We will fetch from a new endpoint I'll add to server.js OR just hardcode for demo if server isn't updated.
        // Let's assume we'll fetch from /api/promotions. I need to add this endpoint.

        const fetchPromos = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/promotions');
                if (response.ok) {
                    const data = await response.json();
                    setPromotions(data);
                } else {
                    console.error('Failed to fetch promotions');
                }
            } catch (error) {
                console.error('Error fetching promotions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] pt-24 px-4 flex justify-center items-center">
                <div className="animate-pulse text-rose-300">Loading Campaigns...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-serif text-[#1a0b0b] mb-4">
                        Campaigns & Editorials
                    </h1>
                    <p className="text-[#5d5454] max-w-2xl mx-auto">
                        Explore our latest collections and featured looks.
                        Discover the beauty behind the products.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {promotions.map((promo, index) => (
                        <motion.div
                            key={promo.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-white"
                        >
                            <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden">
                                <img
                                    src={promo.image}
                                    alt={promo.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 md:p-8 pt-24">
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs tracking-wider uppercase rounded-full mb-3">
                                    {promo.type || 'Campaign'}
                                </span>
                                <h3 className="text-white text-2xl font-serif mb-2">
                                    {promo.title}
                                </h3>
                                <p className="text-white/90 text-sm mb-4">
                                    {promo.subtitle}
                                </p>
                                <Link
                                    to="/shop"
                                    className="inline-block text-white border-b border-white pb-1 hover:text-rose-200 hover:border-rose-200 transition-colors"
                                >
                                    Shop the Look
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {promotions.length === 0 && (
                    <div className="text-center py-20 text-[#5d5454]">
                        <p>No active campaigns at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Promotions;
