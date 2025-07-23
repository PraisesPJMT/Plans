import { toast } from "react-toastify";
import { plansStorage } from "../utils/storage";
import { useState, useEffect, useCallback, useMemo } from "react";

import type { Plan, PlansStore, FilterType, LoadingStates } from "../types";

const DEFAULT_PLANS: Plan[] = [
  // {
  //   id: "plan-1",
  //   title: "Finish project report",
  //   description: "Complete the project report and submit it to the manager",
  //   status: "pending",
  //   dueDate: "2024-09-16",
  //   createdAt: "2024-09-10T10:00:00Z",
  //   priority: "high",
  // },
  // {
  //   id: "plan-2",
  //   title: "Meet with team",
  //   description: "Discuss project progress and plan for the next week",
  //   status: "pending",
  //   dueDate: "2024-09-17",
  //   createdAt: "2024-09-10T11:00:00Z",
  //   priority: "medium",
  // },
  // {
  //   id: "plan-3",
  //   title: "Fix bugs in code",
  //   description:
  //     "Identify and fix bugs in the code to ensure smooth functionality",
  //   status: "pending",
  //   dueDate: "2024-09-18",
  //   createdAt: "2024-09-10T12:00:00Z",
  //   priority: "high",
  // },
  // {
  //   id: "plan-4",
  //   title: "Research new technology",
  //   description:
  //     "Research and learn about new technology to improve project efficiency",
  //   status: "pending",
  //   dueDate: "2024-09-20",
  //   createdAt: "2024-09-10T13:00:00Z",
  //   priority: "low",
  // },
  // {
  //   id: "plan-5",
  //   title: "Create presentation",
  //   description:
  //     "Create a presentation to showcase project progress to stakeholders",
  //   status: "pending",
  //   dueDate: "2024-09-22",
  //   createdAt: "2024-09-10T14:00:00Z",
  //   priority: "medium",
  // },
];

const globalState = {
  plans: [] as Plan[],
  searchTerm: "",
  filter: "all" as FilterType,
  loading: {
    adding: false,
    deleting: null,
    editing: null,
    toggling: null,
  } as LoadingStates,
  draggedPlan: null as Plan | null,
  subscribers: new Set<() => void>(),
};

const initializeGlobalState = () => {
  if (globalState.plans.length === 0) {
    const storedPlans = plansStorage.get();
    if (storedPlans.length > 0) {
      globalState.plans = storedPlans;
    } else {
      globalState.plans = DEFAULT_PLANS;
      plansStorage.set(DEFAULT_PLANS);
    }
  }
};

const notifySubscribers = () => {
  globalState.subscribers.forEach((callback) => callback());
};

const updateGlobalState = (updates: Partial<typeof globalState>) => {
  Object.assign(globalState, updates);
  notifySubscribers();
};

