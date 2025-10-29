

import React from "react";

export const getAnimationClasses = (delay: number = 0, duration: number = 0.6) => {
  const delayClass = `animate-entrance-delay-${Math.ceil(delay * 10)}`;
  return `animate-entrance ${delayClass}`;
};

export const getAnimationStyle = (duration: number = 0.6) => ({
  animationDuration: `${duration}s`,
});

export const createAnimation = (delay: number = 0, duration: number = 0.6, translateY: number = 20, rotate: number = 0) => {
  const delayClass = `animate-entrance-delay-${Math.ceil(delay * 10)}`;
  
  return {
    className: `animate-entrance ${delayClass}`,
    style: {
      animationDuration: `${duration}s`,
      '--ty-key-y': `${translateY}px`,
      '--ty-key-rotate': `${rotate}deg`,
    } as React.CSSProperties,
  };
};

export const getStaggeredAnimation = (index: number, delayBetween: number = 0.1, initialDelay: number = 0, duration: number = 0.6) => {
  const delay = initialDelay + (index * delayBetween);
  return createAnimation(delay, duration);
};


export const animations = {
  fadeIn: (delay: number = 0) => createAnimation(delay, 0.6, 20, 0),
  
  slideUp: (delay: number = 0) => createAnimation(delay, 0.6, 40, 0),
  
  slideUpRotate: (delay: number = 0) => createAnimation(delay, 0.6, 20, 5),
  
  quickFadeIn: (delay: number = 0) => createAnimation(delay, 0.3, 15, 0),
  
  slowFadeIn: (delay: number = 0) => createAnimation(delay, 1, 30, 0),
  
  cardEntrance: (delay: number = 0) => createAnimation(delay, 0.8, 25, 0),

  textEntrance: (delay: number = 0) => createAnimation(delay, 0.5, 15, 0),
};

export const counterAnimations = {
  counter: (delay: number = 0) => ({
    className: `counter-animate counter-animate-delay-${Math.ceil(delay * 10)}`,
    style: {
      animationDelay: `${delay}s`,
    } as React.CSSProperties,
  }),
};

export const useCounterAnimation = (endValue: number, duration: number = 2000, delay: number = 0) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = Date.now();
      const startValue = 0;
      
      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);
        
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };
      
      requestAnimationFrame(updateCount);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [endValue, duration, delay]);

  return { count };
};
