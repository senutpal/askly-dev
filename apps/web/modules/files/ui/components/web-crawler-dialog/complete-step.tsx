"use client";

import { CheckCircleIcon } from "lucide-react";

interface CompleteStepProps {
  successful: number;
  failed: number;
}

export const CompleteStep = ({ successful, failed }: CompleteStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="rounded-full bg-green-100 p-4">
        <CheckCircleIcon className="size-10 text-green-600" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-lg">Import Complete!</p>
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          <p>
            {successful} resource{successful !== 1 && "s"} imported successfully
          </p>
          {failed > 0 && (
            <p className="text-destructive">{failed} failed to import</p>
          )}
        </div>
      </div>
    </div>
  );
};
