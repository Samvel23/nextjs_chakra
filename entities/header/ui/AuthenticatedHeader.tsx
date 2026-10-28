import { connection } from "next/server"; // 👈 Import connection
import { Header } from "./Header";
import { hasDashboardSession } from "@/entities/session";

export const AuthenticatedHeader = async () => {
  await connection();
  const isAuthenticated = await hasDashboardSession();
  return <Header isAuthenticated={isAuthenticated} />;
};
