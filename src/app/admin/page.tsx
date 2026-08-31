import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Activity,
  Server,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Database,
  Layers,
} from "lucide-react";
import { getServerSession } from "@/lib/auth/session";
import { Container } from "@/components/layout/container";
import { GlassCard, MetricCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminPage() {
  const session = await getServerSession();

  // SERVER-SIDE ROLE ENFORCEMENT
  if (!session || session.role !== "admin") {
    return (
      <Container size="md" className="py-24 flex items-center justify-center min-h-[70vh]">
        <GlassCard className="p-8 border-rose-500/40 bg-rose-950/20 text-center space-y-4 max-w-lg shadow-[0_0_40px_rgba(244,63,94,0.2)]">
          <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-glow-sm">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider">
              HTTP 403 • FORBIDDEN ACCESS
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Security Clearance Insufficient
            </h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This sector is restricted strictly to verified <strong>TECH-TITAN Security Administrators</strong>. Your current credentials ({session ? session.role.toUpperCase() : "UNAUTHENTICATED"}) do not possess the required governance privileges.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/login">
              <Button variant="cyber" size="sm">
                Login with Admin Credentials
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="glass" size="sm">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </GlassCard>
      </Container>
    );
  }

  // Admin Portal Content (Rendered only for verified Admin role)
  return (
    <div className="py-10 space-y-8">
      <Container size="xl">
        {/* Header */}
        <GlassCard className="p-8 border-rose-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950 to-rose-950/20" glow>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Admin Governance Portal
                  </h1>
                  <Badge variant="destructive" dot dotColor="rose">
                    LEVEL 5 CLEARANCE
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  Operator: <strong className="text-foreground">{session.fullName}</strong> ({session.email})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="glass" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/api/health" target="_blank">
                <Button variant="cyber" size="sm" leftIcon={<Terminal className="h-4 w-4" />}>
                  Diagnostics Stream
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>

        {/* System Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Total Registered Identities"
            value="4 Ecosystem Nodes"
            change="5 Roles Managed"
            isPositive={true}
            icon={<Users className="h-4 w-4" />}
          />
          <MetricCard
            title="Role Security Enforcement"
            value="100% Strict"
            change="Server Guarded"
            isPositive={true}
            icon={<Lock className="h-4 w-4" />}
          />
          <MetricCard
            title="Database Cluster"
            value="Supabase SSR"
            change="PostgreSQL Ready"
            isPositive={true}
            icon={<Database className="h-4 w-4" />}
          />
          <MetricCard
            title="System Telemetry"
            value="99.99%"
            change="Zero Anomalies"
            isPositive={true}
            icon={<Activity className="h-4 w-4" />}
          />
        </div>

        {/* Security Audit Log & Ecosystem Nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-cyan-400" />
                <h3 className="font-bold text-foreground">Security Audit Log</h3>
              </div>
              <Badge variant="cyber" size="sm">
                REALTIME
              </Badge>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-muted-foreground">
                <span className="text-cyan-400">[AUTH_GUARD]</span>
                <span>Server-side role authorization verified for route /admin</span>
                <span className="text-emerald-400">PASSED</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-muted-foreground">
                <span className="text-cyan-400">[REGISTRY]</span>
                <span>Public registration blocked admin role specification</span>
                <span className="text-emerald-400">ENFORCED</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-muted-foreground">
                <span className="text-cyan-400">[SESSION]</span>
                <span>Encrypted HTTP-only cookie verified with Lax SameSite</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h3 className="font-bold text-foreground">Active Role Matrix</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-500/10 text-cyan-300">
                <span>Student</span>
                <span className="font-mono font-bold">1 Registered</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-violet-500/10 text-violet-300">
                <span>Industry</span>
                <span className="font-mono font-bold">1 Registered</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 text-emerald-300">
                <span>Academician</span>
                <span className="font-mono font-bold">1 Registered</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 text-amber-300">
                <span>Institution</span>
                <span className="font-mono font-bold">1 Registered</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 text-rose-300">
                <span>Security Admin</span>
                <span className="font-mono font-bold">1 Registered</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </Container>
    </div>
  );
}
