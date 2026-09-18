import type { MessageRecord } from "@/lib/types";

export default function ChatBubble({ message }: { message: MessageRecord }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] animate-pop-in whitespace-pre-line rounded-3xl px-4 py-3 text-sm shadow-sm sm:max-w-[85%] ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border-2 border-card-border bg-card-bg"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
