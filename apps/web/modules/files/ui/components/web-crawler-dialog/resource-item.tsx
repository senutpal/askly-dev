"use client";

import {
  CheckCircleIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
} from "lucide-react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Id } from "@workspace/backend/_generated/dataModel";

interface Resource {
  _id: Id<"crawlResults">;
  url: string;
  type: "text" | "image" | "pdf";
  title: string;
  description?: string;
  size?: number;
  addedToKnowledgeBase: boolean;
}

interface ResourceItemProps {
  resource: Resource;
  isSelected: boolean;
  onToggle: () => void;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case "image":
      return <ImageIcon className="size-4" />;
    case "pdf":
      return <FileIcon className="size-4" />;
    case "text":
      return <FileTextIcon className="size-4" />;
    default:
      return <FileIcon className="size-4" />;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "Unknown";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};

export const ResourceItem = ({
  resource,
  isSelected,
  onToggle,
}: ResourceItemProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
        isSelected ? "bg-muted/50 border-primary" : "hover:bg-muted/30"
      )}
      onClick={onToggle}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          {getResourceIcon(resource.type)}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{resource.title}</p>
            {resource.description && (
              <p className="text-muted-foreground text-xs line-clamp-1 mt-0.5">
                {resource.description}
              </p>
            )}
          </div>
          <Badge className="uppercase" variant="outline">
            {resource.type}
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs truncate">{resource.url}</p>
        {resource.size && (
          <p className="text-muted-foreground text-xs mt-1">
            Size: {formatFileSize(resource.size)}
          </p>
        )}
        {resource.addedToKnowledgeBase && (
          <div className="flex items-center gap-1 mt-2">
            <CheckCircleIcon className="size-3 text-green-600" />
            <span className="text-xs text-green-600">
              Already in knowledge base
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
