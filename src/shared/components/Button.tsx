import type { FC, ReactNode } from "react"

type ButtonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

export const Button: FC<ButtonProps> = ({ children, onClick, className, disabled }) => {
  return (
    <button
      className={`${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      { children }
    </button>
  )
}