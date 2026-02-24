'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,

} from "@/components/ui/form"


import Image from "next/image"
import Link from "next/link"

import { toast } from "sonner"

import FormFields from "./FormField"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/client";

import { signUp, signIn } from "@/lib/actions/auth.action";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"




const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),

    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const formSchema = authFormSchema(type);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const toastId = toast.loading(type === "sign-in" ? "Signing in..." : "Creating account...");

        try {
            if (type === 'sign-up') {
                const { name, email, password } = values

                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const idToken = await userCredential.user.getIdToken();

                const signUpResult = await signUp({
                    uid: userCredential.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if (!signUpResult?.success) {
                    toast.error(signUpResult?.message || "Failed to save user data", { id: toastId })
                    setIsLoading(false);
                    return
                }

                // Automatically sign in after sign up
                const signInResult = await signIn({
                    email,
                    idToken
                })

                if (!signInResult?.success) {
                    toast.error("Account created, but failed to sign in automatically. Please sign in manually.", { id: toastId })
                    router.push('/sign-in')
                    setIsLoading(false);
                    return
                }

                toast.success('Account created successfully!', { id: toastId })
                router.push('/')
            }
            else {
                const { email, password } = values;

                const userCredential = await signInWithEmailAndPassword(auth, email, password)

                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    toast.error('Failed to get id token', { id: toastId })
                    setIsLoading(false);
                    return
                }
                const result = await signIn({
                    email, idToken
                })

                if (!result?.success) {
                    toast.error(result?.message || 'Failed to sign in', { id: toastId })
                    setIsLoading(false);
                    return
                }

                toast.success('Signed in successfully', { id: toastId })
                router.push('/')

            }

        } catch (error: any) {
            console.error("Auth Error:", error);
            const errorMessage = error.message || "An unexpected error occurred. Please try again.";
            toast.error(errorMessage, { id: toastId });
            setIsLoading(false);
        }
    }
    const isSignIn = type === "sign-in"
    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">PrepWise</h2>

                </div>
                <h3 className="text-center"> Practice job interviews with AI</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                        {!isSignIn && (
                            <FormFields control={form.control} name="name" label="Name" placeholder="Your Name" />
                        )}
                        <FormFields control={form.control} name="email" label="Email" placeholder="Your Email Address" type="email" />
                        <FormFields control={form.control} name="password" label="Password" placeholder="Enter Password" type="password" />

                        <Button
                            className="btn"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Please wait..." : (isSignIn ? "Sign in" : "Create an Account")}
                        </Button>
                    </form>
                </Form>
                <p className="text-center text-light-100">
                    {isSignIn ? "No account yet?" : "Have an account already?"}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-primary-200 ml-1">
                        {!isSignIn ? "Sign in" : "Sign up"}
                    </Link>

                </p>
            </div>

        </div>
    )
}

export default AuthForm
