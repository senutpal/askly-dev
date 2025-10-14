"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  MessageSquare,
  FileText,
  Palette,
  Code,
  Phone,
  ArrowRight,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function Page() {
  const conversations = useQuery(api.private.conversations.getMany, {
    paginationOpts: { numItems: 100, cursor: null },
  });
  const files = useQuery(api.private.files.list, {
    paginationOpts: { numItems: 3, cursor: null },
  });
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);

  const isLoading =
    conversations === undefined ||
    files === undefined ||
    vapiPlugin === undefined ||
    widgetSettings === undefined;

  const conversationStats = conversations?.page.reduce(
    (acc, conv) => {
      if (conv.status === "resolved") acc.resolved++;
      else if (conv.status === "escalated") acc.escalated++;
      else acc.active++;
      return acc;
    },
    { active: 0, resolved: 0, escalated: 0 }
  ) || { active: 0, resolved: 0, escalated: 0 };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage your campus support assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <OrganizationSwitcher hidePersonal={true} />
          </div>
        </header>

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <StatCard
                icon={MessageSquare}
                label="Active Conversations"
                value={conversationStats.active}
                variant="default"
              />
              <StatCard
                icon={CheckCircle2}
                label="Resolved"
                value={conversationStats.resolved}
                variant="success"
              />
              <StatCard
                icon={AlertCircle}
                label="Escalated"
                value={conversationStats.escalated}
                variant="warning"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="overflow-hidden !gap-0 !py-0">
                <div className="border-b bg-background px-4 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="size-5 text-primary" />
                      <h2 className="font-semibold">Recent Conversations</h2>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/conversations">
                        View All
                        <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-0">
                  {conversations?.page.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageSquare className="mb-2 size-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No conversations yet
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {conversations?.page.slice(0, 5).map((conv) => (
                        <Link
                          href={`/conversations/${conv._id}`}
                          key={conv._id}
                          className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <Users className="size-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {conv.contactSession.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(conv._creationTime)}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={conv.status} />
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden !gap-0 !py-0">
                <div className="border-b bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="size-5 text-primary" />
                      <h2 className="font-semibold">Knowledge Base</h2>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/files">
                        Manage Files <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Total documents uploaded
                    </p>
                    <Badge variant="secondary">
                      {files?.page.length || 0} files
                    </Badge>
                  </div>
                  {files?.page.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="mb-2 size-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        No files uploaded yet
                      </p>

                      <Button
                        asChild
                        className="mt-4"
                        size="sm"
                        variant="outline"
                      >
                        <Link href="/files">Upload Files</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {files?.page.slice(0, 3).map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between rounded-lg border bg-background p-3"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {file.name}
                            </span>
                          </div>
                          <Badge className="uppercase" variant="outline">
                            {file.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden lg:col-span-2 !gap-0 !py-0">
                <div className="border-b bg-background p-4">
                  <h2 className="font-semibold">Quick Actions</h2>
                </div>
                <CardContent className="p-4">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <ActionCard
                      icon={Palette}
                      title="Widget Customization"
                      description="Customize chat appearance"
                      href="/customization"
                      status={widgetSettings ? "configured" : "pending"}
                    />
                    <ActionCard
                      icon={Code}
                      title="Integrations"
                      description="Setup website integration"
                      href="/integrations"
                      status="ready"
                    />
                    <ActionCard
                      icon={Phone}
                      title="Voice Assistant"
                      description="Configure Vapi plugin"
                      href="/vapi"
                      status={vapiPlugin ? "connected" : "disconnected"}
                    />
                    <ActionCard
                      icon={FileText}
                      title="Knowledge Base"
                      description="Upload documents"
                      href="/files"
                      status="ready"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
const StatCard = ({
  icon: Icon,
  label,
  value,
  variant = "default",
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  variant?: "default" | "success" | "warning";
}) => {
  const variantStyles = {
    default: "bg-blue-500/10 text-blue-500",
    success: "bg-green-500/10 text-green-500",
    warning: "bg-amber-500/10 text-amber-500",
  };

  return (
    <Card className="!py-0">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
          <div
            className={`rounded-full p-3 hidden md:block ${variantStyles[variant]}`}
          >
            <Icon className="size-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({
  status,
}: {
  status: "unresolved" | "resolved" | "escalated";
}) => {
  const statusConfig = {
    unresolved: {
      label: "Active",
      variant: "default" as const,
    },
    resolved: {
      label: "Resolved",
      variant: "secondary" as const,
    },
    escalated: {
      label: "Escalated",
      variant: "destructive" as const,
    },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Action Card Component
const ActionCard = ({
  icon: Icon,
  title,
  description,
  href,
  status,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  status: "configured" | "pending" | "ready" | "connected" | "disconnected";
}) => {
  const statusConfig = {
    configured: { color: "text-green-500", label: "Configured" },
    pending: { color: "text-amber-500", label: "Pending" },
    ready: { color: "text-blue-500", label: "Ready" },
    connected: { color: "text-green-500", label: "Connected" },
    disconnected: { color: "text-muted-foreground", label: "Not Connected" },
  };

  const config = statusConfig[status];

  return (
    <Link href={href}>
      <div className="group flex h-full flex-col rounded-lg border bg-background p-4 transition-all hover:border-primary hover:shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="size-5 text-primary" />
          </div>
          <div className={`text-xs font-medium ${config.color}`}>
            {config.label}
          </div>
        </div>
        <h3 className="mb-1 font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-auto pt-3">
          <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Configure →
          </span>
        </div>
      </div>
    </Link>
  );
};

// Loading Skeleton
const DashboardSkeleton = () => {
  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
