import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

const gemini = google("gemini-2.5-flash");

export const supportAgent = new Agent(components.agent, {
  name: "Askly",
  languageModel: gemini,
  instructions: SUPPORT_AGENT_PROMPT,
});
