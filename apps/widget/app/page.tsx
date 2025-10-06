"use client";

import { WidgetView } from "@/modules/widget/ui/views/widget-view";
import { use } from "react";

interface Props {
  searchParams: Promise<{ organisationId: string }>;
}

const Page = ({ searchParams }: Props) => {
  const { organisationId } = use(searchParams);
  return <WidgetView organisationId={organisationId} />;
};

export default Page;
