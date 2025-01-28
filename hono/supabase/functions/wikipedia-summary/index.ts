import { Hono } from "jsr:@hono/hono";

// change this to your function name
const functionName = "wikipedia-summary";
const app = new Hono().basePath(`/${functionName}`);

app.get("/test", (c) => c.text("Wikipedia Summary!Yo"));

Deno.serve(app.fetch);
