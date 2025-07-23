import { useState } from "react";
import { FaGripVertical } from "react-icons/fa";
import {
  FiEdit,
  FiTrash2,
  FiCheck,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";

import usePlans from "../../hooks/usePlans";
import EditPlan from "../dialogs/edit-plan/EditPlan";

import styles from "./PlanItem.module.css";

import type { Plan } from "../../types";

const PlanItem = ({ plan }: { plan: Plan }) => {
  const {
    togglePlanStatus,
    deletePlan,
    handleDragStart,
    handleDragOver,
    handleDrop,
    loading,
    editPlan,
  } = usePlans();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(plan);

  const handleEditPlan = async (id: string, updatedPlan: Partial<Plan>) => {
    await editPlan(id, updatedPlan);
    setIsEditDialogOpen(false);
    setPlanToEdit(null);
  };

  const openEditDialog = (plan: Plan) => {
    setPlanToEdit(plan);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setPlanToEdit(null);
  };

  const handleDeletePlan = async () => {
    await deletePlan(plan.id);
  };

  const isOverdue =
    new Date(plan.dueDate) < new Date() && plan.status !== "completed";

  const getStatusInfo = () => {
    if (plan.status === "completed") {
      return { icon: FiCheck, color: "success", label: "Completed" };
    }
    if (isOverdue) {
      return { icon: FiAlertTriangle, color: "danger", label: "Overdue" };
    }
    return { icon: FiClock, color: "warning", label: "Pending" };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const getPriorityClass = () => {
    switch (plan.priority) {
      case "high":
        return styles.priorityHigh;
      case "medium":
        return styles.priorityMedium;
      case "low":
        return styles.priorityLow;
      default:
        return "";
    }
  };

  return (
    <>
      <div
        className={`${styles.planItem} ${styles[statusInfo.color]} ${getPriorityClass()}`}
        draggable={true}
        onDragStart={(event) => handleDragStart(event, plan)}
        onDragOver={(event) => handleDragOver(event)}
        onDrop={(event) => handleDrop(event, plan)}
        role="article"
        aria-label={`Plan: ${plan.title}`}
      >
        <div className={styles.dragHandle} aria-label="Drag to reorder">
          <FaGripVertical />
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{plan.title}</h3>
            <div className={styles.statusBadge}>
              <StatusIcon className={styles.statusIcon} />
              <span className={styles.statusText}>{statusInfo.label}</span>
            </div>
          </div>

          <p className={styles.description}>{plan.description}</p>

          <div className={styles.metadata}>
            <div className={styles.dueDate}>
              <span className={styles.label}>Due:</span>
              <time dateTime={plan.dueDate}>
                {new Date(plan.dueDate).toLocaleDateString()}
              </time>
            </div>
            <div className={styles.priority}>
              <span className={styles.label}>Priority:</span>
              <span className={styles.priorityValue}>{plan.priority}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.toggleBtn}`}
            disabled={loading.toggling === plan.id}
            onClick={() => togglePlanStatus(plan.id)}
            aria-label={`Mark as ${plan.status === "completed" ? "pending" : "completed"}`}
            title={`Mark as ${plan.status === "completed" ? "pending" : "completed"}`}
          >
            {loading.toggling === plan.id ? (
              <div className={styles.spinner} />
            ) : (
              <FiCheck />
            )}
            <span className={styles.buttonText}>
              {plan.status === "completed" ? "Mark Pending" : "Complete"}
            </span>
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.editBtn}`}
            disabled={loading.editing === plan.id}
            onClick={() => openEditDialog(plan)}
            aria-label="Edit plan"
            title="Edit plan"
          >
            {loading.editing === plan.id ? (
              <div className={styles.spinner} />
            ) : (
              <FiEdit />
            )}
            <span className={styles.buttonText}>Edit</span>
          </button>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            disabled={loading.deleting === plan.id}
            onClick={handleDeletePlan}
            aria-label="Delete plan"
            title="Delete plan"
          >
            {loading.deleting === plan.id ? (
              <div className={styles.spinner} />
            ) : (
              <FiTrash2 />
            )}
            <span className={styles.buttonText}>Delete</span>
          </button>
        </div>
      </div>

      {isEditDialogOpen && planToEdit && (
        <EditPlan
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          onEdit={handleEditPlan}
          plan={planToEdit}
          isLoading={loading.editing === planToEdit.id}
        />
      )}
    </>
  );
};

export default PlanItem;
