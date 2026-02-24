'use server';

import { db } from "@/firebase/admin";
import { revalidatePath } from "next/cache";

export async function updateUser(params: {
    userId: string;
    name?: string;
    image?: string;
}) {
    const { userId, name, image } = params;

    try {
        const updateData: Record<string, string> = {};
        if (name) updateData.name = name;
        if (image) updateData.image = image;

        await db.collection('users').doc(userId).update(updateData);

        revalidatePath('/profile');
        revalidatePath('/');

        return {
            success: true,
            message: 'Profile updated successfully'
        };
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            success: false,
            message: 'Failed to update profile'
        };
    }
}
