declare module 'react-calcboard' {
  import { Component } from 'react'

  interface CalcBoardProps {
    theme?: 'light' | 'dark'
    size?: 'small' | 'medium' | 'large'
    onResult?: (result: any) => void
    className?: string
    style?: React.CSSProperties
  }

  export class CalcBoard extends Component<CalcBoardProps> {}
}
