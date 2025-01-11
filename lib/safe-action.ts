import { createSafeActionClient } from "next-safe-action";

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (!error) {
      console.error("Received a null or undefined error");
      return "An unknown error occurred";
    }

    console.error("Server error:", error);

    if (error instanceof ActionError) {
      return error.message;
    }

    return "An unexpected error occurred";
  },
});
