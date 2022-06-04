import { PomodoroType } from "../types/pomodoro";
import { ChangeOrderDto, ChangeTaskStatusDto } from "../types/shared";
import { createFetchHttpRequest, createHttpRequest } from "./createHttpRequest";

export async function removePomodoro(
  id: string,
  token: string | null
): Promise<PomodoroType[]> {
  try {
    const result = await createFetchHttpRequest(
      "DELETE",
      `/pomodoros/${id}`,
      "data",
      token
    );

    return result;
  } catch (error) {
    throw error;
  }
}

export async function changeOrder(
  data: ChangeOrderDto,
  token: string | null
): Promise<PomodoroType[]> {
  try {
    const result = await createHttpRequest(
      "POST",
      `/pomodoros/order`,
      data,
      "data",
      token
    );

    return result;
  } catch (error) {
    throw error;
  }
}

export async function changeTaskStatus(
  id: string,
  data: ChangeTaskStatusDto,
  token: string | null
): Promise<PomodoroType[]> {
  try {
    const result = await createHttpRequest(
      "POST",
      `/pomodoros/${id}`,
      data,
      "data",
      token
    );

    return result;
  } catch (error) {
    throw error;
  }
}
