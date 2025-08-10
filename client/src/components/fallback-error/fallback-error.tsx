import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FallbackErrorProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  isError?: boolean;
  className?: string;
  onRetry?: () => void;
}

export function FallbackError({
  title = "Whoops, Something went wrong",
  description = "There was a problem processing the request. please try again later.",
  onRetry,
  isError = true,
  className,
  children,
}: FallbackErrorProps) {
  if (!isError && children) {
    return <>{children}</>;
  }

  return (
    <Card className={cn("w-full border-red-300", className)}>
      <CardHeader className="flex flex-col justify-center items-center gap-3">
        <AlertTriangle className="size-10 text-red-500" />
        <CardTitle className="text-red-600 text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-muted-foreground text-center">
          {description}
        </p>
        {onRetry && (
          <Button variant="destructive" className="mt-4" onClick={onRetry}>
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
