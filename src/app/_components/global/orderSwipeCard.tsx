





'use client'
import React, { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "~/components/ui/card";
import { Order } from '~/store/orderStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OrderSwipeCardProps {
  children: React.ReactNode;
  currentStatus: Order['status'];
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onViewOrder?: () => void;
  className?: string;
}

const OrderSwipeCard2: React.FC<OrderSwipeCardProps> = ({ 
  children, 
  currentStatus,
  onSwipeLeft, 
  onSwipeRight,
  onViewOrder,
  className = '' 
}) => {
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const dragRef = useRef<{ startX: number | null; startTime: number }>({ startX: null, startTime: 0 });

  const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'cancelled'] as const;
  const currentIndex = statusFlow.indexOf(currentStatus);
  
  const isSwipeLeftDisabled = currentStatus === 'pending';
  const isSwipeRightDisabled = currentStatus === 'cancelled' || currentStatus === 'ready';

  const getNextStatus = () => {
    if (currentIndex < statusFlow.length - 1 && !isSwipeRightDisabled) {
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  const getPrevStatus = () => {
    if (currentIndex > 0 && !isSwipeLeftDisabled) {
      return statusFlow[currentIndex - 1];
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-element')) {
      return;
    }
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - swipeProgress,
      startTime: Date.now()
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragRef.current.startX === null) return;

    const currentX = e.clientX;
    const deltaX = currentX - dragRef.current.startX;

    if ((deltaX < 0 && isSwipeLeftDisabled) || (deltaX > 0 && isSwipeRightDisabled)) {
      return;
    }

    setSwipeProgress(deltaX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setShowHints(false);
    if (!isDragging) return;

    const dragDuration = Date.now() - dragRef.current.startTime;
    const isClick = dragDuration < 200 && Math.abs(swipeProgress) < 10;

    if (isClick && onViewOrder && !(e.target as HTMLElement).closest('.interactive-element')) {
      onViewOrder();
    } else {
      if (swipeProgress < -100 && !isSwipeLeftDisabled) {
        onSwipeLeft?.();
      } else if (swipeProgress > 100 && !isSwipeRightDisabled) {
        onSwipeRight?.();
      }
    }

    setIsDragging(false);
    dragRef.current = { startX: null, startTime: 0 };
    setSwipeProgress(0);
  };

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      if ((eventData.event.target as HTMLElement).closest('.interactive-element')) {
        return;
      }

      if ((eventData.deltaX < 0 && isSwipeLeftDisabled) || 
          (eventData.deltaX > 0 && isSwipeRightDisabled)) {
        return;
      }
      setSwipeProgress(eventData.deltaX);
    },
    onSwipedLeft: () => {
      if (isSwipeLeftDisabled) return;
      if (swipeProgress < -100) {
        onSwipeLeft?.();
      }
      setSwipeProgress(0);
    },
    onSwipedRight: () => {
      if (isSwipeRightDisabled) return;
      if (swipeProgress > 100) {
        onSwipeRight?.();
      }
      setSwipeProgress(0);
    },
    delta: 10,
    preventScrollOnSwipe: true,
  });



  const getSwipeHint = () => {
    const nextStatus = getNextStatus();
    const prevStatus = getPrevStatus();
    
    if (swipeProgress > 50 && nextStatus) {
      return `Swipe right to ${nextStatus}`;
    }
    if (swipeProgress < -50 && prevStatus) {
      return `Swipe left to ${prevStatus}`;
    }
    return '';
  };

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
    <motion.div 
      {...swipeHandlers}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseEnter={() => setShowHints(true)}
      initial={{ opacity: 1 }}
      animate={{ 
        x: swipeProgress,
        scale: 1 - Math.abs(swipeProgress) / 1000,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative group ${className}`}
    >
      {/* Status Action Hints */}
      <div className={`absolute h-10 inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center 
        bg-black/20 cursor-pointer rounded-full text-white z-10 transition-opacity duration-300
        ${Math.abs(swipeProgress) > 50 ? 'opacity-100' : 'opacity-0'}`}>
        <span className="font-bold">{getSwipeHint()}</span>
      </div>
      
      {/* Main Content with Border Color */}
      <Card 
        className={`relative transition-all duration-200 border-2 
          ${getBorderColor()} shadow-lg hover:cursor-pointer cursor-pointer`}
      >
        {children}
        
        {/* View Order Button */}
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onViewOrder?.();
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
             px-4 py-2 rounded-full shadow-lg text-sm font-medium
              transition-all duration-200
            interactive-element z-10"
        >
          View Order
        </button> */}
      </Card>
    </motion.div>
  );
};

export default OrderSwipeCard2;