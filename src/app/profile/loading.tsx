import { ParticleLoader } from "@/components/ui/particle-loader";
import { Container } from "@/components/layout/container";

export default function ProfileLoading() {
  return (
    <Container size="xl" className="py-20 flex items-center justify-center min-h-[70vh]">
      <ParticleLoader
        title="Synthesizing Student Profile"
        subtitle="Retrieving verified cryptographic credentials, skill radar & portfolio..."
        size={220}
      />
    </Container>
  );
}
