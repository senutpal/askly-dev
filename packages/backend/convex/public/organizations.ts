import { v } from "convex/values";
import { action } from "../_generated/server";
import { createClerkClient } from "@clerk/backend";

const secretKey = process.env.CLERK_SECRET_KEY;
if (!secretKey) {
  throw new Error("CLERK_SECRET_KEY environment variable is required");
}

const clerkClient = createClerkClient({
  secretKey,
});

export const validate = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (_, args) => {
    try {
      await clerkClient.organizations.getOrganization({
        organizationId: args.organizationId,
      });

      return { valid: true };
    } catch (error) {
      console.error("Organization validation error:", error);
      if (error instanceof Error) {
        return {
          valid: false,
          reason: error.message.includes("not found")
            ? "Organization not found"
            : "Failed to validate organization",
        };
      }
      return { valid: false, reason: "Failed to validate organization" };
    }
  },
});
