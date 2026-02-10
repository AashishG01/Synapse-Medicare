import { z } from "zod";

export const handoffSummarySchema = z.object({
    body: z.object({
        reports: z.array(z.string()).min(1, "At least one report is required"),
    }),
});

export const updateBedsSchema = z.object({
    body: z.object({
        beds: z.number().min(0, "Beds cannot be negative"),
    }),
});
