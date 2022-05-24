import { createResource } from "solid-js";

export default function createBacklogs(agent, actions, state, setState) {
  const [backlogs, { mutate, refetch }] = createResource(
    () => state.articleSlug,
    agent.Backlogs.forArticle,
    { initialValue: [] }
  );
  Object.assign(actions, {
    loadBacklogs(articleSlug, reload) {
      if (reload) return refetch();
      setState({ articleSlug });
    },
    async createBacklog(backlog) {
      const { errors } = await agent.Backlogs.create(
        state.articleSlug,
        backlog
      );
      if (errors) throw errors;
    },
    async deleteBacklog(id) {
      mutate(backlogs().filter((c) => c.id !== id));
      try {
        await agent.Backlogs.delete(state.articleSlug, id);
      } catch (err) {
        actions.loadBacklogs(state.articleSlug);
        throw err;
      }
    },
  });
  return backlogs;
}

export function createTask(title: string) {
  return {
    title,
  };
}
