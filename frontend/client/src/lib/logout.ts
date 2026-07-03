import { buildApiUrl } from "@/lib/api";
import { clearAllDashboardCaches } from "@/lib/dashboardCache";
import { clearClientAuthState, logoutSession } from "@/lib/authSession";
import { toast } from "sonner";

type NavigateFn = (path: string) => void;

/**
 * Invalidates the server session (httpOnly cookie) and clears client state.
 */
export async function performClientLogout(navigate: NavigateFn, message = "Successfully logged out") {
  await logoutSession();
  clearAllDashboardCaches();
  toast.success(message);
  navigate("/");
}
