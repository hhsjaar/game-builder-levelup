import type { MessageRecord } from "@/lib/types";

export default function ChatBubble({ message }: { message: MessageRecord }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] animate-pop-in whitespace-pre-line rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[15px] leading-snug text-primary-foreground sm:max-w-[75%]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-pop-in items-start gap-2.5">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs">
        🎮
      </span>
      <p className="max-w-[85%] whitespace-pre-line pt-0.5 text-[15px] leading-relaxed text-foreground sm:max-w-[75%]">
        {message.content}
      </p>
    </div>
  );
}
