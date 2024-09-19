import React from 'react';
import styles from './styles.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading,
  children,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
