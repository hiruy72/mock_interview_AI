"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      className="btn-secondary !text-sm !px-4 !min-h-9"
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
