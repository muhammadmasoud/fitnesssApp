import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to use the calculation web worker
 * @returns {Object} - Methods and state for using the calculation worker
 */
const useCalculationWorker = () => {
  const [worker, setWorker] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Initialize the worker
  useEffect(() => {
    // Only create the worker in the browser environment
    if (typeof window !== 'undefined' && window.Worker) {
      const calculationWorker = new Worker('/calculation-worker.js');
      
      // Set up message handler
      calculationWorker.onmessage = (event) => {
        const { type, data } = event.data;
        
        if (type === 'error') {
          setError(data);
        } else {
          setResult(data);
        }
        
        setIsCalculating(false);
      };
      
      // Set up error handler
      calculationWorker.onerror = (error) => {
        setError(error.message);
        setIsCalculating(false);
      };
      
      setWorker(calculationWorker);
      
      // Clean up the worker when the component unmounts
      return () => {
        calculationWorker.terminate();
      };
    }
  }, []);
  
  // Calculate BMI
  const calculateBMI = useCallback((weight, height) => {
    if (!worker) return;
    
    setIsCalculating(true);
    setError(null);
    setResult(null);
    
    worker.postMessage({
      type: 'calculateBMI',
      data: { weight, height }
    });
  }, [worker]);
  
  // Calculate calories
  const calculateCalories = useCallback((age, gender, weight, height, activityLevel) => {
    if (!worker) return;
    
    setIsCalculating(true);
    setError(null);
    setResult(null);
    
    worker.postMessage({
      type: 'calculateCalories',
      data: { age, gender, weight, height, activityLevel }
    });
  }, [worker]);
  
  // Calculate workout statistics
  const calculateWorkoutStats = useCallback((workouts) => {
    if (!worker) return;
    
    setIsCalculating(true);
    setError(null);
    setResult(null);
    
    worker.postMessage({
      type: 'calculateWorkoutStats',
      data: { workouts }
    });
  }, [worker]);
  
  return {
    calculateBMI,
    calculateCalories,
    calculateWorkoutStats,
    result,
    error,
    isCalculating,
    isSupported: !!worker
  };
};

export default useCalculationWorker;
