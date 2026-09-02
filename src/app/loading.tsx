import { ParticleLoader } from "@/components/ui/particle-loader";
import { Container } from "@/components/layout/container";

export default function Loading() {
  return (
    <Container size="xl" className="py-20 flex items-center justify-center min-h-[70vh]">
      <ParticleLoader
        title="Skillora Intelligence Core"
        subtitle="Loading neural pipelines, adaptive models & verified skill telemetry..."
        size={240}
      />
    </Container>
  );
}
