// FIXME => never & any
import { createResource, createSignal } from "solid-js";
import type { Resource } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import type { AgentType } from "./createAgent";
import { StoreType } from ".";

// TODO: remove never
export default function createBacklogs(
  agent: AgentType,
  actions: any,
  state: StoreType,
  setState: SetStoreFunction<StoreType>
): Resource<never[]> {
  const [backlogs] = createResource(async () => await agent.Backlogs.getAll());

  Object.assign(actions, {
    loadBacklogs(data: any) {
      console.log("data is", data, backlogs);
      //setState({ backlogs : });
      console.log("in load backlogs", data);
      //setArticleSource(["articles", predicate]);
    },
  });

  console.log("backlogs to return is", backlogs.loading);
  return backlogs;
}

//async createBacklog(backlog: string) {
//const { errors } = await agent.Backlogs.create(
//state.articleSlug,
//backlog
//);
//if (errors) throw errors;
//},
//async deleteBacklog(id: string) {
//mutate(backlogs().filter((c) => c?.id !== id));
//try {
//await agent.Backlogs.delete(state.articleSlug, id);
//} catch (err) {
//actions.loadBacklogs(state.articleSlug);
//throw err;
//}
//},
