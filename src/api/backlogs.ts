import { CreatePomodoroItemDto, PomodoroType } from "../types/pomodoro";
import { createFetchHttpRequest, createHttpRequest } from "./createHttpRequest";

export async function fetchBacklogs(
  token: string | null
): Promise<PomodoroType[]> {
  const result = await createFetchHttpRequest(
    "GET",
    "/pomodoros/backlogs",
    "data",
    token
  );

  return result;
}

export async function addBacklog(
  data: CreatePomodoroItemDto,
  token: string | null
): Promise<PomodoroType[]> {
  const result = await createHttpRequest<CreatePomodoroItemDto>(
    "POST",
    "/pomodoros/backlogs",
    data,
    "data",
    token
  );

  //const res = await fetch(`${API_ROOT}/pomodoros`, {
  //body: JSON.stringify({ title: task, order: store.backlogs().length }),
  //});

  return result;
}
