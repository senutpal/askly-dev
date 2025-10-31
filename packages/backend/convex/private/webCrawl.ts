import { ConvexError, v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "../_generated/server";
import { internal } from "../_generated/api";
import { crawlWebsite } from "../lib/webCrawler";
import { extractTextContent } from "../lib/extractTextContent";
import { contentHashFromArrayBuffer } from "@convex-dev/rag";
import rag from "../system/ai/rag";
import { Id } from "../_generated/dataModel";
import axios from "axios";
import { parseHTML } from "linkedom";
import type { ActionCtx } from "../_generated/server";

type StartCrawlArgs = {
  url: string;
  maxDepth: number;
  options: {
    includeImages: boolean;
    includePdfs: boolean;
    includeText: boolean;
  };
};

type AddSelectedArgs = {
  jobId: Id<"crawlJobs">;
  selectedResourceIds: Id<"crawlResults">[];
};

async function startCrawlHandler(
  ctx: ActionCtx,
  args: StartCrawlArgs
): Promise<{ jobId: Id<"crawlJobs"> }> {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Identity Not Found",
    });
  }

  const orgId = identity.orgId as string | undefined;
  if (!orgId) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Organization Not Found",
    });
  }

  const jobId = (await ctx.runMutation(internal.private.webCrawl.createJob, {
    organizationId: orgId,
    url: args.url,
    maxDepth: args.maxDepth,
    options: args.options,
  })) as Id<"crawlJobs">;

  await ctx.scheduler.runAfter(0, internal.private.webCrawl.executeCrawl, {
    jobId,
    args,
  });

  return { jobId };
}

export const startCrawl = action({
  args: {
    url: v.string(),
    maxDepth: v.number(),
    options: v.object({
      includeImages: v.boolean(),
      includePdfs: v.boolean(),
      includeText: v.boolean(),
    }),
  },
  handler: startCrawlHandler,
});

/**
 * Execute the actual crawl (internal function)
 * This is an internal helper — fully typed.
 */

export const executeCrawl = internalAction({
  args: {
    jobId: v.id("crawlJobs"),
    args: v.object({
      url: v.string(),
      maxDepth: v.number(),
      options: v.object({
        includeImages: v.boolean(),
        includePdfs: v.boolean(),
        includeText: v.boolean(),
      }),
    }),
  },
  handler: async (ctx, params) => {
    const { jobId, args } = params;
    try {
      await ctx.runMutation(internal.private.webCrawl.updateJobStatus, {
        jobId,
        status: "crawling",
      });

      const result = await crawlWebsite({
        url: args.url,
        maxDepth: args.maxDepth,
        includeImages: args.options.includeImages,
        includePdfs: args.options.includePdfs,
        includeText: args.options.includeText,
      });

      await ctx.runMutation(internal.private.webCrawl.saveResults, {
        jobId,
        resources: result.resources,
        pagesVisited: result.pagesVisited,
      });

      await ctx.runMutation(internal.private.webCrawl.updateJobStatus, {
        jobId,
        status: "completed",
        pagesVisited: result.pagesVisited,
        resourcesFound: result.resources.length,
      });
    } catch (error) {
      await ctx.runMutation(internal.private.webCrawl.updateJobStatus, {
        jobId,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown",
      });
    }
  },
});

export const getJob = query({
  args: { jobId: v.id("crawlJobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity Not Found",
      });
    }

    const orgId = identity.orgId as string | undefined;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization Not Found",
      });
    }

    const job = await ctx.db.get(args.jobId);
    if (!job || job.organizationId !== orgId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Job not found",
      });
    }

    return job;
  },
});

export const getResults = query({
  args: {
    jobId: v.id("crawlJobs"),
    typeFilter: v.optional(
      v.union(v.literal("text"), v.literal("image"), v.literal("pdf"))
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity Not Found",
      });
    }

    const orgId = identity.orgId as string | undefined;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization Not Found",
      });
    }

    const job = await ctx.db.get(args.jobId);
    if (!job || job.organizationId !== orgId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Job not found",
      });
    }

    let results;
    if (args.typeFilter) {
      results = await ctx.db
        .query("crawlResults")
        .withIndex("by_job_and_type", (q) =>
          q
            .eq("jobId", args.jobId)
            .eq("type", args.typeFilter as "text" | "image" | "pdf")
        )
        .collect();
    } else {
      results = await ctx.db
        .query("crawlResults")
        .withIndex("by_job_id", (q) => q.eq("jobId", args.jobId))
        .collect();
    }

    return results;
  },
});

