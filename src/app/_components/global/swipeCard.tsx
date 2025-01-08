'use client'
import React, { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "~/components/ui/card";

interface SwipeCardProps {
  children: React.ReactNode;
  activeTab: 'active' | 'inactive';
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ 
  children, 
  activeTab,
  onSwipeLeft, 
  onSwipeRight, 
  className = '' 
}) => {
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number | null }>({ startX: null });

  const isSwipeLeftDisabled = activeTab === 'inactive';
  const isSwipeRightDisabled = activeTab === 'active';

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current.startX = e.clientX - swipeProgress;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragRef.current.startX === null) return;

    const currentX = e.clientX;
    const deltaX = currentX - dragRef.current.startX;

    // Prevent swiping in disabled directions
    if ((deltaX < 0 && isSwipeLeftDisabled) || (deltaX > 0 && isSwipeRightDisabled)) {
      return;
    }

    setSwipeProgress(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    if (swipeProgress < -100 && !isSwipeLeftDisabled) {
      setIsRemoved(true);
      onSwipeLeft?.();
    } else if (swipeProgress > 100 && !isSwipeRightDisabled) {
      setIsRemoved(true);
      onSwipeRight?.();
    }

    setIsDragging(false);
    dragRef.current.startX = null;
    setSwipeProgress(0);
  };

  // Touch swipe handlers
  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      if (
        (eventData.deltaX < 0 && isSwipeLeftDisabled) || 
        (eventData.deltaX > 0 && isSwipeRightDisabled)
      ) {
        return;
      }
      setSwipeProgress(eventData.deltaX);
    },
    onSwipedLeft: () => {
      if (isSwipeLeftDisabled) return;
      if (swipeProgress < -100) {
        setIsRemoved(true);
        onSwipeLeft?.();
      }
      setSwipeProgress(0);
    },
    onSwipedRight: () => {
      if (isSwipeRightDisabled) return;
      if (swipeProgress > 100) {
        setIsRemoved(true);
        onSwipeRight?.();
      }
      setSwipeProgress(0);
    },
    delta: 10,
    preventScrollOnSwipe: true,
  });

  const getOverlayContent = () => {
    if (activeTab === 'active') {
      return { text: 'Cannot Disable', bgColor: 'bg-gray-300' };
    }
    if (activeTab === 'inactive') {
      return { text: 'Cannot Activate', bgColor: 'bg-gray-300' };
    }
    return { text: '', bgColor: '' };
  };

  const overlayContent = getOverlayContent();

  // Calculate border color based on swipe progress
  const getBorderColor = () => {
    if (swipeProgress > 50 && !isSwipeRightDisabled) {
      return 'border-green-500';
    }
    if (swipeProgress < -50 && !isSwipeLeftDisabled) {
      return 'border-red-500';
    }
    return 'border-transparent';
  };

  return (
    <AnimatePresence>
      {!isRemoved && (
        <motion.div 
          {...swipeHandlers}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ 
            opacity: 1, 
            scale: 1 - Math.abs(swipeProgress) / 1000, 
            x: (isSwipeLeftDisabled && swipeProgress < 0) || 
               (isSwipeRightDisabled && swipeProgress > 0) 
               ? 0 
               : swipeProgress 
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.5, 
            x: swipeProgress < 0 ? -500 : 500,
            transition: { duration: 0.3 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`relative overflow-hidden select-none touch-pan-y
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
        >
          {/* Swipe Overlay */}
          {((isSwipeLeftDisabled && swipeProgress < 0) || 
            (isSwipeRightDisabled && swipeProgress > 0)) && (
            <div 
              className={`absolute inset-0 ${overlayContent.bgColor} flex items-center 
                ${swipeProgress < 0 ? 'justify-end pr-4' : 'justify-start pl-4'} 
                text-white z-0 transition-opacity duration-300 ease-in-out 
                opacity-${Math.abs(swipeProgress) > 50 ? '100' : '0'}`}
            >
              <span className="font-bold">{overlayContent.text}</span>
            </div>
          )}
          
          {/* Card Content */}
          <Card 
            className={`relative z-10 transition-all duration-200 border-2 
              ${getBorderColor()}  shadow-lg`}
          >
            {children}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SwipeCard;