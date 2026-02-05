import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { webhook as polarWebhook } from "./polar";

const http = httpRouter();

// Auth routes
auth.addHttpRoutes(http);

// Polar webhook route
http.route({
  path: "/polar/webhook",
  method: "POST",
  handler: polarWebhook,
});

export default http;
