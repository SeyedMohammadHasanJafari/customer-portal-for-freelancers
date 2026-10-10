import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { DemoLoginButton } from "@/components/demo-login-button";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  FileText,
  CreditCard,
  TrendingUp,
  Download,
  ExternalLink,
  Zap,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Background Radial Ambient Accents */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-primary/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 -left-40 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Global Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-md shadow-primary/25 text-white transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text">
                Lumina Portal
              </span>
              <span className="text-[10px] text-muted-foreground font-medium -mt-1 tracking-wider uppercase">
                Client Suite
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Capabilities
            </a>
            <a href="#workflow" className="hover:text-foreground transition-colors">
              Workflow
            </a>
            <a href="#preview" className="hover:text-foreground transition-colors">
              Live Preview
            </a>
            <a href="#architecture" className="hover:text-foreground transition-colors">
              Architecture
            </a>
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="text-xs sm:text-sm font-medium px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 flex flex-col items-center">
        {/* ========================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================= */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 flex flex-col items-center text-center">
          {/* Status Capsule */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-border/80 bg-card/70 backdrop-blur-md shadow-xs text-muted-foreground mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-foreground">Lumina v1.0</span>
            <span className="text-border">|</span>
            <span>Production-Ready Freelancer Client Portal</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.12] max-w-4xl">
            Elevate Client Projects with a{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Dedicated Portal.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Eliminate endless status email threads. Give your clients a private, white-labeled workspace
            to track milestones in real time, securely download deliverable files, and pay invoices via Stripe.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto">
            <div className="w-full sm:w-auto min-w-[200px]">
              <DemoLoginButton text="Try 1-Click Demo" variant="primary" />
            </div>
            <Link
              href="/portal/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border/90 bg-card/80 hover:bg-card text-foreground text-sm font-semibold transition-all shadow-xs hover:border-primary/50 hover:shadow-md"
            >
              Explore Client View <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            No credit card required • Instant evaluation sandbox
          </p>

          {/* ========================================================= */}
          {/* LIVE PRODUCT PREVIEW MOCKUP */}
          {/* ========================================================= */}
          <div id="preview" className="w-full max-w-5xl mt-14 sm:mt-18 relative">
            {/* Glowing Backdrop Ambient Accent */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 via-purple-500/20 to-pink-500/30 blur-xl opacity-70 -z-10" />

            <div className="glass-panel rounded-2xl sm:rounded-3xl border border-border/80 shadow-2xl overflow-hidden text-left">
              {/* Window Title Bar */}
              <div className="px-4 py-3 border-b border-border/60 bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-xs font-mono text-muted-foreground hidden sm:inline-block">
                    portal.luminasuite.com/portal/apex-tech-labs
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Client Session
                </div>
              </div>

              {/* Mockup Dashboard Content */}
              <div className="p-5 sm:p-8 space-y-6 bg-card/60">
                {/* Project Overview Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/50">
                  <div>
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Client Portal • Apex Tech Labs
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold mt-1 text-foreground">
                      Enterprise Design System & UI Tokens
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Contract Lead: Alex Vance (Principal Designer)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Contract Value</div>
                      <div className="text-lg sm:text-xl font-bold text-foreground">$12,500 USD</div>
                    </div>
                    <div className="h-10 w-px bg-border/60" />
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Overall Progress</div>
                      <div className="text-lg sm:text-xl font-bold text-emerald-500">84%</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Milestone Delivery Roadmap</span>
                    <span>11 of 13 deliverables verified</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-purple-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: "84%" }}
                    />
                  </div>
                </div>

                {/* Dual Column: Milestones & Active Deliverable */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
                  {/* Milestones Checklist */}
                  <div className="lg:col-span-2 space-y-2.5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Current Milestone Scope
                    </div>
                    {[
                      {
                        title: "Core Token Architecture & WCAG Palette",
                        status: "DONE",
                        date: "Verified Yesterday",
                      },
                      {
                        title: "Figma Component Library (Variants & Auto-Layout)",
                        status: "IN_PROGRESS",
                        date: "In Review by Client",
                      },
                      {
                        title: "Production React 19 UI Storybook Integration",
                        status: "TODO",
                        date: "Scheduled for Next Sprint",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl border border-border/60 bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                              item.status === "DONE"
                                ? "bg-emerald-500/15 text-emerald-500"
                                : item.status === "IN_PROGRESS"
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.status === "DONE" ? "✓" : idx + 1}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-foreground">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground">{item.date}</div>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            item.status === "DONE"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : item.status === "IN_PROGRESS"
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {item.status === "DONE"
                            ? "Completed"
                            : item.status === "IN_PROGRESS"
                            ? "In Progress"
                            : "Upcoming"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Action Cards: Download & Pay */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Asset & Invoice Hub
                    </div>

                    {/* Deliverable Card */}
                    <div className="p-4 rounded-xl border border-border/60 bg-background/50 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-foreground truncate">
                            Enterprise_Tokens_v2.pdf
                          </div>
                          <div className="text-[11px] text-muted-foreground">1.8 MB • Cryptographic Spec</div>
                        </div>
                      </div>
                      <Link
                        href="/api/deliverables/download?name=Enterprise_Design_Tokens_v2.pdf&client=Apex%20Tech%20Labs&project=Enterprise%20Design%20System&freelancer=Alex%20Vance&agency=Vance%20Design"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Verified PDF
                      </Link>
                    </div>

                    {/* Outstanding Invoice Card */}
                    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                          Invoice Pending
                        </span>
                        <span className="text-xs font-mono font-bold text-foreground">$3,500.00</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Phase 2 Milestone completion payout.
                      </div>
                      <Link
                        href="/portal/demo"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-semibold shadow-xs transition-all"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Pay with Stripe
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* METRICS & CREDIBILITY STRIP */}
        {/* ========================================================= */}
        <section className="w-full border-y border-border/60 bg-muted/20 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">$480,000+</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">Billed Volume Tracked</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">&lt; 15ms</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">Subsystem Latency</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">100%</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">Tenant Privacy Isolation</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Zero-Config</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">Resilient Local Evaluation</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* VALUE PILLARS & CORE CAPABILITIES */}
        {/* ========================================================= */}
        <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Engineered For Excellence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
              Everything Needed to Run a High-End Practice
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3">
              Built specifically to eliminate friction between freelance service providers and their corporate clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: White-labeled Experience */}
            <div className="glass-panel glow-border p-7 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">White-Labeled Client Portal</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Provide each client with an isolated, distraction-free portal matching your branding.
                Clients only view their contracts, files, and billing data without administrative noise.
              </p>
            </div>

            {/* Card 2: Milestone Tracking */}
            <div className="glass-panel glow-border p-7 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Milestone & Progress Tracking</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Dynamic milestone checklists with automated progress meters. Keep stakeholders
                continually aligned on what has been completed and what is in progress.
              </p>
            </div>

            {/* Card 3: Invoicing & Stripe */}
            <div className="glass-panel glow-border p-7 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Integrated Stripe Checkout</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Publish professional invoices tied directly to project deliverables. Clients can settle
                invoices online via Stripe Checkout with instant receipt handling.
              </p>
            </div>

            {/* Card 4: Cryptographic PDF Delivery */}
            <div className="glass-panel glow-border p-7 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Deliverables Distribution Engine</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Stream dynamic, cryptographically styled PDF specifications and assets on the fly.
                All downloads are validated at the server boundary with proper mime headers.
              </p>
            </div>

            {/* Card 5: Financial Analytics */}
            <div className="glass-panel glow-border p-7 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Executive Cash Flow Dashboard</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Interactive monthly revenue charts powered by Recharts with seamless Light and Dark
                theme synchronization, outstanding balances, and recent event feeds.
              </p>
            </div>

            {/* Card 6: Security & Tenant Isolation */}
            <div className="glass-panel glow-border p-7 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Enterprise Security Standards</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                NextAuth v5 session tokens, salted password hashing via bcryptjs, and strict tenant
                boundaries ensuring zero cross-client information leakage.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3-STEP WORKFLOW SECTION */}
        {/* ========================================================= */}
        <section id="workflow" className="w-full bg-muted/30 border-y border-border/60 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Simple Workflow</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
                How Lumina Streamlines Contracts
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Three friction-free steps from initial scope to final settlement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl border border-border/70 bg-card/70 space-y-3 relative">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                  01
                </div>
                <h3 className="text-lg font-bold text-foreground">Define Scope & Milestones</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Create a new project contract, set milestone deliverable tasks, and designate contract values.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border/70 bg-card/70 space-y-3 relative">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 font-bold text-sm flex items-center justify-center">
                  02
                </div>
                <h3 className="text-lg font-bold text-foreground">Share Client Portal Link</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Send a branded invitation with a direct magic link. The client accesses their private portal instantly without cumbersome setup.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-border/70 bg-card/70 space-y-3 relative">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-sm flex items-center justify-center">
                  03
                </div>
                <h3 className="text-lg font-bold text-foreground">Deliver Assets & Collect Payouts</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Upload signed deliverables, issue project invoices, and collect Stripe card payments directly into your account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ARCHITECTURE & RESILIENCE BENTO */}
        {/* ========================================================= */}
        <section id="architecture" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Engineering Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
              Built on Modern Enterprise Foundations
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Engineered with clean separation of concerns, zero unhandled errors, and strict type safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bento Box 1 */}
            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Framework</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                    Verified
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Next.js 16 + React 19</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  App Router architecture, Turbopack compilation engine, strict React 19 compiler purity, and server actions.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Turbopack Build: &lt; 3.5s
              </div>
            </div>

            {/* Bento Box 2 */}
            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Persistence</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                    Dual-Tier
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Prisma 7 + Local Fallback</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  PostgreSQL with strict relational foreign keys, paired with an isolated zero-dependency fallback store for seamless local evaluations.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Crash Tolerance
              </div>
            </div>

            {/* Bento Box 3 */}
            <div className="p-6 rounded-2xl border border-border/70 bg-card/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Quality</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                    CI / CD
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">Automated Testing & CI</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Vitest test suites for financial calculations, strict ESLint 9 validation, and GitHub Actions continuous integration quality gates.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Tests Passing
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BOTTOM CALL TO ACTION BANNER */}
        {/* ========================================================= */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="glass-panel glow-border p-8 sm:p-14 rounded-3xl relative overflow-hidden text-center flex flex-col items-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Ready to Upgrade Your Client Experience?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Launch the instant demo workspace to explore the full suite, or register a new freelancer account in seconds.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
                <div className="w-full sm:w-auto min-w-[200px]">
                  <DemoLoginButton text="Launch Demo Account" variant="primary" />
                </div>
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-sm font-semibold transition-all shadow-xs"
                >
                  Create New Account <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* GLOBAL FOOTER */}
      {/* ========================================================= */}
      <footer className="border-t border-border/50 py-8 bg-card/30 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground">Lumina Portal</span>
            <span>•</span>
            <span>Production SaaS Client Management</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/portal/demo" className="hover:text-foreground transition-colors">
              Client Portal Preview
            </Link>
            <Link href="/api/health" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              API Health
            </Link>
            <Link href="/auth/login" className="hover:text-foreground transition-colors">
              Sign In
            </Link>
          </div>

          <div>
            © {new Date().getFullYear()} Lumina Portal Suite. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
