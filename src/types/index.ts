export interface Plan {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  dueDate: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export type FilterType = "all" | "completed" | "pending" | "overdue";

export interface LoadingStates {
  adding: boolean;
  deleting: string | null;
  editing: string | null;
  toggling: string | null;
}

export interface PlansStore {
  plans: Plan[];
  filteredPlans: Plan[];
  searchTerm: string;
  filter: FilterType;
  loading: LoadingStates;
  addPlan: (plan: Plan) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  editPlan: (id: string, updatedPlan: Partial<Plan>) => Promise<void>;
  togglePlanStatus: (id: string) => Promise<void>;
  setSearchTerm: (searchTerm: string) => void;
  setFilter: (filter: FilterType) => void;
  handleDragStart: (event: React.DragEvent<HTMLDivElement>, plan: Plan) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>, targetPlan: Plan) => void;
  movePlan: (draggedPlan: Plan, targetPlan: Plan) => void;
}

export type PlanStatus = Plan['status'];
export type PlanPriority = Plan['priority'];

export const BUTTON_VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;

export type ButtonVariant = typeof BUTTON_VARIANT[keyof typeof BUTTON_VARIANT];
