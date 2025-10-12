import { useSetAtom } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { useVapi } from "../../hooks/use-vapi";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon, Mic, MicOff } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";

export const WidgetVoiceScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const {
    isConnected,
    isSpeaking,
    transcript,
     endCall,
    isConnecting,
    startCall,
  } = useVapi();

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            onClick={() => setScreen("selection")}
            variant="transparent"
            size="icon"
          >
            <ArrowLeftIcon />
          </Button>
          <p>Voice</p>
        </div>
      </WidgetHeader>
      {transcript.length > 0 ? (
        <AIConversation className="h-full">
          <AIConversationContent>
            {transcript.map((message, index) => (
              <AIMessage
                from={message.role}
                key={`${message.role}-${index}-${message.text}`}
              >
                <AIMessageContent>{message.text}</AIMessageContent>
              </AIMessage>
            ))}
          </AIConversationContent>
          <AIConversationScrollButton />
        </AIConversation>
      ) : (
        <div className="flex flex-1 h-full flex-col items-center justify-center gap-y-4">
          <div className="flex items-center justify-center rounded-full border bg-white p-3">
            <Mic className="size-5 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Transcirpt will appear here</p>
        </div>
      )}
      <div className="border-t bg-background p-4">
        <div
          className="flex flex-col items-center gap-y-4
      "
        >
          {isConnected && (
            <div className="flex items-center gap-x-2">
              <div
                className={cn(
                  "size-4 rounded-full",
                  isSpeaking ? "bg-red-500" : "bg-green-500"
                )}
              />
              <span className="text-muted-foreground">
                {isSpeaking ? "Assistant Speaking..." : "Listening"}
              </span>
            </div>
          )}
          <div className="flex w-full justify-center">
            {isConnected ? (
              <Button
                className="w-full"
                size="lg"
                variant="destructive"
                onClick={() => endCall()}
              >
                <MicOff />
                End Call
              </Button>
            ) : (
              <Button
                className="w-full"
                disabled={isConnecting}
                size="lg"
                onClick={() => startCall()}
              >
                <Mic />
                Start Call
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
