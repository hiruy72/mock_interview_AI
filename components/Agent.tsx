"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { interviewer } from "@/constants";
import { createFeedback, generateInterviewAction } from "@/lib/actions/general.action";
import { toast } from "sonner";
import Vapi from "@vapi-ai/web";

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({ userName, userId, interviewId, feedbackId, type, questions }: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const lastMessage = messages[messages.length - 1]?.content;

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = useCallback(
    async (messagesToSend: SavedMessage[]) => {
      if (!userId || !interviewId) return;

      const toastId = toast.loading("Generating AI feedback...");

      const result = await createFeedback({
        interviewId,
        userId,
        transcript: messagesToSend,
        feedbackId,
      });

      if (result?.success && result.feedbackId) {
        toast.success("Feedback generated successfully!", { id: toastId });
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        toast.error("Failed to generate feedback", { id: toastId });
        router.push("/");
      }
    },
    [userId, interviewId, feedbackId, router]
  );

  const handleGenerateInterview = useCallback(
    async (messagesToSend: SavedMessage[]) => {
      if (!userId) return;

      const toastId = toast.loading("Creating your custom interview...");

      const result = await generateInterviewAction({
        userId,
        transcript: messagesToSend,
      });

      if (result?.success && result.interviewId) {
        toast.success("Interview created successfully!", { id: toastId });
        router.push(`/interview/${result.interviewId}`);
      } else {
        toast.error("Failed to create interview", { id: toastId });
        router.push("/");
      }
    },
    [userId, router]
  );

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        handleGenerateInterview(messages);
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [
    callStatus,
    type,
    messages,
    router,
    handleGenerateFeedback,
    handleGenerateInterview,
  ]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(
        {
          ...interviewer,
          firstMessage:
            "Hello! I'm here to help you set up your custom mock interview. What job role and experience level are you preparing for?",
        },
        {
          variableValues: {
            questions:
              "Ask the user for the job role, level, and tech stack. Once you have enough information, generate 5-8 relevant interview questions and confirm with the user. Then tell them the interview setup is complete.",
          },
        }
      );
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question, index) => `Question ${index + 1}: ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="AI Interviewer"
              width={65}
              height={54}
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="User avatar"
              width={540}
              height={540}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75 bg-success-100 size-full",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span>
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
