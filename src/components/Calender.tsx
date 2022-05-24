import { Component, For } from "solid-js";
import styles from "./Calender.module.css";

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

// July
//daysInMonth(7,2009); // 31
// February
//daysInMonth(2,2009); // 28
//daysInMonth(2,2008); /

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const year = 2022;

const Calender: Component = (props) => {
  const currentDate = new Date();

  console.log(
    "amir is here",
    Array.from(
      { length: +daysInMonth(+months[currentDate.getMonth()], year) },
      (i: number) => i
    )
  );

  return (
    <div style={styles.Calender}>
      <div style={styles.CalenderActions}>
        <div style={styles.CalenderAction}>
          <label style={styles.CalenderActionLabel}> select year</label>
          <For each={[]}>
            {(month: string) => {
              return <option value={month}>{month}</option>;
            }}
          </For>
        </div>
        <div style={styles.CalenderAction}>
          <label style={styles.CalenderActionLabel}> select month</label>
          <select value={months[currentDate.getMonth()]} disabled>
            <For each={months}>
              {(month: string) => {
                return <option value={month}>{month}</option>;
              }}
            </For>
          </select>
        </div>
      </div>
      <div style={styles.CalenderDays}></div>
    </div>
  );
};

export default Calender;
