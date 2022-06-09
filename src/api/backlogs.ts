import { BacklogType, CreateDto, PomodoroType } from "../types/pomodoro";
import { createFetchHttpRequest, createHttpRequest } from "./createHttpRequest";

export async function fetchBacklogs(
  token: string | null
): Promise<BacklogType[]> {
  const result = await createFetchHttpRequest(
    "GET",
    "/pomodoros/backlogs",
    "data",
    token
  );

  return result;
}

export async function addBacklog(
  data: CreateDto,
  token: string | null
): Promise<BacklogType[]> {
  try {
    const result = await createHttpRequest<CreateDto>(
      "POST",
      "/pomodoros",
      data,
      "data",
      token
    );

    return result;
  } catch (error) {
    throw error;
  }
}
