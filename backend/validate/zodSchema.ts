import {z} from "zod";
export const signupZodSchema = z.object({
    fullName: z.string({message:"Full name is required"}).min(3,"Full name should contain atlest 3 characters"),
    email: z.email({message:"Invalid email"}),
    password: z.string({message:"Password is required"}).min(6,"Password should contain atlest 6 characters"),
});

export const loginZodSchema = z.object({
    email: z.email({message:"Invalid email"}),
    password: z.string({message:"Password is required"}).min(6,"Password should contain atlest 6 characters"),
});

export const blogCreateZodSchema = z.object({
    title: z.string({message:"Title is required"}),
    content: z.string({message:"Content is required"}),
    image: z.string().optional(),
});

export const commentZodSchema = z.object({
    content: z.string({message:"Content is required"}),
})