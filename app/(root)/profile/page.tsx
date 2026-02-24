import { getCurrentUser } from "@/lib/actions/auth.action"
import ProfileForm from "@/components/ProfileForm"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const ProfilePage = async () => {
    const user = await getCurrentUser()

    if (!user) redirect("/sign-in")

    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="flex flex-col gap-10 max-w-4xl mx-auto">
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2 text-primary-100 hover:text-primary-200 transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Link>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-100 to-primary-200 bg-clip-text text-transparent">
                            Account Settings
                        </h1>
                        <p className="text-light-200 text-lg">
                            Manage your profile information and account preferences.
                        </p>
                    </div>
                </div>

                <ProfileForm user={user} />
            </div>
        </div>
    )
}

export default ProfilePage
