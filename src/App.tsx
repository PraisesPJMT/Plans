  import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
  
  import styles from "./App.module.css";

import usePlans from "./hooks/usePlans";
import PlanItem from "./components/plan-item/PlanItem";
import Header from "./components/general/header/Header";
import Filters from "./components/general/filters/Filters";
import SideBar from "./components/general/side-bar/SideBar";

import type { Plan } from "./types";

const App: React.FC = () => {
  const { filteredPlans } = usePlans();
  const [items, setItems] = useState<Plan[]>([]);

  useEffect(() => {
    setItems(filteredPlans);
  }, [filteredPlans]);

  return (
    <>
      <div className={styles.app}>
        <SideBar />
        <div>
          <Header />
          <main>
            <Filters />
            <div className={styles.plans}>
              {items.map((plan, index) => (
                <PlanItem key={index} plan={plan} />
              ))}
            </div>
          </main>
        </div>
      </div>
      
      <ToastContainer />
    </>
  );
};

export default App;
