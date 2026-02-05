import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verify document ownership
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      return [];
    }

    const knowledge = await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    return knowledge;
  },
});

export const create = mutation({
  args: {
    documentId: v.id("documents"),
    label: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify document ownership
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }

    const knowledgeId = await ctx.db.insert("knowledge", {
      documentId: args.documentId,
      userId,
      label: args.label,
      content: args.content,
      createdAt: Date.now(),
    });

    return knowledgeId;
  },
});

export const update = mutation({
  args: {
    knowledgeId: v.id("knowledge"),
    label: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const knowledge = await ctx.db.get(args.knowledgeId);
    if (!knowledge || knowledge.userId !== userId) {
      throw new Error("Knowledge entry not found");
    }

    const updates: Partial<{ label: string; content: string }> = {};
    if (args.label !== undefined) {
      updates.label = args.label;
    }
    if (args.content !== undefined) {
      updates.content = args.content;
    }

    await ctx.db.patch(args.knowledgeId, updates);
    return args.knowledgeId;
  },
});

export const remove = mutation({
  args: { knowledgeId: v.id("knowledge") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const knowledge = await ctx.db.get(args.knowledgeId);
    if (!knowledge || knowledge.userId !== userId) {
      throw new Error("Knowledge entry not found");
    }

    await ctx.db.delete(args.knowledgeId);
  },
});
