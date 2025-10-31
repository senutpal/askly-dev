import { defineTable, defineSchema } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  widgetSettings: defineTable({
    organizationId: v.string(),
    greetMessage: v.string(),
    defaultSuggestions: v.object({
      suggestion1: v.optional(v.string()),
      suggestion2: v.optional(v.string()),
      suggestion3: v.optional(v.string()),
    }),
    vapiSettings: v.object({
      assistantId: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
    }),
  }).index("by_organization_id", ["organizationId"]),
  conversations: defineTable({
    threadId: v.string(),
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
    status: v.union(
      v.literal("unresolved"),
      v.literal("escalated"),
      v.literal("resolved")
    ),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_contact_session_id", ["contactSessionId"])
    .index("by_thread_id", ["threadId"])
    .index("by_status_and_organization_id", ["status", "organizationId"]),

  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    expiresAt: v.number(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.string()),
        platform: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(v.string()),
        viewportSize: v.optional(v.string()),
        timezone: v.optional(v.string()),
        timezoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string()),
      })
    ),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_expires_at", ["expiresAt"]),

  users: defineTable({
    name: v.string(),
  }),

  plugins: defineTable({
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    secretContent: v.string(),
    iv: v.string(),
    authTag: v.string(),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_organization_id_and_service", ["organizationId", "service"]),
  crawlJobs: defineTable({
    organizationId: v.string(),
    url: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("crawling"),
      v.literal("completed"),
      v.literal("failed")
    ),
    maxDepth: v.number(),
    options: v.object({
      includeImages: v.boolean(),
      includePdfs: v.boolean(),
      includeText: v.boolean(),
    }),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    error: v.optional(v.string()),
    pagesVisited: v.number(),
    resourcesFound: v.number(),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_status", ["status"])
    .index("by_organization_and_status", ["organizationId", "status"]),

  crawlResults: defineTable({
    jobId: v.id("crawlJobs"),
    url: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("pdf")),
    title: v.string(),
    description: v.optional(v.string()),
    size: v.optional(v.number()),
    contentHash: v.string(),
    selected: v.boolean(),
    addedToKnowledgeBase: v.boolean(),
    sourceUrl: v.string(),
    error: v.optional(v.string()),
  })
    .index("by_job_id", ["jobId"])
    .index("by_content_hash", ["contentHash"])
    .index("by_type", ["type"])
    .index("by_job_and_type", ["jobId", "type"]),
});