const usePlans = (): PlansStore => {
  const [, forceUpdate] = useState({});

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    initializeGlobalState();
    globalState.subscribers.add(triggerUpdate);

    return () => {
      globalState.subscribers.delete(triggerUpdate);
    };
  }, [triggerUpdate]);

  useEffect(() => {
    if (globalState.plans.length > 0) {
      plansStorage.set(globalState.plans);
    }
  }, [globalState.plans]);

  const filteredPlans = useMemo(() => {
    return globalState.plans.filter((plan) => {
      const matchesSearchTerm =
        globalState.searchTerm.trim() === "" ||
        plan.title
          .toLowerCase()
          .includes(globalState.searchTerm.toLowerCase()) ||
        plan.description
          .toLowerCase()
          .includes(globalState.searchTerm.toLowerCase());

      const matchesFilter = (() => {
        switch (globalState.filter) {
          case "all":
            return true;
          case "overdue":
            return (
              new Date(plan.dueDate) < new Date() && plan.status !== "completed"
            );
          default:
            return plan.status === globalState.filter;
        }
      })();

      return matchesSearchTerm && matchesFilter;
    });
  }, [globalState.plans, globalState.searchTerm, globalState.filter]);

  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const addPlan = useCallback(async (plan: Plan) => {
    updateGlobalState({
      loading: { ...globalState.loading, adding: true },
    });

    try {
      await delay(2000);
      updateGlobalState({
        plans: [...globalState.plans, plan],
        loading: { ...globalState.loading, adding: false },
      });
      toast.success("Plan added successfully!");
      // eslint-disable-next-line
    } catch (error) {
      toast.error("Failed to add plan");
      updateGlobalState({
        loading: { ...globalState.loading, adding: false },
      });
    }
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    updateGlobalState({
      loading: { ...globalState.loading, deleting: id },
    });

    try {
      await delay(2000);
      updateGlobalState({
        plans: globalState.plans.filter((plan) => plan.id !== id),
        loading: { ...globalState.loading, deleting: null },
      });
      toast.success("Plan deleted successfully!");
      // eslint-disable-next-line
    } catch (error) {
      toast.error("Failed to delete plan");
      updateGlobalState({
        loading: { ...globalState.loading, deleting: null },
      });
    }
  }, []);

  const editPlan = useCallback(
    async (id: string, updatedPlan: Partial<Plan>) => {
      updateGlobalState({
        loading: { ...globalState.loading, editing: id },
      });

      try {
        await delay(2000);
        const updatedPlans = globalState.plans.map((plan) =>
          plan.id === id ? { ...plan, ...updatedPlan } : plan,
        );

        updateGlobalState({
          plans: updatedPlans,
          loading: { ...globalState.loading, editing: null },
        });
        toast.success("Plan edited successfully!");
        // eslint-disable-next-line
      } catch (error) {
        toast.error("Failed to edit plan");
        updateGlobalState({
          loading: { ...globalState.loading, editing: null },
        });
      }
    },
    [],
  );

  const togglePlanStatus = useCallback(async (id: string) => {
    updateGlobalState({
      loading: { ...globalState.loading, toggling: id },
    });

    try {
      await delay(2000);
      const updatedPlans = globalState.plans.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              status: plan.status === "pending" ? "completed" : "pending",
            }
          : plan,
      );

      updateGlobalState({
        plans: [...updatedPlans] as Plan[],
        loading: { ...globalState.loading, toggling: null },
      });
      toast.success("Plan status toggled successfully!");
      // eslint-disable-next-line
    } catch (error) {
      toast.error("Failed to toggle plan status");
      updateGlobalState({
        loading: { ...globalState.loading, toggling: null },
      });
    }
  }, []);

  const setSearchTerm = useCallback((searchTerm: string) => {
    updateGlobalState({ searchTerm });
  }, []);

  const setFilter = useCallback((filter: FilterType) => {
    updateGlobalState({ filter });
  }, []);

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, plan: Plan) => {
      updateGlobalState({ draggedPlan: plan });
      event.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>, targetPlan: Plan) => {
      event.preventDefault();
      if (
        globalState.draggedPlan &&
        targetPlan &&
        globalState.draggedPlan.id !== targetPlan.id
      ) {
        movePlan(globalState.draggedPlan, targetPlan);
      }
      updateGlobalState({ draggedPlan: null });
    },
    [],
  );

  const movePlan = useCallback((draggedPlan: Plan, targetPlan: Plan) => {
    const draggedIndex = globalState.plans.findIndex(
      (plan) => plan.id === draggedPlan.id,
    );
    const targetIndex = globalState.plans.findIndex(
      (plan) => plan.id === targetPlan.id,
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const newPlans = [...globalState.plans];
    const [removed] = newPlans.splice(draggedIndex, 1);
    newPlans.splice(targetIndex, 0, removed);

    updateGlobalState({ plans: newPlans });
  }, []);

  return {
    plans: globalState.plans,
    filteredPlans,
    searchTerm: globalState.searchTerm,
    filter: globalState.filter,
    loading: globalState.loading,
    addPlan,
    deletePlan,
    editPlan,
    togglePlanStatus,
    setSearchTerm,
    setFilter,
    handleDragStart,
    handleDragOver,
    handleDrop,
    movePlan,
  };
};

export default usePlans;
