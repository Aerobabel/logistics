import { z } from 'zod';

export const requestSchema = z.object({
    date: z.string().transform((str) => new Date(str)), // or z.date() if using a date picker that returns Date
    cargo: z.string().min(1, "Cargo details are required"),
    weight: z.coerce.number().optional(),
    routeFrom: z.string().min(1, "Origin is required"),
    routeTo: z.string().min(1, "Destination is required"),
    clientName: z.string().optional(),
    cost: z.coerce.number().optional(),
});

export type RequestFormValues = z.infer<typeof requestSchema>;

export const vehicleSchema = z.object({
    plate: z.string().min(1, "Plate number is required"),
    driver: z.string().optional(),
    type: z.string().optional(),
    status: z.enum(["AVAILABLE", "BUSY", "MAINTENANCE"]).default("AVAILABLE"),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;