export const addSelectedResources = action({
  args: {
    jobId: v.id("crawlJobs"),
    selectedResourceIds: v.array(v.id("crawlResults")),
  },
  handler: async (ctx, args: AddSelectedArgs) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity Not Found",
      });
    }

    const orgId = identity.orgId as string | undefined;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization Not Found",
      });
    }

    const job = await ctx.runQuery(internal.private.webCrawl.getJobDocument, {
      jobId: args.jobId,
    });

    if (!job || job.organizationId !== orgId) {
      throw new ConvexError({ code: "NOT_FOUND", message: "Job not found" });
    }

    const results: Array<{
      resourceId: Id<"crawlResults">;
      success: boolean;
      entryId?: string;
      error?: string;
    }> = [];

    for (const resourceId of args.selectedResourceIds) {
      try {
        const resource = await ctx.runQuery(
          internal.private.webCrawl.getResource,
          {
            resourceId,
          }
        );

        if (!resource) {
          results.push({
            resourceId,
            success: false,
            error: "Resource not found",
          });
          continue;
        }

        if (resource.jobId !== args.jobId) {
          results.push({
            resourceId,
            success: false,
            error: "Resource does not belong to this job",
          });
          continue;
        }

        if (resource.addedToKnowledgeBase) {
          results.push({
            resourceId,
            success: true,
            error: "Already in knowledge base",
          });
          continue;
        }

        let bytes: ArrayBuffer;
        let mimeType: string;
        const filename = resource.title ?? "file";

        if (resource.type === "text") {
          const response = await axios.get(resource.url, { timeout: 15000 });
          const { document } = parseHTML(response.data);
          const textContent = extractTextFromPage(
            document,
            resource.title || filename
          );
          bytes = new TextEncoder().encode(textContent).buffer;
          mimeType = "text/plain";
        } else {
          const response = await axios.get(resource.url, {
            responseType: "arraybuffer",
            timeout: 30000,
            maxContentLength: 10 * 1024 * 1024,
          });
          bytes = response.data as ArrayBuffer;
          mimeType =
            (response.headers["content-type"] as string | undefined) ||
            guessMimeType(filename);
        }

        const blob = new Blob([bytes], { type: mimeType });
        const storageId = await ctx.storage.store(blob);

        const text = await extractTextContent(ctx, {
          storageId,
          filename,
          bytes,
          mimeType,
        });

        const { entryId, created } = await rag.add(ctx, {
          namespace: orgId,
          text,
          key: filename,
          metadata: {
            storageId,
            uploadedBy: orgId,
            filename,
            category: "web-crawl",
            sourceUrl: resource.url,
            crawledAt: Date.now(),
          },
          contentHash: await contentHashFromArrayBuffer(bytes),
        });

        if (!created) {
          await ctx.storage.delete(storageId);
        }

        await ctx.runMutation(internal.private.webCrawl.markAsAdded, {
          resourceId,
        });

        results.push({
          resourceId,
          success: true,
          entryId,
        });
      } catch (error) {
        console.error(`Error processing resource ${resourceId}:`, error);
        results.push({
          resourceId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return {
      results,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };
  },
});

export const createJob = internalMutation({
  args: {
    organizationId: v.string(),
    url: v.string(),
    maxDepth: v.number(),
    options: v.object({
      includeImages: v.boolean(),
      includePdfs: v.boolean(),
      includeText: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("crawlJobs", {
      organizationId: args.organizationId,
      url: args.url,
      status: "pending",
      maxDepth: args.maxDepth,
      options: args.options,
      startedAt: Date.now(),
      pagesVisited: 0,
      resourcesFound: 0,
    });
  },
});

export const updateJobStatus = internalMutation({
  args: {
    jobId: v.id("crawlJobs"),
    status: v.union(
      v.literal("pending"),
      v.literal("crawling"),
      v.literal("completed"),
      v.literal("failed")
    ),
    error: v.optional(v.string()),
    pagesVisited: v.optional(v.number()),
    resourcesFound: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = {
      status: args.status,
    };

    if (args.status === "completed" || args.status === "failed") {
      updates.completedAt = Date.now();
    }

    if (args.error !== undefined) {
      updates.error = args.error;
    }

    if (args.pagesVisited !== undefined) {
      updates.pagesVisited = args.pagesVisited;
    }

    if (args.resourcesFound !== undefined) {
      updates.resourcesFound = args.resourcesFound;
    }

    await ctx.db.patch(args.jobId, updates);
  },
});

export const saveResults = internalMutation({
  args: {
    jobId: v.id("crawlJobs"),
    resources: v.array(
      v.object({
        url: v.string(),
        type: v.union(v.literal("text"), v.literal("image"), v.literal("pdf")),
        title: v.string(),
        description: v.optional(v.string()),
        size: v.optional(v.number()),
        contentHash: v.string(),
        sourceUrl: v.string(),
      })
    ),
    pagesVisited: v.number(),
  },
  handler: async (ctx, args) => {
    for (const resource of args.resources) {
      await ctx.db.insert("crawlResults", {
        jobId: args.jobId,
        url: resource.url,
        type: resource.type,
        title: resource.title,
        description: resource.description,
        size: resource.size,
        contentHash: resource.contentHash,
        selected: true,
        addedToKnowledgeBase: false,
        sourceUrl: resource.sourceUrl,
      });
    }
  },
});

export const getResource = internalQuery({
  args: { resourceId: v.id("crawlResults") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.resourceId);
  },
});

export const getJobDocument = internalQuery({
  args: { jobId: v.id("crawlJobs") },
  handler: async (ctx, args) => ctx.db.get(args.jobId),
});

export const markAsAdded = internalMutation({
  args: { resourceId: v.id("crawlResults") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.resourceId, {
      addedToKnowledgeBase: true,
    });
  },
});

function extractTextFromPage(document: any, title: string): string {
  const body = document.body ?? document;
  const cloned = body.cloneNode(true) as Element;

  const unwanted = Array.from(
    cloned.querySelectorAll(
      "script, style, nav, footer, header, aside, iframe, noscript"
    )
  );
  for (const el of unwanted) {
    el.remove();
  }

  const text = (cloned.textContent ?? "")
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();

  return `# ${title}\n\n${text}`;
}

function guessMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[ext] || "application/octet-stream";
}
