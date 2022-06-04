import { PomodoroType } from "../types/pomodoro";
import { createFetchHttpRequest } from "./createHttpRequest";

export async function fetchPomodoros(
  token: string | null
): Promise<PomodoroType[]> {
  const result = await createFetchHttpRequest(
    "GET",
    "/pomodoros",
    "data",
    token
  );

  return result;
}

export async function makeTaskDone(
  id: string,
  token: string | null
): Promise<PomodoroType[]> {
  try {
    const result = await createFetchHttpRequest(
      "PUT",
      `/pomodoros/${id}`,
      "data",
      token
    );

    return result;
  } catch (error) {
    throw error;
  }
}
