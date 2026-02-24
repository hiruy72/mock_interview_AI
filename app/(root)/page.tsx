import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  const hasPastInterviews = userInterviews.length > 0;
  const hasLatestInterviews = latestInterviews.length > 0;

  return (
    <>
      {/* Hero Section */}
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <div className="flex flex-col gap-1">
            <p className="text-primary-100 font-medium">Welcome back, {user.name} 👋</p>
            <h2 className="text-2xl font-semibold">
              Get Interview-Ready with AI-Powered Practice & Feedback
            </h2>
          </div>
          <p className="text-lg">
            Practice real interview questions & get instant AI feedback to ace
            your next job interview.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="AI interview assistant"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/* Your Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-xl font-semibold">Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={interview.userId}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>You haven&apos;t created any interviews yet.</p>
          )}
        </div>
      </section>

      {/* Take an Interview */}
      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-xl font-semibold">Take an Interview</h2>
        <div className="interviews-section">
          {hasLatestInterviews ? (
            latestInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={interview.userId}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <p>No interviews available from other users yet.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
