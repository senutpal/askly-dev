"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "storage" | "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);
  const setorganizationId = useSetAtom(organizationIdAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  // const setWidgetSettings = useSetAtom(widgetSettingsAtom);

  // ...existing code...
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  useEffect(() => {
    console.log("Organization ID:", organizationId);
    console.log("Contact Session Atom Value:", contactSessionId);
  }, [organizationId, contactSessionId]);
  // ...existing code...
  console.log(contactSessionId);

  const validateOrganization = useAction(api.public.organizations.validate);

  useEffect(() => {
    if (step !== "org") {
      return;
    }

    setLoadingMessage("Finding organization ID...");

    if (!organizationId) {
      setErrorMessage("Organization Id Required");
      setScreen("error");
      return;
    }
    setLoadingMessage("Verifying organization...");
    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setorganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Invalid Configuration");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Unable to verify organization");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setorganizationId,
    setStep,
    validateOrganization,
    setLoadingMessage,
  ]);

  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );

  useEffect(() => {
    if (step !== "session") {
      return;
    }
    console.log(validateContactSession);

    setLoadingMessage("Finding contact Session Id");
    if (!contactSessionId) {
      setSessionValid(false);
      setStep("settings");
      return;
    }
    setLoadingMessage("Validating Session");
    validateContactSession({
      contactSessionId,
    })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("settings");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("settings");
      });
  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  // const widgetSettings = useQuery(
  //   api.public.widgetSettings.getByorganizationId,
  //   organizationId
  //     ? {
  //         organizationId,
  //       }
  //     : "skip"
  // );

  useEffect(() => {
    if (step !== "settings") {
      return;
    }

    setLoadingMessage("Loading Widget Settings");
    setStep("done")

    // if (widgetSettings !== undefined) {
    //   setWidgetSettings(widgetSettings);
    //   setStep("done");
    // }
  }, [step, setStep,  setLoadingMessage]);

  useEffect(() => {
    if (step !== "session") {
      return;
    }

    setLoadingMessage("Finding contact Session Id");
    console.log("Contact Session ID:", contactSessionId); // Add debug logging

    if (!contactSessionId) {
      console.log("No contact session ID found, moving to settings step");
      setSessionValid(false);
      setStep("settings");
      return;
    }

    setLoadingMessage("Validating Session");
    validateContactSession({
      contactSessionId,
    })
      .then((result) => {
        console.log("Session validation result:", result);
        setSessionValid(result.valid);
        setStep("settings");
      })
      .catch((error) => {
        console.error("Session validation error:", error);
        setSessionValid(false);
        setStep("settings");
      });
  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }
    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className=" text-3xl">Hi there</p>
          <p className="text-lg">Lets&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || "Loading !!!"}</p>
      </div>
    </>
  );
};
