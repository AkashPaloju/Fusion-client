import { NavLink } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";
import styles from "./UserBreadcumbs.module.css";

function UserBreadcumbs() {
  return (
    <div className={styles.ctr}>
      <NavLink
        to="/scholarship"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.inactiveLink
        }
      >
        Catalog
      </NavLink>
      <div className={styles.caret} style={{ color: "inherit" }}>
        <CaretRight className={styles.caret} style={{ color: "inherit" }} />
      </div>
      <NavLink
        to="/ConvocationMedal"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.inactiveLink
        }
      >
        Browse Application
      </NavLink>
      <div className={styles.caret} style={{ color: "inherit" }}>
        <CaretRight className={styles.caret} style={{ color: "inherit" }} />
      </div>
      <NavLink
        to="/user/scholarshipStatus"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.inactiveLink
        }
      >
        Scholarship Status
      </NavLink>
      <div className={styles.caret} style={{ color: "inherit" }}>
        <CaretRight className={styles.caret} style={{ color: "inherit" }} />
      </div>
    </div>
  );
}

export default UserBreadcumbs;
