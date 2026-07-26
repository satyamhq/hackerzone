import { z } from "zod";

export const userRoleSchema = z.enum(["student", "employer", "institution_admin", "admin"]);

export const authSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const companySetupSchema = z.object({
  name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  industry: z.string().min(2, { message: "Industry field is required." }),
  size_range: z.string().min(1, { message: "Company size range is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

export const createJobSchema = z.object({
  title: z.string().min(3, { message: "Job title must be at least 3 characters." }),
  description: z.string().min(20, { message: "Job description must be at least 20 characters." }),
  job_type: z.enum(["full_time", "internship", "part_time", "freelance", "gig"]),
  location: z.string().min(2, { message: "Location is required." }),
  is_remote: z.boolean().default(false),
  min_salary: z.number().positive({ message: "Min salary must be a positive number." }).optional(),
  max_salary: z.number().positive({ message: "Max salary must be a positive number." }).optional(),
  skills_required: z.array(z.string()).min(1, { message: "Select at least one required skill." }),
  status: z.enum(["draft", "open", "closed"]).default("open"),
});
