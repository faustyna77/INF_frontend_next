import { useState, useEffect, useRef } from 'react';
import skeletonGif from '../assets/skeleton.gif';

const FloatingSkeleton = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const size = 64;
  const movementTimer = useRef(null);

  // Configuration
  const BOTTOM_EXCLUSION_ZONE = 150; // Pixels from bottom to avoid
  const MIN_DISTANCE = 200;
  const BASE_DELAY = 8000;
  const RANDOM_DELAY_ADDITION = 4000;
  const MOVE_DURATION = 3000;

  const getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const moveImage = (immediate = false) => {
    if (movementTimer.current) {
      clearTimeout(movementTimer.current);
    }

    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size - BOTTOM_EXCLUSION_ZONE; // Subtract exclusion zone
    
    let newX, newY, attempts = 0;
    
    do {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
      attempts++;
      if (attempts > 10) break;
    } while (
      getDistance(position.x, position.y, newX, newY) < MIN_DISTANCE &&
      !immediate
    );

    const newRotation = Math.random() * 360;

    setPosition({ x: newX, y: newY });
    setRotation(newRotation);
    
    const delay = immediate ? 0 : BASE_DELAY + Math.random() * RANDOM_DELAY_ADDITION;
    movementTimer.current = setTimeout(() => moveImage(), delay);
  };

  useEffect(() => {
    moveImage(true);
    return () => {
      if (movementTimer.current) {
        clearTimeout(movementTimer.current);
      }
    };
  }, [size]);

  const handleHover = () => {
    setIsHovered(true);
    moveImage(true);
    const timer = setTimeout(() => setIsHovered(false), 300);
    return () => clearTimeout(timer);
  };

  return (
    <img 
      src={skeletonGif}
      alt="Floating Skeleton"
      className="fixed z-10 transition-all ease-in-out cursor-pointer"
      style={{
        width: size,
        height: size,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        filter: isHovered ? 'brightness(1.5) sepia(1) saturate(5) hue-rotate(-50deg)' : 'none',
        transition: `
          transform ${MOVE_DURATION}ms ease-in-out, 
          filter 150ms cubic-bezier(0.4, 0, 0.2, 1)
        `,
        pointerEvents: 'auto'
      }}
      onMouseEnter={handleHover}
    />
  );
};

export default FloatingSkeleton;