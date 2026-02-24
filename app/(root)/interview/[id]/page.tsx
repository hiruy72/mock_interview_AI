import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import DisplayTechIcons from "@/components/DispalyTechIcons";

const InterviewPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <>
      <div className="flex flex-row gap-4 justify-between items-center">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <Image
            src="/ai-avatar.png"
            alt="AI Interviewer"
            width={65}
            height={54}
          />
          <h3>Interview: {interview.role}</h3>
        </div>
        <DisplayTechIcons techStack={interview.techstack} />
      </div>

      <Agent
        userName={user.name}
        userId={user.id}
        userImage={user.image}
        interviewId={id}
        feedbackId={feedback?.id}
        type="interview"
        questions={interview.questions}
      />
    </>
  );
};

export default InterviewPage;
