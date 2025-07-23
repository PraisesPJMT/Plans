import { CgSpinner } from 'react-icons/cg';
import type { ButtonVariant } from '../../../types';

import styles from './Button.module.css';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
};

const Button = ({
  children,
  type = 'submit',
  variant = 'primary',
  onClick = () => {},
  loading = false,
  disabled = false,
  title,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${
        variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary
      } ${loading ? styles.loading : ''}`}
      onClick={onClick}
      disabled={loading || disabled}
      aria-label={title}
      title={title}
    >
      {!loading && children}
      {loading && <CgSpinner className={styles.spinner} />}
    </button>
  );
};

export default Button;