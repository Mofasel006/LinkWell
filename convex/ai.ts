import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

export const generateContent = action({
  args: {
    documentContent: v.string(),
    knowledgeContext: v.array(v.string()),
    userPrompt: v.string(),
    selectedText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    let knowledgeSection = "";
    if (args.knowledgeContext.length > 0) {
      knowledgeSection = `
Use ONLY the following knowledge as context for your response:
---
${args.knowledgeContext.join("\n---\n")}
---
`;
    }
    
    const systemPrompt = `You are a professional writing assistant helping users create well-written documents. 
${knowledgeSection}
Current document content:
---
${args.documentContent || "(Empty document)"}
---

${args.selectedText ? `The user has selected the following text: "${args.selectedText}"` : ""}

Provide helpful, well-written content that matches the tone and style of the existing document.
Be concise and direct in your responses.
Format your response appropriately for insertion into a document.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: args.userPrompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content;
  },
});

export const chat = action({
  args: {
    documentContent: v.string(),
    knowledgeContext: v.array(v.string()),
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    let knowledgeSection = "";
    if (args.knowledgeContext.length > 0) {
      knowledgeSection = `
Reference knowledge:
---
${args.knowledgeContext.join("\n---\n")}
---
`;
    }
    
    const systemPrompt = `You are a helpful AI writing assistant. You help users write and improve their documents.
${knowledgeSection}
Current document content:
---
${args.documentContent || "(Empty document)"}
---

You can:
- Answer questions about the document or knowledge
- Suggest improvements to the writing
- Help generate new content
- Explain concepts from the knowledge base

Be concise, helpful, and professional.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...args.messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content;
  },
});
