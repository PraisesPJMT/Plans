import React, { forwardRef } from "react";
import styles from "./Form.module.css";

type InputProps = {
  type?: string;
  label?: string;
  value?: string;
  name?: string;
  id?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  loading?: boolean;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      value,
      name,
      id,
      onChange = () => {},
      required = false,
      loading,
      error,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={styles.formGroup}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
            {required && (
              <span className={styles.required} aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          value={value}
          onChange={onChange}
          disabled={loading}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
          {...props}
        />
        {error && (
          <div
            id={`${id}-error`}
            className={styles.errorMessage}
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
