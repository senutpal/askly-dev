import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { useState } from "react";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon, CheckIcon, CopyIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

export const WidgetContactScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);

  const phoneNumber = widgetSettings?.vapiSettings.phoneNumber;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!phoneNumber) {
      return (
        <div className="flex h-full flex-col items-center justify-center">
          <p className="text-muted-foreground">Phone number not configured</p>
        </div>
      );
    }
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

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
          <p>Contact Us</p>
        </div>
      </WidgetHeader>
      <div className="flex h-full flex-col items-center justify-center gap-y-4">
        <div className="flex items-center justify-center rounded-full border bg-white p-3">
          <PhoneIcon className="size-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium ">Available 24/7</p>
        <p className="text-muted-foreground font-bold text-2xl ">
          {phoneNumber}
        </p>
      </div>
      <div className="border-t border-gray-200 bg-background p-4">
        <div className="flex flex-col items-center gap-y-2">
          <Button
            className="w-full "
            onClick={handleCopy}
            size="lg"
            variant="outline"
          >
            {copied ? (
              <>
                <CheckIcon className="mr-2" />
              </>
            ) : (
              <>
                <CopyIcon className="mr-2 size-4" />
                Copy Number
              </>
            )}
          </Button>
          <Button asChild className="w-full " size="lg">
            <Link href={`tel:${phoneNumber}`}>
              <PhoneIcon />
              Call Now
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
