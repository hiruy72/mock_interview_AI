import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeedbackPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  if (!feedback) redirect(`/interview/${id}`);

  return (
    <section className="section-feedback">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-2">
          Interview Feedback
        </h1>
        <p className="text-light-400 text-lg">
          {interview.role} - {interview.type}
        </p>
        <p className="text-light-400 text-sm mt-1">
          {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
        </p>
      </div>

      {/* Overall Score */}
      <div className="flex flex-col items-center">
        <div className="relative size-36 flex items-center justify-center">
          <svg className="size-full" viewBox="0 0 36 36">
            <path
              className="text-dark-300"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              className="text-primary-200"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={`${feedback.totalScore}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-white">
              {feedback.totalScore}
            </span>
            <span className="text-xs text-light-400">/100</span>
          </div>
        </div>
        <p className="mt-4 text-xl font-semibold text-primary-200">
          Overall Score
        </p>
      </div>

      {/* Category Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedback.categoryScores.map((category, index) => (
          <div
            key={index}
            className="card-border"
          >
            <div className="card p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">{category.name}</h3>
                <span
                  className={`text-xl font-bold ${
                    category.score >= 80
                      ? "text-success-100"
                      : category.score >= 50
                      ? "text-yellow-400"
                      : "text-destructive-100"
                  }`}
                >
                  {category.score}
                </span>
              </div>
              <div className="w-full bg-dark-300 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    category.score >= 80
                      ? "bg-success-100"
                      : category.score >= 50
                      ? "bg-yellow-400"
                      : "bg-destructive-100"
                  }`}
                  style={{ width: `${category.score}%` }}
                />
              </div>
              <p className="text-sm text-light-400">{category.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-border">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/star.svg"
                alt="Strengths"
                width={24}
                height={24}
              />
              <h3 className="text-lg font-semibold text-success-100">
                Strengths
              </h3>
            </div>
            <ul className="flex flex-col gap-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-light-100 text-sm">
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card-border">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/upload.svg"
                alt="Areas for Improvement"
                width={24}
                height={24}
              />
              <h3 className="text-lg font-semibold text-yellow-400">
                Areas for Improvement
              </h3>
            </div>
            <ul className="flex flex-col gap-2">
              {feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="text-light-100 text-sm">
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Final Assessment */}
      <div className="card-border w-full">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">Final Assessment</h3>
          <p className="text-light-100 leading-7">
            {feedback.finalAssessment}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="buttons">
        <Button className="btn-primary" asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
        <Button className="btn-secondary" asChild>
          <Link href={`/interview/${id}`}>Retake Interview</Link>
        </Button>
      </div>
    </section>
  );
};

export default FeedbackPage;
