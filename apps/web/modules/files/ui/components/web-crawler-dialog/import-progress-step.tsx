"use client";

import { Loader2Icon } from "lucide-react";

interface ImportProgressStepProps {
  current: number;
  total: number;
}

export const ImportProgressStep = ({
  current,
  total,
}: ImportProgressStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2Icon className="size-12 animate-spin text-primary" />
      <div className="text-center">
        <p className="font-medium">
          Importing {current} of {total}
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          This may take a moment...
        </p>
      </div>
    </div>
  );
};
