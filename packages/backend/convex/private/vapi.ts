import { ConvexError } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { Vapi, VapiClient } from "@vapi-ai/server-sdk";

export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx): Promise<Vapi.PhoneNumbersListResponseItem[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity Not Found",
      });
    }

    const orgId = (identity as { orgId?: string }).orgId;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization Not Found",
      });
    }

    const plugin = (await ctx.runAction(
      internal.system.secrets.getByOrganizationIdAndService,
      { organizationId: orgId, service: "vapi" }
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

    const vapiClient = new VapiClient({ token: privateApiKey });
    const phoneNumbers = await vapiClient.phoneNumbers.list();

    return phoneNumbers;
  },
});

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity Not Found",
      });
    }

    const orgId = (identity as { orgId?: string }).orgId;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization Not Found",
      });
    }

    const plugin = (await ctx.runAction(
      internal.system.secrets.getByOrganizationIdAndService,
      { organizationId: orgId, service: "vapi" }
    )) as { privateApiKey: string; publicApiKey: string } | null;

    if (!plugin) {
      throw new ConvexError({ code: "NOT FOUND", message: "Plugin Not Found" });
    }

    const { privateApiKey, publicApiKey } = plugin;
    if (!privateApiKey || !publicApiKey) {
      throw new ConvexError({
        code: "NOT FOUND",
        message: "Credentials incomplete. Please reconnect your Vapi account",
      });
    }

    const vapiClient = new VapiClient({ token: privateApiKey });
    const assistants = await vapiClient.assistants.list();

    return assistants;
  },
});
