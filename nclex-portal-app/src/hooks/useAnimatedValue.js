// src/hooks/useAnimatedValue.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for animating numeric values with easing
 * @param {number} initialValue - Starting value
 * @param {number} targetValue - Target value to animate to
 * @param {Object} options - Animation options
 * @returns {number} - Current animated value
 */
export const useAnimatedValue = (
  initialValue = 0,
  targetValue = 0,
  options = {}
) => {
  const {
    duration = 1000,
    easing = 'easeOutCubic',
    delay = 0,
    precision = 0,
    onComplete = null,
    onUpdate = null,
    autoStart = true,
  } = options;

  const [value, setValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef();
  const startTimeRef = useRef();
  const startValueRef = useRef(initialValue);
  const completeCallbackRef = useRef(onComplete);
  const updateCallbackRef = useRef(onUpdate);

  // Update callback refs
  useEffect(() => {
    completeCallbackRef.current = onComplete;
    updateCallbackRef.current = onUpdate;
  }, [onComplete, onUpdate]);

  // Easing functions
  const easingFunctions = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - (--t) * t * t * t,
    easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),
    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => 1 + (--t) * t * t * t * t,
    easeInOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t),
    easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
    easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
    easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
    easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    easeInOutExpo: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    easeInCirc: (t) => 1 - Math.sqrt(1 - Math.pow(t, 2)),
    easeOutCirc: (t) => Math.sqrt(1 - Math.pow(t - 1, 2)),
    easeInOutCirc: (t) => {
      return t < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
    },
    easeInBack: (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * t * t * t - c1 * t * t;
    },
    easeOutBack: (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    easeInOutBack: (t) => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    },
    easeInElastic: (t) => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
    },
    easeOutElastic: (t) => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    easeInOutElastic: (t) => {
      const c5 = (2 * Math.PI) / 4.5;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    },
    easeInBounce: (t) => 1 - easingFunctions.easeOutBounce(1 - t),
    easeOutBounce: (t) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    },
    easeInOutBounce: (t) => {
      return t < 0.5
        ? (1 - easingFunctions.easeOutBounce(1 - 2 * t)) / 2
        : (1 + easingFunctions.easeOutBounce(2 * t - 1)) / 2;
    },
  };

  const animate = useCallback(() => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min((elapsed - delay) / duration, 1);

    if (progress <= 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const easingFunction = easingFunctions[easing] || easingFunctions.easeOutCubic;
    const easedProgress = easingFunction(progress);
    
    const startValue = startValueRef.current;
    const deltaValue = targetValue - startValue;
    const currentValue = startValue + deltaValue * easedProgress;
    
    // Apply precision
    const roundedValue = precision === 0 
      ? Math.round(currentValue)
      : Math.round(currentValue * Math.pow(10, precision)) / Math.pow(10, precision);
    
    setValue(roundedValue);
    
    // Call update callback
    if (updateCallbackRef.current) {
      updateCallbackRef.current(roundedValue, progress);
    }

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      // Call complete callback
      if (completeCallbackRef.current) {
        completeCallbackRef.current(roundedValue);
      }
    }
  }, [targetValue, duration, easing, delay, precision]);

  // Start animation
  const start = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    startTimeRef.current = Date.now();
    startValueRef.current = value;
    setIsAnimating(true);
    animationRef.current = requestAnimationFrame(animate);
  }, [value, animate]);

  // Stop animation
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  // Reset to initial value
  const reset = useCallback(() => {
    stop();
    setValue(initialValue);
    startValueRef.current = initialValue;
  }, [initialValue, stop]);

  // Set value immediately without animation
  const set = useCallback((newValue) => {
    stop();
    setValue(newValue);
    startValueRef.current = newValue;
  }, [stop]);

  // Auto-start animation when target changes
  useEffect(() => {
    if (autoStart && targetValue !== value) {
      start();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, autoStart]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    value,
    isAnimating,
    start,
    stop,
    reset,
    set,
  };
};