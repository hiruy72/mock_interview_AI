'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { is } from "zod/v4/locales"
import { toast } from "sonner"
import { log } from "console"
import FormFields from "./FormField"
import { useRouter } from "next/navigation"



const authFormSchema =(type:FormType)=>{
    return z.object({
        name: type=== "sign-up" ? z.string().min(3) : z.string().optional(),
        email : z.string().email(),
        password: z.string().min(3),

    })
}

const AuthForm = ({type}: {type: FormType}) => {
    const router = useRouter()
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
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if(type==='sign-up'){
            toast.success('Account Created Succesfully. Please signin')
            router.push('/sign-in')
            
        }
        else{
            toast.success('Signin successfully')
            router.push('/')
            
        }
        
    } catch (error) {
        console.log(error);
        toast.error(`There was an error ${error}`)
        
    }
  }
  const isSignIn = type ==="sign-in"
  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" alt="logo" height={32} width={38}/>
                <h2 className="text-primary-100">PrepWise</h2>

            </div>
            <h3> Practice job interviews with AI</h3>
        
            <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
             {!isSignIn && (
                <FormFields control={form.control} name="name" label="name" placeholder ="Your Name" />
             )}
             <FormFields control={form.control} name="email" label="email" placeholder ="Your Email Address" type="email"/>
             <FormFields control={form.control} name="password" label="password" placeholder ="Enter Password" type="password" />

            <Button className="btn " type="submit">{isSignIn ? "Sign in " : "Create an Account"}</Button>
        </form>
        </Form>
        <p className="text-center">
            {isSignIn ? "No accout yet?" :"Have an account already"}
            <Link href={!isSignIn ? '/sign-in': '/sign-up'} className="font-bold text-user-primary ml-1">
            {!isSignIn ? "sign in": "sign up"}
             </Link>

        </p>
    </div>
      
    </div>
  )
}

export default AuthForm
