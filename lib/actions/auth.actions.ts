'use server';

import { auth, db } from "@/firebase/admin";
import { Auth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { log } from "node:console";
import { success } from "zod";

const ONE_WEEK = 60*60*24*7;

export async function signUp(
    params : SignUpParams
) {
  
    const {uid, name, email} = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success: false,
                message: 'User already exists, please login instead'
            }
        }
        
        await db.collection('users').doc(uid).set({
            name,email
        })
        return{
            success: true,
            message: 'Account Created Successfully, Please Sign In'
        }
    } catch (e: any){
        console.log('error creating a user', e);

        if(e.code === 'auth/email-already-exists'){
          return{
            success: false,
            message: 'Email already in use'
          }   
        }
        return{
            success: false,
            message: `Failed to create user: ${e.message}`
        }
    }
}

export async function signIn(params: SignInParams){
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord){
            return {
                success: false,
                message: 'User not found, please sign up'
            }
        }
        await setSessionCookie(idToken);
        
    } catch (e) {

        console.log('error signing in', e);
        return {
            success: false,
            message: 'Failed to sign in. Please try again.'
        }
        
    }
}

export async function setSessionCookie(idToken: string){

    const cookieStore = await cookies();
    const setSessionCookie =await auth.createSessionCookie(idToken, {expiresIn: ONE_WEEK*1000})

    cookieStore.set('session', setSessionCookie,{
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',

    })

}