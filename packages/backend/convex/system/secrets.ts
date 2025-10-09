"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { decrypt, encrypt } from "../userApiKeys/helpers";
import { internal } from "../_generated/api";

export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    text: v.any(),
  },
  handler: async (ctx, args) => {
    const textToEncrypt =
      typeof args.text === "string" ? args.text : JSON.stringify(args.text);

    const { content, iv, authTag } = encrypt(textToEncrypt);
    await ctx.runMutation(internal.system.plugins.upsert, {
      service: args.service,
      secretContent: content,
      iv,
      authTag,
      organizationId: args.organizationId,
    });
    return { status: "success" };
  },
});

export const getByOrganisationIdAndService = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
    const encrypted = await ctx.runQuery(
      internal.system.plugins.getByOrganisationIdAndService,
      {
        service: args.service,
        organizationId: args.organizationId,
      }
    );
    if (!encrypted) {
      throw new Error("Plugin not found");
    }
    const { secretContent, iv, authTag } = encrypted;

    const decrypted = decrypt(iv, secretContent, authTag);

    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  },
});
