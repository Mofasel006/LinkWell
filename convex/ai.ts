"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import OpenAI from "openai";

export const generateContent = action({
  args: {
    documentContent: v.string(),
    knowledgeContext: v.array(v.string()),
    userPrompt: v.string(),
    selectedText: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let systemPrompt = `You are an expert writing assistant helping users create high-quality documents. 
Your responses should be well-structured, professional, and match the tone of the existing document.`;

    if (args.knowledgeContext.length > 0) {
      systemPrompt += `

IMPORTANT: Use ONLY the following reference materials as context for your responses. 
Do not make up information that is not supported by these references:

${args.knowledgeContext.map((k, i) => `--- Reference ${i + 1} ---\n${k}`).join("\n\n")}`;
    }

    if (args.documentContent) {
      systemPrompt += `

Current document content:
${args.documentContent}`;
    }

    if (args.selectedText) {
      systemPrompt += `

The user has selected the following text for editing:
"${args.selectedText}"`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: args.userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0].message.content ?? "";
  },
});

export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
      })
    ),
    documentContent: v.string(),
    knowledgeContext: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let systemPrompt = `You are an expert writing assistant helping users create documents. 
You can help with writing, editing, improving, and answering questions about the document.
Keep responses concise and helpful.`;

    if (args.knowledgeContext.length > 0) {
      systemPrompt += `

Reference materials available:
${args.knowledgeContext.map((k, i) => `--- Reference ${i + 1} ---\n${k}`).join("\n\n")}`;
    }

    if (args.documentContent) {
      systemPrompt += `

Current document:
${args.documentContent}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...args.messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0].message.content ?? "";
  },
});
