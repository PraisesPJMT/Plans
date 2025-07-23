import { useState, useEffect } from "react";

import Input from "../../form/Input";
import Button from "../../ui/button/Button";
import usePlans from "../../../hooks/usePlans";
import AddPlan from "../../dialogs/add-plan/AddPlan";

import styles from "./Filters.module.css";
import type { Plan, FilterType } from "../../../types";

const Filters = () => {
  const { setSearchTerm, setFilter, filter, filteredPlans, addPlan, loading } =
    usePlans();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<FilterType>(filter);

  const handleAddPlan = async (plan: Plan) => {
    await addPlan(plan);
    setIsAddDialogOpen(false);
  };

  useEffect(() => {
    setSearchTerm(search);
  }, [search, setSearchTerm]);

  useEffect(() => {
    setFilter(filterValue);
  }, [filterValue]);

  const filterOptions: { value: FilterType; label: string; count?: number }[] =
    [
      { value: "all", label: "All Plans" },
      { value: "pending", label: "Pending" },
      { value: "completed", label: "Completed" },
      { value: "overdue", label: "Overdue" },
    ];

  return (
    <>
      <div className={styles.filter}>
        <div className={styles.filterRow}>
          <div className={styles.searchContainer}>
            <Input
              type="search"
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <Button
              type="button"
              onClick={() => setIsAddDialogOpen(true)}
              disabled={loading.adding}
            >
              {loading.adding ? "Adding..." : "Add Plan"}
            </Button>
          </div>
        </div>

        <div className={styles.statusFilters}>
          <ul>
            {filterOptions.map((filter) => (
              <li key={filter.value}>
                <input
                  type="radio"
                  id={`status-filter-${filter.value}`}
                  name="status-filter"
                  value={filter.value}
                  checked={filterValue === filter.value}
                  onChange={(e) => setFilterValue(e.target.value as FilterType)}
                  tabIndex={-1}
                />
                <label
                  tabIndex={0}
                  htmlFor={`status-filter-${filter.value}`}
                  className={filterValue === filter.value ? styles.active : ""}
                  onClick={() => setFilterValue(filter.value as FilterType)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFilterValue(filter.value as FilterType);
                    }
                  }}
                >
                  {filter.label}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.resultsSummary}>
          <span>
            Showing {filteredPlans.length} plan
            {filteredPlans.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
            {filter !== "all" && ` with status "${filter}"`}
          </span>
        </div>
      </div>

      <AddPlan
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddPlan}
        isLoading={loading.adding}
      />
    </>
  );
};

export default Filters;
