declare module 'react-calcboard' {
  import { Component } from 'react'

  interface CalculatorTheme {
    numberButton?: string
    operationButton?: string
    functionButton?: string
    display?: string
    container?: string
  }

  interface CalculatorProps {
    className?: string
    orientation?: 'portrait' | 'landscape'
    theme?: CalculatorTheme
    enableKeyboard?: boolean
  }

  export class Calculator extends Component<CalculatorProps> {}
  export class CalculatorButton extends Component<any> {}
  export class CalculatorDisplay extends Component<any> {}
  export function useCalculator(enableKeyboard?: boolean): {
    display: string
    handleInput: (input: string) => void
    reset: () => void
  }
}
