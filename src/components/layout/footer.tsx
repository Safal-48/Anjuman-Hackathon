import * as React from "react";
import Link from "next/link";
import { Mail, Phone, Instagram, ArrowUpRight, Sparkles, Activity } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Container } from "./container";
import { KaushalSetuLogo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-slate-950/90 backdrop-blur-2xl relative overflow-hidden text-sm">
      {/* Subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <Container size="xl" className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand & Mission Column (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <KaushalSetuLogo size="md" showTagline={false} />
            </Link>
            
            <div className="space-y-2">
              <p className="font-semibold text-foreground text-base tracking-tight">
                Bridging Skills with Opportunity.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                An intelligent ecosystem connecting students, academia and industry.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-emerald-400 font-semibold tracking-wider">ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

          {/* Col 1: PLATFORM SUITE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Intelligence Suite
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-mono">
              <li>
                <Link href="/career-coach" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>AI Career Coach</span>
                </Link>
              </li>
              <li>
                <Link href="/career-readiness" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>Career Readiness</span>
                </Link>
              </li>
              <li>
                <Link href="/mock-interview" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>AI Mock Interview</span>
                </Link>
              </li>
              <li>
                <Link href="/group-discussion" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>AI GD Roundtable</span>
                </Link>
              </li>
              <li>
                <Link href="/resume-analyzer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>Resume ATS Studio</span>
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>Skill Intelligence</span>
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>Opportunities</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/industry/candidate-intelligence" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span className="text-cyan-500/60">•</span>
                  <span>Recruiter Intel</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: ECOSYSTEM */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/#ecosystem-3d" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500/60">•</span>
                  <span>Students & Aspirants</span>
                </Link>
              </li>
              <li>
                <Link href="/#ecosystem-3d" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500/60">•</span>
                  <span>Colleges & Institutions</span>
                </Link>
              </li>
              <li>
                <Link href="/#ecosystem-3d" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500/60">•</span>
                  <span>Industry & Recruiters</span>
                </Link>
              </li>
              <li>
                <Link href="/#ecosystem-3d" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500/60">•</span>
                  <span>Academicians</span>
                </Link>
              </li>
              <li>
                <Link href="/#ecosystem-3d" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500/60">•</span>
                  <span>Mentorship</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: RESOURCES */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/#platform-highlights" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <span className="text-purple-500/60">•</span>
                  <span>How It Works</span>
                </Link>
              </li>
              <li>
                <Link href="/#overview" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <span className="text-purple-500/60">•</span>
                  <span>About KaushalSetu</span>
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <span className="text-purple-500/60">•</span>
                  <span>FAQs</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <span className="text-purple-500/60">•</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <span className="text-purple-500/60">•</span>
                  <span>Terms of Use</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: CONNECT WITH US (Direct Clickable Action Links) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Connect With Us
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {/* Email link (mailto) */}
              <li>
                <a
                  href="mailto:kaushalsetu.edu@gmail.com"
                  className="flex items-start gap-2.5 text-muted-foreground hover:text-cyan-400 transition-colors group"
                  title="Send an email to KaushalSetu"
                >
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <span className="break-all text-xs font-medium pt-1">
                    kaushalsetu.edu@gmail.com
                  </span>
                </a>
              </li>

              {/* Phone link (tel) */}
              <li>
                <a
                  href="tel:+919158470655"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-emerald-400 transition-colors group"
                  title="Call KaushalSetu"
                >
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-medium font-mono">
                    +91 91584 70655
                  </span>
                </a>
              </li>

              {/* Instagram link */}
              <li>
                <a
                  href="https://www.instagram.com/kaushal_setu?igsi=a2ZmajhtZmw1Mndh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-pink-400 transition-colors group"
                  title="Open KaushalSetu on Instagram"
                >
                  <div className="h-7 w-7 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0 group-hover:scale-110 transition-transform">
                    <Instagram className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-medium font-mono">
                    @kaushal_setu
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground/60 group-hover:text-pink-400 transition-colors" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="text-center sm:text-left">
            © 2026 <span className="text-foreground font-semibold">KaushalSetu</span>. Built to bridge the gap between skills and opportunity.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/#overview" className="hover:text-cyan-400 transition-colors">
              Back to Top ↑
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
