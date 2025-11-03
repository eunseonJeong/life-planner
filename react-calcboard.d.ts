declare module 'react-calcboard' {
  import React from 'react';

  export interface CalculatorTheme {
    numberButton?: string;
    operationButton?: string;
    functionButton?: string;
    display?: string;
    container?: string;
  }

  export interface CalculatorProps {
    className?: string;
    orientation?: 'portrait' | 'landscape';
    theme?: CalculatorTheme;
    enableKeyboard?: boolean;
    enableHistory?: boolean;
  }

  export const Calculator: React.FC<CalculatorProps>;
  export const CalculatorButton: React.FC<any>;
  export const CalculatorDisplay: React.FC<any>;
  export const CalculatorHistory: React.FC<any>;
  
  export function useCalculator(enableKeyboard?: boolean): {
    display: string;
    handleInput: (input: string) => void;
    reset: () => void;
  };
}
