import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(
      /^\+?[\d\s\-().]{7,20}$/,
      "Invalid phone format"
    ),
  company: z.string().min(1, "Company is required"),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional(),
  lastContactDate: z.string().optional(),
});

export type CustomerSchema = z.infer<typeof customerSchema>;

export const filterSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.enum(["active", "inactive"])).optional(),
  company: z.array(z.string()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export type FilterSchema = z.infer<typeof filterSchema>;
