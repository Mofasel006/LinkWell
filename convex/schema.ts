import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),        // Tiptap JSON or HTML
    status: v.string(),         // "draft" | "saved"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
  
  knowledge: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    label: v.string(),          // e.g., "Research Notes"
    content: v.string(),        // Plain text reference
    createdAt: v.number(),
  }).index("by_document", ["documentId"]),
});
