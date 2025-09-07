import crypto from "crypto";
export const sluggify = (input:string):string => {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') //remove special chars
        .replace(/\s+/g, '-')  //replace spaces with hyphens
        .replace(/-+/g, '-') //collapse multiple -
}

export const generateUserName = (input:string):string => {
    const base = sluggify(input);
    const uniqueId = crypto.randomBytes(2).toString("hex");
    return `@${base}-bv${uniqueId}`
}

export const generateBlogSlug = (input:string):string => {
    const base = sluggify(input);
    const uniqueId = crypto.randomBytes(4).toString("hex");
    return `${base}-${uniqueId}`;
}
