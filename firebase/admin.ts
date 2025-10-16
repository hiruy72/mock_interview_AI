import {cert, getApps, initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'
const  intiFirebaseAdmin=()=>{
    const app =getApps()

    if(!app.length){
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,

                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            })
        })
    }
    return {
        auth: getAuth(),
        db: getFirestore(),
    }
}

const { auth, db } = intiFirebaseAdmin()


export {auth, db};