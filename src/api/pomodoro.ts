import { EditPomodoroDto, PomodoroType } from "../types/pomodoro";
import { createHttpRequest } from "./createHttpRequest";

export async function editPomodoro(
  data: EditPomodoroDto,
  token: string | null
): Promise<PomodoroType> {
  try {
    const result = await createHttpRequest(
      "PUT",
      `/pomodoros/edit`,
      data,
      "data",
      token
    );

    return result;
  } catch (error) {
    throw error;
  }
}
