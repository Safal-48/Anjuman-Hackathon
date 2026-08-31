import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container size="xl" className="py-12 space-y-8">
      {/* Top Banner Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48 rounded-full" />
        <Skeleton className="h-12 w-3/4 max-w-xl rounded-xl" />
        <Skeleton className="h-5 w-1/2 max-w-md" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </Container>
  );
}
