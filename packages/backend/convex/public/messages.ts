import { ConvexError, v } from "convex/values";
import { action, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
// import { escalateConversation } from "../system/ai/tools/escalateConversation";
// import { resolveConversation } from "../system/ai/tools/resolveConversation";

import { saveMessage } from "@convex-dev/agent";
// import { search } from "../system/ai/tools/search";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      { contactSessionId: args.contactSessionId }
    );

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Session",
      });
    }
    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: args.threadId }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.contactSessionId !== contactSession._id) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Conversation does not belong to this session",
      });
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD REQUEST",
        message: "Conversation resolved",
      });
    }

    const shouldTriggerAgent = conversation.status === "unresolved";
    if (shouldTriggerAgent) {
      await supportAgent.generateText(
        ctx,
        {
          threadId: args.threadId,
        },
        {
          prompt: args.prompt,
          //   tools: {
          //     escalateConversationTool: escalateConversation,
          //     resolveConversationTool: resolveConversation,
          //     searchTool: search,
          //   },
        }
      );
    } else {
      // RECHECK THIS  prompt: args.prompt, instead of message ;
      await saveMessage(ctx, components.agent, {
        threadId: args.threadId,
        message: { role: "user", content: args.prompt },
      });
    }
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Session",
      });
    }

    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();

    if (
      !conversation ||
      conversation.contactSessionId !== args.contactSessionId
    ) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Conversation not found for this session",
      });
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });
    return paginated;
  },
});
