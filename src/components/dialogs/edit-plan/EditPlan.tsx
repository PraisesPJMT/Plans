import React, { useState, useRef, useEffect } from "react";

import Input from "../../form/Input";
import Select from "../../form/Select";
import styles from "../Dialog.module.css";
import Textarea from "../../form/Textarea";
import Button from "../../ui/button/Button";

import type { Plan } from "../../../types";

interface EditPlanProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, updatedPlan: Partial<Plan>) => void;
  plan: Plan | null;
  isLoading: boolean;
}

const EditPlan: React.FC<EditPlanProps> = ({
  isOpen,
  onClose,
  onEdit,
  plan,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
    status: "pending" as "pending" | "completed",
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isLoading || !plan) return;

    const updatedData: Partial<Plan> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: formData.status,
    };

    onEdit(plan.id, updatedData);
  };

  const handleClose = () => {
    if (isLoading) return;

    setErrors({});
    onClose();
  };

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title,
        description: plan.description,
        dueDate: plan.dueDate,
        priority: plan.priority,
        status: plan.status,
      });
      setErrors({});
    }
  }, [plan]);

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

  if (!isOpen || !plan) return null;

  return (
    <section
      ref={dialogRef}
      className={styles.dialog}
      onKeyDown={handleKeyDown}
      aria-labelledby="edit-dialog-title"
      aria-describedby="edit-dialog-description"
      aria-modal="true"
      role="dialog"
    >
      <div className={styles.dialogContent}>
        <header className={styles.header}>
          <h2 id="edit-dialog-title" className={styles.title}>
            Edit Plan
          </h2>
        </header>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            id="edit-plan-title"
            name="title"
            label="Title"
            value={formData.title}
            error={errors.title}
            onChange={handleInputChange}
            loading={isLoading}
            maxLength={100}
            required
            ref={titleInputRef}
          />

          <Textarea
            id="edit-plan-description"
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
            id="edit-plan-due-date"
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            error={errors.dueDate}
            onChange={handleInputChange}
            loading={isLoading}
            required
          />

          <Select
            id="edit-plan-priority"
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

          <Select
            id="edit-plan-status"
            name="status"
            label="Status"
            value={formData.status}
            error={errors.status}
            onChange={handleInputChange}
            loading={isLoading}
            options={[
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
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

            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              title="Update plan"
            >
              Update
            </Button>
          </footer>
        </form>
      </div>
    </section>
  );
};

export default EditPlan;
