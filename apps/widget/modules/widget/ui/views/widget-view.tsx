"use client";

interface Props {
  organisationId: string;
}

export const WidgetView = ({ organisationId }: Props) => {
  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      Widget View
    </main>
  );
};
