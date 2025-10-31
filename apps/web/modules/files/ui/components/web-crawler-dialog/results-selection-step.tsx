"use client";

import { useState, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { ResourceItem } from "./resource-item";
import { Id } from "@workspace/backend/_generated/dataModel";

type ResourceType = "text" | "image" | "pdf" | "all";

interface Resource {
  _id: Id<"crawlResults">;
  _creationTime: number;
  jobId: Id<"crawlJobs">;
  url: string;
  type: "text" | "image" | "pdf";
  title: string;
  description?: string;
  size?: number;
  contentHash: string;
  selected: boolean;
  addedToKnowledgeBase: boolean;
  sourceUrl: string;
  error?: string;
}

interface ResultsSelectionStepProps {
  results: Resource[];
  selectedResourceIds: Set<string>;
  onToggleResource: (resourceId: string) => void;
  onToggleSelectAll: (filteredResults: Resource[]) => void;
  onSelectByType: (type: "text" | "image" | "pdf") => void;
}

export const ResultsSelectionStep = ({
  results,
  selectedResourceIds,
  onToggleResource,
  onToggleSelectAll,
  onSelectByType,
}: ResultsSelectionStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType>("all");

  const filteredResults = useMemo(() => {
    return results.filter((resource) => {
      const matchesType = typeFilter === "all" || resource.type === typeFilter;
      const matchesSearch =
        !searchQuery ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [results, searchQuery, typeFilter]);

  const getTypeCounts = () => {
    return {
      text: results.filter((r) => r.type === "text").length,
      image: results.filter((r) => r.type === "image").length,
      pdf: results.filter((r) => r.type === "pdf").length,
    };
  };

  const typeCounts = getTypeCounts();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as ResourceType)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="text">Text ({typeCounts.text})</SelectItem>
            <SelectItem value="image">Images ({typeCounts.image})</SelectItem>
            <SelectItem value="pdf">PDFs ({typeCounts.pdf})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between border-b pb-3">
        <p className="text-sm font-medium">
          Found {results.length} resource{results.length !== 1 && "s"}
          {searchQuery && ` (${filteredResults.length} matching)`}
        </p>
        <Button
  variant="ghost"
  size="sm"
  onClick={() => onToggleSelectAll(filteredResults)}
  disabled={filteredResults.length === 0}
>
  {filteredResults.every(r => selectedResourceIds.has(r._id))
    ? "Deselect All"
    : "Select All"}
</Button>
      </div>

      <ScrollArea className="h-[400px] rounded-lg border">
        <div className="space-y-2 p-4">
          {filteredResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No matching resources found"
                : "No resources found"}
            </div>
          ) : (
            filteredResults.map((resource) => (
              <ResourceItem
                key={resource._id}
                resource={resource}
                isSelected={selectedResourceIds.has(resource._id)}
                onToggle={() => onToggleResource(resource._id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <p className="text-muted-foreground text-xs">
        {selectedResourceIds.size} of {filteredResults.length} selected
      </p>

      <div className="flex items-center gap-2 pt-2 border-t">
        <span className="text-sm text-muted-foreground">Quick select:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectByType("text")}
        >
          All Text
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectByType("image")}
        >
          All Images
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectByType("pdf")}
        >
          All PDFs
        </Button>
      </div>
    </div>
  );
};
