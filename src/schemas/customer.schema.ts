import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .min(4, "Name must be at least 4 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number cannot be empty")
    .regex(/^\+91 [6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  company: z
    .string()
    .trim()
    .min(1, "Company cannot be empty")
    .min(3, "Company must be at least 3 characters"),
  status: z.enum(["active", "inactive"], {
    message: "Status cannot be empty",
  }),
  notes: z.string().optional(),
  lastContactDate: z
    .string()
    .trim()
    .min(1, "Date cannot be empty")
    .refine((val) => {
      const dateVal = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return dateVal <= today;
    }, "Last contact date cannot be in the future"),
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
