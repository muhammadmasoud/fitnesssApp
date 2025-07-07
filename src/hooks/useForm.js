import { useContext } from 'react';
import { FormContext } from '../contexts/FormContextDefinition';

/**
 * Custom hook to use the form context
 * @returns {Object} Form context value
 */
export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
