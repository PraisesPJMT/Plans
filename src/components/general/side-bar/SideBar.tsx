import { useState, useEffect } from "react";
import styles from "./SideBar.module.css";
import usePlans from "../../../hooks/usePlans";
import type { FilterType } from "../../../types";

const SideBar = () => {
  const { setFilter, filter } = usePlans();

  const [filterValue, setFilterValue] = useState<FilterType>(filter);

  const filters = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "overdue", label: "Overdue" },
  ];

  useEffect(() => {
    setFilter(filterValue);
  }, [filterValue]);

  return (
    <aside className={styles.aside}>
      <ul>
        {filters.map((filter) => (
          <li key={filter.id}>
            <input
              type="radio"
              id={`status-filter-${filter.id}`}
              name="status-filter"
              value={filter.id}
              checked={filterValue === filter.id}
              onChange={(e) => setFilterValue(e.target.value as FilterType)}
              tabIndex={-1}
            />
            <label
              tabIndex={0}
              htmlFor={`status-filter-${filter.id}`}
              className={filterValue === filter.id ? styles.active : ""}
              onClick={() => setFilterValue(filter.id as FilterType)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setFilterValue(filter.id as FilterType);
                }
              }}
            >
              {filter.label}
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
