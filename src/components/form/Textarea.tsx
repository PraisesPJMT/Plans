import styles from "./Form.module.css";

type TextareaProps = {
  label?: string;
  value?: string;
  name?: string;
  id?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  loading?: boolean;
  error?: string;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = ({
  label,
  value,
  name,
  id,
  onChange = () => {},
  required = false,
  loading,
  error,
  rows = 4,
  ...props
}: TextareaProps) => {
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
      <textarea
        id={id}
        name={name}
        className={`${styles.textarea} ${error ? styles.inputError : ""}`}
        value={value}
        onChange={onChange}
        disabled={loading}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        required
        rows={rows}
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
};

export default Textarea;
