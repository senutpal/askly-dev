import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

export const upsert = internalMutation({
  args: {
    service: v.union(v.literal("vapi")),
    organizationId: v.string(),
    secretContent: v.string(),
    iv: v.string(),
    authTag: v.string(),
  },
  async handler(ctx, args) {
    const existingPlugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", args.organizationId).eq("service", args.service)
      )
      .first();

    if (existingPlugin) {
      await ctx.db.patch(existingPlugin._id, {
        secretContent: args.secretContent,
        iv: args.iv,
        authTag: args.authTag,
      });
    } else {
      await ctx.db.insert("plugins", {
        organizationId: args.organizationId,
        service: args.service,
        secretContent: args.secretContent,
        iv: args.iv,
        authTag: args.authTag,
      });
    }
  },
});

export const getByOrganizationIdAndService = internalQuery({
  args: {
    service: v.union(v.literal("vapi")),
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", args.organizationId).eq("service", args.service)
      )
      .first();
  },
});
