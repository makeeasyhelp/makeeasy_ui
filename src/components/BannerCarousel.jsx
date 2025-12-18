import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Icon from './ui/Icon';

const BannerCarousel = ({ banners = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Auto-play carousel
    useEffect(() => {
        if (banners.length <= 1) return;

        const timer = setInterval(() => {
            nextBanner();
        }, 5000); // Change every 5 seconds

        return () => clearInterval(timer);
    }, [currentIndex, banners.length]);

    const nextBanner = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevBanner = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToBanner = (index) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    if (!banners || banners.length === 0) {
        return null;
    }

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            nextBanner();
                        } else if (swipe > swipeConfidenceThreshold) {
                            prevBanner();
                        }
                    }}
                    className="absolute inset-0"
                >
                    {/* Banner Image with Overlay */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(${banners[currentIndex]?.image})`,
                        }}
                    >
                        {/* Dark Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                    </div>

                    {/* Banner Content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                            <div className="max-w-2xl">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight"
                                >
                                    {banners[currentIndex]?.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xl md:text-2xl text-white/90 mb-3"
                                >
                                    {banners[currentIndex]?.subtitle}
                                </motion.p>
                                {banners[currentIndex]?.description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-base md:text-lg text-white/80 mb-6"
                                    >
                                        {banners[currentIndex]?.description}
                                    </motion.p>
                                )}
                                {banners[currentIndex]?.link && (
                                    <motion.a
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        href={banners[currentIndex]?.link}
                                        className="inline-block bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-8 py-3 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity shadow-2xl"
                                    >
                                        {banners[currentIndex]?.buttonText || 'Learn More'}
                                    </motion.a>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevBanner}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hidden md:block"
                        aria-label="Previous banner"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextBanner}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hidden md:block"
                        aria-label="Next banner"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dot Indicators */}
            {banners.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToBanner(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                            aria-label={`Go to banner ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BannerCarousel;
