import { ConvexError, v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";

export const getVapiSecrets = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const plugin = (await ctx.runAction(
      internal.system.secrets.getByOrganizationIdAndService,
      { organizationId: args.organizationId, service: "vapi" }
    )) as { privateApiKey: string; publicApiKey: string } | null;

    if (!plugin) {
      throw new ConvexError({ code: "NOT FOUND", message: "Plugin Not Found" });
    }

    const { privateApiKey, publicApiKey } = plugin;

    if (!privateApiKey || !publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account",
      });
    }

    return {
      publicApiKey: publicApiKey,
    };
  },
});
