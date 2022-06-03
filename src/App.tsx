import { Accessor, Component, ParentProps } from "solid-js";
import styles from "./App.module.css";
import Backlogs from "./components/Backlogs";
//import Calender from "./components/Calender";
import Pomodoros from "./components/Pomodoros";

const App: Component = () => {
  //move to pomodoros ( backlogs resource )
  //const handleMove = async (
  //id: string,
  //currentStatus: "Backlog" | "Pomodoro"
  //) => {
  //if (id.length === 0) return;

  //let removedItemIndex, removedItem: PomodoroType | undefined;

  //// FIXME: redo this types
  //if (currentStatus === "Pomodoro" && pomodoros()?.length > 0) {
  //removedItemIndex = pomodoros()?.findIndex((item) => item._id == id);
  //removedItem = pomodoros()[removedItemIndex];
  //mutate((prev) => {
  //return prev
  //?.filter((item) => item._id !== id)
  //.map((item, order) => ({ ...item, order: order + 1 }));
  //});

  //backlogsMutate((prev) => {
  //return [
  //...prev,
  //{ ...removedItem, status: "Backlog", order: prev.length },
  //];
  //});
  //} else if (backlogs()?.length > 0) {
  //removedItemIndex = backlogs()?.findIndex((item) => item._id == id);
  //removedItem = (backlogs() as PomodoroType[])[removedItemIndex];

  //backlogsMutate((prev) => {
  //return prev
  //?.filter((item) => item._id !== id)
  //.map((item, order) => ({ ...item, order: order + 1 }));
  //});

  //mutate((prev) => {
  //return [...prev, { ...removedItem, status: "Pomodoro" }];
  //});
  //}

  //const res = await fetch(`${API_ROOT}/pomodoros/${id}`, {
  //method: "PUT",
  //headers: {
  //"Content-Type": "application/json",
  //},
  //body: JSON.stringify({
  //status: currentStatus,
  //order:
  //currentStatus == "Backlog" ? pomodoros().length : backlogs().length,
  //currentOrders: currentStatus == "Backlog" ? backlogs() : pomodoros(),
  //}),
  //});

  //// TODO : if there was an error add the item in removedItemIndex
  //// handle error
  //if (res.status != 200 && currentStatus === "Pomodoro") {
  //mutate((prev) => {
  //return [...prev, removedItem];
  //});
  //backlogsMutate((prev) => {
  //return prev?.filter((item) => item._id !== id);
  //});
  //throw Error("Error in removing a backlog task");
  //} else if (res.status != 200 && currentStatus === "Backlog") {
  //backlogsMutate((prev) => {
  //return [...prev, removedItem];
  //});
  //mutate((prev) => {
  //return prev?.filter((item) => item._id !== id);
  //});
  //throw Error("Error in removing a backlog task");
  //}
  //};

  return (
    <div
    //class={
    //pomodoro() == "Focus"
    //? styles.App
    //: [styles.App, styles.BlueApp].join(" ")
    //}
    >
      <div class={styles.Tasks}>
        <Backlogs moveBacklog={() => console.log("fkasdjf")} />
        <Pomodoros moveBacklog={() => console.log("vdjfksa")} />
      </div>
      {/*<div class={styles.Calender}>
        <Calender />
      </div>*/}
    </div>
  );
};

export default App;
