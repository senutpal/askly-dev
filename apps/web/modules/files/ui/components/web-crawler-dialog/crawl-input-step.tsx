"use client";

import { AlertCircleIcon } from "lucide-react";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

interface CrawlInputStepProps {
  url: string;
  maxDepth: string;
  includeImages: boolean;
  includePdfs: boolean;
  includeText: boolean;
  crawlError: string | null;
  onUrlChange: (url: string) => void;
  onMaxDepthChange: (depth: string) => void;
  onIncludeImagesChange: (include: boolean) => void;
  onIncludePdfsChange: (include: boolean) => void;
  onIncludeTextChange: (include: boolean) => void;
  onSubmit: () => void;
}

export const CrawlInputStep = ({
  url,
  maxDepth,
  includeImages,
  includePdfs,
  includeText,
  crawlError,
  onUrlChange,
  onMaxDepthChange,
  onIncludeImagesChange,
  onIncludePdfsChange,
  onIncludeTextChange,
  onSubmit,
}: CrawlInputStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          placeholder="https://example.com"
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxDepth">Crawl Depth</Label>
        <Select value={maxDepth} onValueChange={onMaxDepthChange}>
          <SelectTrigger id="maxDepth">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Current page only</SelectItem>
            <SelectItem value="1">1 level deep</SelectItem>
            <SelectItem value="2">2 levels deep</SelectItem>
            <SelectItem value="3">3 levels deep</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          How many levels of links to follow from the starting page
        </p>
      </div>

      <div className="space-y-3">
        <Label>Resources to Extract</Label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="includeText"
              checked={includeText}
              onCheckedChange={(checked) =>
                onIncludeTextChange(checked === true)
              }
            />
            <label
              htmlFor="includeText"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Page Content (Text)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="includeImages"
              checked={includeImages}
              onCheckedChange={(checked) =>
                onIncludeImagesChange(checked === true)
              }
            />
            <label
              htmlFor="includeImages"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Images
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="includePdfs"
              checked={includePdfs}
              onCheckedChange={(checked) =>
                onIncludePdfsChange(checked === true)
              }
            />
            <label
              htmlFor="includePdfs"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              PDF Documents
            </label>
          </div>
        </div>
      </div>

      {crawlError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-3 flex items-start gap-2">
          <AlertCircleIcon className="size-5 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-destructive text-sm">{crawlError}</p>
        </div>
      )}
    </div>
  );
};
