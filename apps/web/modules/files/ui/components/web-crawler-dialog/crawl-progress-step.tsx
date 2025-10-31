"use client";

import { Loader2Icon } from "lucide-react";

interface CrawlProgressStepProps {
  pagesVisited?: number;
}

export const CrawlProgressStep = ({ pagesVisited }: CrawlProgressStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2Icon className="size-12 animate-spin text-primary" />
      <div className="text-center">
        <p className="font-medium">Scanning website for resources...</p>
        {pagesVisited !== undefined && (
          <p className="text-muted-foreground text-sm mt-2">
            {pagesVisited} page{pagesVisited !== 1 && "s"} visited
          </p>
        )}
      </div>
    </div>
  );
};
