import type { FC, ReactNode } from "react"

type ButtonProps = {
  children: ReactNode;
  className?: string;
  onClick: () => void;
}

export const Button: FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      className={`${className}`}
      onClick={onClick}
    >
      { children }
    </button>
  )
}