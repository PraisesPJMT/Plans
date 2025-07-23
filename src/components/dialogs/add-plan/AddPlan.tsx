import React, { useState, useRef, useEffect } from "react";

import Input from "../../form/Input";
import Select from "../../form/Select";
import styles from "../Dialog.module.css";
import Textarea from "../../form/Textarea";
import Button from "../../ui/button/Button";

import type { Plan } from "../../../types";

interface AddPlanProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: Plan) => void;
  isLoading: boolean;
}

const AddPlan: React.FC<AddPlanProps> = ({
  isOpen,
  onClose,
  onAdd,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isLoading) {
      handleClose();
    }

    if (e.key === "Tab") {
      const focusableElements = dialogRef.current?.querySelectorAll(
        "input, select, textarea, button:not([disabled])",
      );
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isLoading) return;

    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: "pending",
      dueDate: formData.dueDate,
      createdAt: new Date().toISOString(),
      priority: formData.priority,
    };

    onAdd(newPlan);
  };

  const handleClose = () => {
    if (isLoading) return;

    setFormData({
      title: "",
      description: "",
      dueDate: "",
      priority: "medium",
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value: newValue } = event.target;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      setTimeout(() => titleInputRef.current?.focus(), 0);

      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !isLoading) {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleEscapeKey);

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, isLoading]);

  if (!isOpen) return null;

  return (
    <section
      ref={dialogRef}
      className={styles.dialog}
      onKeyDown={handleKeyDown}
      aria-labelledby="add-dialog-title"
      aria-describedby="add-dialog-description"
      aria-modal="true"
      role="dialog"
    >
      <div className={styles.dialogContent}>
        <header className={styles.header}>
          <h2 id="add-dialog-title" className={styles.title}>
            Add New Plan
          </h2>
        </header>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            id="plan-title"
            name="title"
            label="Title"
            value={formData.title}
            error={errors.title}
            onChange={handleInputChange}
            loading={isLoading}
            maxLength={100}
            ref={titleInputRef}
            required
          />

          <Textarea
            id="plan-description"
            name="description"
            label="Description"
            value={formData.description}
            error={errors.description}
            onChange={handleInputChange}
            loading={isLoading}
            required
            maxLength={500}
            rows={3}
          />

          <Input
            type="date"
            id="plan-due-date"
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            error={errors.dueDate}
            onChange={handleInputChange}
            loading={isLoading}
            required
          />

          <Select
            id="plan-priority"
            name="priority"
            label="Priority"
            value={formData.priority}
            error={errors.priority}
            onChange={handleInputChange}
            loading={isLoading}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />

          <footer className={styles.footer}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
              title="Cancel editing plan"
            >
              Cancel
            </Button>

            <Button type="submit" loading={isLoading} title="Add plan">
              Add
            </Button>
          </footer>
        </form>
      </div>
    </section>
  );
};

export default AddPlan;
