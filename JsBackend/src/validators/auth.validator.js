import { z } from "zod";

export const registerUserSchema = z.object({
    body: z.object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
});

export const registerHospitalSchema = z.object({
    body: z.object({
        fullName: z.string().min(1, "Hospital name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
});

export const registerDoctorSchema = z.object({
    body: z.object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        specialization: z.string().min(1, "Specialization is required"),
        qualifications: z.string().min(1, "Qualifications are required"),
        hospitalId: z.string().min(1, "Hospital ID is required"),
        experienceYears: z.number().optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});
