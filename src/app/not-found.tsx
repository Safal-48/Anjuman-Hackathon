import Link from "next/link";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <Container size="md" className="py-24 flex items-center justify-center min-h-[70vh]">
      <EmptyState
        icon={Compass}
        title="404: Node Coordinates Unresolved"
        description="The requested routing sector or resource does not exist in the TECH-TITAN cluster."
        action={
          <Link href="/">
            <Button variant="glow" leftIcon={<Home className="h-4 w-4" />}>
              Return to Command Center
            </Button>
          </Link>
        }
        className="w-full max-w-lg"
      />
    </Container>
  );
}
