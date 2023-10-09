
import { Message } from "ai/react";
import { cx } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cx("flex", 
               message.role === "user"?"justify-end pl-10":"",
               message.role === "assistant"?"justify-start pr-10":"")
            }
          >
            <div
              className={cx(
                "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
                
                 message.role === "user"? "bg-blue-600 text-black":"",
                
              )}
            >
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;