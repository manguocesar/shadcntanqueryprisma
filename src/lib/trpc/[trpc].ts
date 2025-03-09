// pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../trpc";

export default createNextApiHandler({
  router: appRouter,
});
