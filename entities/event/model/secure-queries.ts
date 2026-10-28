import "server-only";

import { connection } from "next/server";

import { getManagedEvents } from "./queries";

import { requireDashboardSession } from "@/entities/session";


export const getDashboardEvents = async () => {
  await connection();
  await requireDashboardSession();
  return getManagedEvents();
};
