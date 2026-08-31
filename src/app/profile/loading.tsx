import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <Container size="xl" className="py-10 space-y-8">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </Container>
  );
}
