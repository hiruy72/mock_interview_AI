import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import SignOutButton from "@/components/SignOutButton";
import ReduxUserInitializer from "@/components/ReduxUserInitializer";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <ReduxUserInitializer user={user || null} />
      <nav className="flex justify-between items-center py-4 px-6 md:px-10 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="PrepWise" width={38} height={32} />
          <h2 className="text-primary-100 font-bold text-xl">PrepWise</h2>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/profile" className="flex items-center gap-2 group">
            {user?.image ? (
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-200 group-hover:border-primary-100 transition-colors">
                <Image src={user.image} alt="Profile" width={36} height={36} className="object-cover" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-dark-200 border-2 border-primary-200 flex items-center justify-center group-hover:border-primary-100 transition-colors">
                <span className="text-sm font-bold text-primary-100">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <span className="hidden md:block text-light-100 font-medium group-hover:text-primary-100 transition-colors">Profile</span>
          </Link>
          <SignOutButton />
        </div>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
