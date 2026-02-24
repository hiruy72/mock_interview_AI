"use client";

import { Trash2 } from "lucide-react";
import { deleteInterview } from "@/lib/actions/general.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DeleteInterviewButton = ({ interviewId }: { interviewId: string }) => {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this interview and all its data?")) {
            return;
        }

        const toastId = toast.loading("Deleting interview...");
        const result = await deleteInterview(interviewId);

        if (result.success) {
            toast.success("Interview deleted successfully", { id: toastId });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete interview", { id: toastId });
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
            title="Delete Interview"
        >
            <Trash2 size={20} />
        </button>
    );
};

export default DeleteInterviewButton;
