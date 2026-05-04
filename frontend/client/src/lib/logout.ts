import { toast } from "sonner";

type NavigateFn = (path: string) => void;

/**
 * Clears client auth and navigates home. Uses the global Sonner toaster (bottom-right, green success style).
 */
export function performClientLogout(navigate: NavigateFn, message = "Successfully logged out") {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  toast.success(message);
  navigate("/");
}
