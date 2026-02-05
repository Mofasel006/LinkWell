import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const list = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }
    
    // Verify user owns the document
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      return [];
    }
    
    const entries = await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .collect();
    
    return entries;
  },
});

export const create = mutation({
  args: {
    documentId: v.id("documents"),
    label: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    // Verify user owns the document
    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }
    
    const entryId = await ctx.db.insert("knowledge", {
      documentId: args.documentId,
      userId,
      label: args.label,
      content: args.content,
      createdAt: Date.now(),
    });
    
    return entryId;
  },
});

export const update = mutation({
  args: {
    id: v.id("knowledge"),
    label: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== userId) {
      throw new Error("Knowledge entry not found");
    }
    
    const updates: Record<string, unknown> = {};
    
    if (args.label !== undefined) {
      updates.label = args.label;
    }
    if (args.content !== undefined) {
      updates.content = args.content;
    }
    
    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("knowledge") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== userId) {
      throw new Error("Knowledge entry not found");
    }
    
    await ctx.db.delete(args.id);
  },
});
