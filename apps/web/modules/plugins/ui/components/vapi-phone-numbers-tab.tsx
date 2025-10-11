"use client";

import { toast } from "sonner";
import { useVapiPhoneNumbers } from "../../hooks/use-vapi-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { CheckCircle, Copy, Phone, XCircle } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

export const VapiPhoneNumbersTab = () => {
  const { data: phoneNumbers, isLoading } = useVapiPhoneNumbers();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to Clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="border-t bg-background ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Phone Number</TableHead>
            <TableHead className="px-6 py-4">Name</TableHead>
            <TableHead className="px-6 py-4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Loading Phone Numbers...
                  </TableCell>
                </TableRow>
              );
            }
            if (phoneNumbers.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No Phone Number Configured
                  </TableCell>
                </TableRow>
              );
            }

            return phoneNumbers.map((phone) => (
              <TableRow className="hover:bg-muted/50" key={phone.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Phone className="size-4 text-muted-foreground" />
                    <span className="font-mono">
                      {phone.number || "Not Configured"}
                    </span>
                    {phone.number && (
                      <button
                        onClick={() => copyToClipboard(phone.number!)}
                        className="ml-2 p-1 hover:bg-muted rounded"
                        title="Copy to clipboard"
                      >
                        <Copy className="size-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {phone.name || "Unnamed"}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    className="capitalize"
                    variant={
                      phone.status === "active" ? "default" : "destructive"
                    }
                  >
                    {phone.status === "active" && (
                      <CheckCircle className="mr-1 size-3" />
                    )}
                    {phone.status !== "active" && (
                      <XCircle className="mr-1 size-3" />
                    )}
                    {phone.status || "Unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
};
