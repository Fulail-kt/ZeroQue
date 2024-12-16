// 'use client'
// import React, { useState } from 'react';
// import { useSwipeable } from 'react-swipeable';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Card } from "~/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "~/components/ui/dropdown-menu";

// interface SwipeCardProps {
//   children: React.ReactNode;
//   activeTab:string;
//   onSwipeLeft?: () => void;
//   onSwipeRight?: () => void;
//   className?: string;
//   disableSwipe?: boolean;
// }

// const SwipeCard: React.FC<SwipeCardProps> = ({ 
//   children, 
//   onSwipeLeft, 
//   onSwipeRight, 
//   className = '', 
//   disableSwipe = false 
// }) => {
//   const [swipeProgress, setSwipeProgress] = useState(0);
//   const [isRemoved, setIsRemoved] = useState(false);

//   // Swipe handlers
//   const handlers = useSwipeable({
//     onSwiping: (eventData) => {
//       if (disableSwipe) return;
//       // Track swipe progress
//       setSwipeProgress(eventData.deltaX);
//     },
//     onSwipedLeft: () => {
//       if (disableSwipe) return;
      
//       // If swiped significantly
//       if (swipeProgress < -100) {
//         setIsRemoved(true);
//         onSwipeLeft?.();
//       }
      
//       // Reset swipe progress
//       setSwipeProgress(0);
//     },
//     onSwipedRight: () => {
//       if (disableSwipe) return;
      
//       // If swiped significantly
//       if (swipeProgress > 100) {
//         setIsRemoved(true);
//         onSwipeRight?.();
//       }
      
//       // Reset swipe progress
//       setSwipeProgress(0);
//     },
//     delta: 10, // Minimum distance required to trigger a swipe
//   });

//   return (
//     <AnimatePresence>
//       {!isRemoved && (
//         <motion.div 
//           {...handlers}
//           initial={{ opacity: 1, scale: 1 }}
//           animate={{ 
//             opacity: 1, 
//             scale: 1 - Math.abs(swipeProgress) / 1000, 
//             x: swipeProgress 
//           }}
//           exit={{ 
//             opacity: 0, 
//             scale: 0.5, 
//             x: swipeProgress < 0 ? -500 : 500,
//             transition: { duration: 0.3 }
//           }}
//           transition={{ type: "spring", stiffness: 300, damping: 20 }}
//           className={`relative overflow-hidden touch-pan-y ${className}`}
//         >
//           {/* Swipe Left Overlay */}
//           {onSwipeLeft && !disableSwipe && (
//             <div 
//               className={`absolute inset-0 bg-red-500 flex items-center justify-end pr-4 text-white 
//                 z-0 transition-opacity duration-300 ease-in-out
//                 ${Math.abs(swipeProgress) > 100 ? 'opacity-100' : 'opacity-0'}`}
//             >
//               <span className="font-bold">Disable</span>
//             </div>
//           )}
          
//           {/* Card Content */}
//           <Card className="relative z-10">
//             {children}
//           </Card>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default SwipeCard;


'use client'
import React, { useState } from 'react';
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

  // Determine swipe restrictions based on active tab
  const isSwipeLeftDisabled = activeTab === 'inactive';
  const isSwipeRightDisabled = activeTab === 'active';

  // Swipe handlers
  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      // Prevent swiping beyond allowed directions
      if (
        (eventData.deltaX < 0 && isSwipeLeftDisabled) || 
        (eventData.deltaX > 0 && isSwipeRightDisabled)
      ) {
        return;
      }
      
      // Track swipe progress
      setSwipeProgress(eventData.deltaX);
    },
    onSwipedLeft: () => {
      // Prevent swiping left when on active tab
      if (isSwipeLeftDisabled) return;
      
      // If swiped significantly
      if (swipeProgress < -100) {
        setIsRemoved(true);
        onSwipeLeft?.();
      }
      
      // Reset swipe progress
      setSwipeProgress(0);
    },
    onSwipedRight: () => {
      // Prevent swiping right when on inactive tab
      if (isSwipeRightDisabled) return;
      
      // If swiped significantly
      if (swipeProgress > 100) {
        setIsRemoved(true);
        onSwipeRight?.();
      }
      
      // Reset swipe progress
      setSwipeProgress(0);
    },
    delta: 10, // Minimum distance required to trigger a swipe
  });

  // Determine overlay text and style based on active tab
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

  return (
    <AnimatePresence>
      {!isRemoved && (
        <motion.div 
          {...handlers}
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
          className={`relative overflow-hidden touch-pan-y ${className}`}
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
          <Card className="relative z-10">
            {children}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SwipeCard;