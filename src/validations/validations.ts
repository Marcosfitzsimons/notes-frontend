import * as z from "zod"

export const loginSchema = z.object({
  username: z.string().max(20, {
    message: "Username must be at most 15 characters.",
  }).refine(data => data.length > 0, {
    message: "Username is required.",
  }),
  password: z.string().max(30, {
    message: "Password must be at most 20 characters.",
  }).refine(data => data.length > 0, {
    message: "Password is required.",
  }),
});

export const notePostSchema = z.object({
  title: z.string().max(15, {
    message: "Title must be at most 15 characters.",
  }).refine(data => data.length > 0, {
    message: "Title is required.",
  }),
  content: z.string().max(50, {
    message: "Content must be at most 50 characters.",
  }).refine(data => data.length > 0, {
    message: "Content is required.",
  }),
});