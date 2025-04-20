import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import axios from "axios";
import { Select, Button, Table, Text, Loader } from "@mantine/core";
import styles from "./previousWinnersC.module.css";
import { getPreviousWinnersRoute } from "../../../../routes/SPACSRoutes";

function PreviousWinners() {
  const [programme, setProgramme] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [award, setAward] = useState("");
  const [winners, setWinners] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const awardMapping = {
    "Director's Gold": 2,
    "Director's Silver": 3,
    "Merit-cum-means Scholarship": 1,
    "Notional Prizes": 4,
    "D&M Proficiency Gold Medal": 5,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const awardId = awardMapping[award];
    setShowTable(true);
    setIsLoading(true);

    const formData = {
      programme,
      batch: parseInt(academicYear, 10),
      award_id: awardId,
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(getPreviousWinnersRoute, formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.result === "Success") {
        console.log(response.data);
        const { student_name, student_program, roll } = response.data;
        const winnersArray = student_name.map((name, index) => ({
          name,
          program: student_program[index],
          roll: roll[index],
        }));

        setWinners(winnersArray);
      } else {
        console.error("No winners found:", response.data.error);
      }
    } catch (error) {
      setWinners([]);
      console.error(
        "Error fetching winners:",
        error.response ? error.response.data : error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };
  const sortedWinners = [...winners].sort((a, b) => {
    if (!sortBy) return 0;
    const valA = a[sortBy].toLowerCase?.() || a[sortBy];
    const valB = b[sortBy].toLowerCase?.() || b[sortBy];
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <Select
              label="Programme"
              placeholder="Select Programme"
              value={programme}
              onChange={setProgramme}
              data={[
                { value: "B.Tech", label: "B.Tech" },
                { value: "M.Tech", label: "M.Tech" },
                { value: "B.Des", label: "B.Des" },
                { value: "M.Des", label: "M.Des" },
                { value: "PhD", label: "PhD" },
              ]}
              rightSection={<CaretDown />}
            />
          </div>

          <div className={styles.formItem}>
            <Select
              label="Academic Year"
              placeholder="Select Year"
              value={academicYear}
              onChange={setAcademicYear}
              data={[...Array(11).keys()].map((i) => ({
                value: `${2014 + i}`,
                label: `${2014 + i}`,
              }))}
              rightSection={<CaretDown />}
            />
          </div>

          <div className={styles.formItem}>
            <Select
              label="Scholarship/Awards"
              placeholder="Select Award"
              value={award}
              onChange={setAward}
              data={Object.keys(awardMapping).map((awardName) => ({
                value: awardName,
                label: awardName,
              }))}
              rightSection={<CaretDown />}
            />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <Button type="submit">Submit</Button>
        </div>
      </form>

      {showTable && (
        <div className={styles.winnersList}>
          {isLoading ? (
            <Loader size="lg" />
          ) : sortedWinners.length > 0 ? (
            <>
              <div className={styles.sortControls}>
                <div className={styles.sortItem}>
                  <Select
                    label="Sort By"
                    placeholder="Select column"
                    value={sortBy}
                    onChange={setSortBy}
                    data={[
                      { value: "name", label: "Name" },
                      { value: "roll", label: "Roll No" },
                      { value: "program", label: "Program" },
                    ]}
                    rightSection={<CaretDown />}
                  />
                </div>
                <div className={styles.sortItem}>
                  <Select
                    label="Order"
                    placeholder="Select order"
                    value={sortOrder}
                    onChange={setSortOrder}
                    data={[
                      { value: "asc", label: "Ascending" },
                      { value: "desc", label: "Descending" },
                    ]}
                    rightSection={<CaretDown />}
                  />
                </div>
                {sortBy && (
                  <Text size="sm" mt="xs">
                    Sorted by {sortBy} ({sortOrder})
                  </Text>
                )}
              </div>
              <div className={styles.tableContainer}>
                <Table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll No</th>
                      <th>Program</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedWinners.map((winner, index) => (
                      <tr key={index}>
                        <td>{winner.name}</td>
                        <td>{winner.roll}</td>
                        <td>{winner.program}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div></>
          ) : (
            <Text>No winners found</Text>
          )}
        </div>
      )}
    </div>
  );
}

export default PreviousWinners;
