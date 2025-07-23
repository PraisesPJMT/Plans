import styles from "./Form.module.css";

type SelectProps = {
  label?: string;
  value: string;
  name: string;
  id: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  loading?: boolean;
  error?: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({
  label,
  value,
  name,
  id,
  onChange = () => {},
  required = false,
  loading,
  error,
  options,
  ...props
}: SelectProps) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor="edit-plan-due-date" className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      <select
        id={id}
        name={name}
        className={styles.select}
        value={value}
        onChange={onChange}
        disabled={loading}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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
};

export default Select;
