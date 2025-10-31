"use client";

import { useState, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { CheckCircleIcon, GlobeIcon } from "lucide-react";
import { CrawlInputStep } from "./crawl-input-step";
import { CrawlProgressStep } from "./crawl-progress-step";
import { ResultsSelectionStep } from "./results-selection-step";
import { ImportProgressStep } from "./import-progress-step";
import { CompleteStep } from "./complete-step";

type CrawlStep = "input" | "crawling" | "results" | "importing" | "complete";

interface WebCrawlerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WebCrawlerDialog = ({
  open,
  onOpenChange,
}: WebCrawlerDialogProps) => {
  const startCrawl = useAction(api.private.webCrawl.startCrawl);
  const addSelectedResources = useAction(
    api.private.webCrawl.addSelectedResources
  );

  const [step, setStep] = useState<CrawlStep>("input");
  const [url, setUrl] = useState("");
  const [maxDepth, setMaxDepth] = useState("1");
  const [includeImages, setIncludeImages] = useState(true);
  const [includePdfs, setIncludePdfs] = useState(true);
  const [includeText, setIncludeText] = useState(true);
  const [crawlError, setCrawlError] = useState<string | null>(null);


  const [jobId, setJobId] = useState<Id<"crawlJobs"> | null>(null);

  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    new Set()
  );

  const [importProgress, setImportProgress] = useState({
    current: 0,
    total: 0,
    successful: 0,
    failed: 0,
  });

  const job = useQuery(api.private.webCrawl.getJob, jobId ? { jobId } : "skip");

  const results = useQuery(
    api.private.webCrawl.getResults,
    jobId ? { jobId } : "skip"
  );

  useEffect(() => {
    if (step === "crawling" && job?.status === "completed") {
      setStep("results");
      if (results) {
        setSelectedResourceIds(new Set(results.map((r) => r._id)));
      }
    }
  }, [step, job?.status, results]);

  useEffect(() => {
    if (step === "crawling" && job?.status === "failed") {
      setCrawlError(job.error || "Crawl failed");
      setStep("input");
    }
  }, [step, job?.status, job?.error]);

  const handleStartCrawl = async () => {
    setCrawlError(null);

    try {
      new URL(url);
    } catch {
      setCrawlError("Please enter a valid URL");
      return;
    }

    setStep("crawling");

    try {
      const result = await startCrawl({
        url,
        maxDepth: parseInt(maxDepth),
        options: {
          includeImages,
          includePdfs,
          includeText,
        },
      });

      setJobId(result.jobId);
    } catch (error) {
      console.error(error);
      setCrawlError(
        error instanceof Error ? error.message : "Failed to start crawl"
      );
      setStep("input");
    }
  };

  const handleImport = async () => {
    if (selectedResourceIds.size === 0 || !jobId) return;

    setStep("importing");
    setImportProgress({
      current: 0,
      total: selectedResourceIds.size,
      successful: 0,
      failed: 0,
    });

    try {
      const result = await addSelectedResources({
        jobId,
        selectedResourceIds: Array.from(
          selectedResourceIds
        ) as Id<"crawlResults">[],
      });

      setImportProgress({
        current: result.results.length,
        total: selectedResourceIds.size,
        successful: result.successful,
        failed: result.failed,
      });

      setStep("complete");
      if (result.failed === 0) {
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setCrawlError(
        error instanceof Error ? error.message : "Failed to import resources"
      );
      setStep("results");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("input");
      setUrl("");
      setMaxDepth("1");
      setIncludeImages(true);
      setIncludePdfs(true);
      setIncludeText(true);
      setCrawlError(null);
      setJobId(null);
      setSelectedResourceIds(new Set());
      setImportProgress({ current: 0, total: 0, successful: 0, failed: 0 });
    }, 1000);
  };

  const toggleResource = (resourceId: string) => {
    const newSelected = new Set(selectedResourceIds);
    if (newSelected.has(resourceId)) {
      newSelected.delete(resourceId);
    } else {
      newSelected.add(resourceId);
    }
    setSelectedResourceIds(newSelected);
  };

  const toggleSelectAll = (filteredResults: typeof results = []) => {
    const filteredIds = new Set(filteredResults.map((r) => r._id));
    const allFilteredSelected = filteredResults.every((r) =>
      selectedResourceIds.has(r._id)
    );

    if (allFilteredSelected) {
      setSelectedResourceIds((prev) => {
        const newSet = new Set(prev);
        filteredIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
    } else {
      setSelectedResourceIds((prev) => {
        const newSet = new Set(prev);
        filteredIds.forEach((id) => newSet.add(id));
        return newSet;
      });
    }
  };

  const selectByType = (type: "text" | "image" | "pdf") => {
    if (!results) return;
    const resourcesOfType = results.filter((r) => r.type === type);
    setSelectedResourceIds(new Set(resourcesOfType.map((r) => r._id)));
  };

  const getDialogTitle = () => {
    switch (step) {
      case "complete":
        return "Import Complete";
      default:
        return "Crawl Website";
    }
  };

  const getDialogDescription = () => {
    switch (step) {
      case "input":
        return "Extract content from websites to add to your knowledge base";
      case "crawling":
        return "Discovering resources on the website...";
      case "results":
        return "Select resources to import";
      case "importing":
        return "Importing selected resources...";
      case "complete":
        return "Resources imported successfully";
      default:
        return "";
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="min-w-2xl min-h-fit max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GlobeIcon className="size-5" />
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <CrawlInputStep
            url={url}
            maxDepth={maxDepth}
            includeImages={includeImages}
            includePdfs={includePdfs}
            includeText={includeText}
            crawlError={crawlError}
            onUrlChange={setUrl}
            onMaxDepthChange={setMaxDepth}
            onIncludeImagesChange={setIncludeImages}
            onIncludePdfsChange={setIncludePdfs}
            onIncludeTextChange={setIncludeText}
            onSubmit={handleStartCrawl}
          />
        )}

        {step === "crawling" && (
          <CrawlProgressStep pagesVisited={job?.pagesVisited} />
        )}

        {step === "results" && results && (
          <ResultsSelectionStep
            results={results}
            selectedResourceIds={selectedResourceIds}
            onToggleResource={toggleResource}
            onToggleSelectAll={toggleSelectAll}
            onSelectByType={selectByType}
          />
        )}

        {step === "importing" && (
          <ImportProgressStep
            current={importProgress.current}
            total={importProgress.total}
          />
        )}

        {step === "complete" && (
          <CompleteStep
            successful={importProgress.successful}
            failed={importProgress.failed}
          />
        )}

        <DialogFooter>
          {step === "input" && (
            <>
              <Button onClick={handleClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleStartCrawl}
                disabled={!url || url.trim() === ""}
              >
                <GlobeIcon className="size-4 mr-2" />
                Start Crawling
              </Button>
            </>
          )}

          {step === "results" && (
            <>
              <Button onClick={handleClose} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={selectedResourceIds.size === 0}
              >
                Import {selectedResourceIds.size} Resource
                {selectedResourceIds.size !== 1 && "s"}
              </Button>
            </>
          )}

          {step === "complete" && (
            <Button onClick={handleClose}>
              <CheckCircleIcon className="size-4 mr-2" />
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
