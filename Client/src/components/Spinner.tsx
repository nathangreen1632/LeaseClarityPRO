import React from 'react';

interface SpinnerProps {
  size?: number;      // px
  color?: string;     // CSS color string, e.g. 'var(--theme-primary)'
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
                                           size = 32,
                                           color = 'var(--theme-primary)',
                                           className = '',
                                         }) => (
  <div
    className={`inline-block animate-spin ${className}`}
    style={{
      width: size,
      height: size,
      borderWidth: size / 8,
      borderStyle: 'solid',
      borderColor: `${color} transparent ${color} transparent`,
      borderRadius: '50%',
    }}
    aria-label="Loading"
    role="alert"
  />
);

export default Spinner;
