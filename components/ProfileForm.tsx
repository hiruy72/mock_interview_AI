'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import Image from "next/image"
import { toast } from "sonner"
import FormFields from "./FormField"
import { storage } from "@/firebase/client"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { updateUser } from "@/lib/actions/user.action"
import { Camera, Loader2 } from "lucide-react"

const profileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    image: z.string().optional(),
})

interface ProfileFormProps {
    user: User;
}

const ProfileForm = ({ user }: ProfileFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(user.image || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || "",
            image: user.image || "",
        },
    })

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Firebase
        setUploading(true);
        const toastId = toast.loading("Uploading image...");
        try {
            const storageRef = ref(storage, `profiles/${user.id}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            form.setValue("image", downloadURL);
            toast.success("Image uploaded successfully", { id: toastId });
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        setIsLoading(true);
        const toastId = toast.loading("Updating profile...");

        try {
            const result = await updateUser({
                userId: user.id,
                name: values.name,
                image: values.image,
            });

            if (result.success) {
                toast.success(result.message, { id: toastId });
            } else {
                toast.error(result.message, { id: toastId });
            }
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("An unexpected error occurred", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="card-border w-full max-w-2xl mx-auto">
            <div className="flex flex-col gap-8 card py-12 px-8 md:px-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-200/30 flex items-center justify-center bg-dark-200 relative">
                            {previewImage ? (
                                <Image
                                    src={previewImage}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-4xl font-bold text-light-100">{user.name?.charAt(0).toUpperCase()}</span>
                            )}

                            {uploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary-100" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-light-100">{user.name}</h2>
                        <p className="text-light-200">{user.email}</p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 form">
                        <FormFields
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Enter your name"
                        />

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                className="btn w-full md:w-auto px-10"
                                type="submit"
                                disabled={isLoading || uploading}
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default ProfileForm
