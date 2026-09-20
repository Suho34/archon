"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BrainCircuit,
  Check,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  Lock,
  RotateCcw,
  Scale,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScenarioOption {
  id: string;
  name: string;
  description: string;
  pros: string;
  cons: string;
  metrics: {
    latency: { score: number; label: string };
    cost: { score: number; label: string };
    simplicity: { score: number; label: string };
    scalability: { score: number; label: string };
  };
  confirmedSpec: {
    title: string;
    category: string;
    constraints: string;
  };
}

interface Scenario {
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  ambiguityFound: string;
  question: string;
  options: ScenarioOption[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "saas-data",
    title: "Multi-Tenant SaaS Data Tier",
    badge: "Data Architecture",
    icon: Database,
    prompt:
      "Target: 50,000 active tenants. Scale: Serverless Next.js API routes with unpredictable burst spikes. Budget: < $250/month.",
    ambiguityFound:
      "Unbounded connection pooling: Serverless cold starts will instantly saturate default PostgreSQL connection limits (100 conn max), causing HTTP 500 cascades.",
    question: "How should we isolate tenant data while managing connection pooling under serverless?",
    options: [
      {
        id: "opt-1",
        name: "PostgreSQL + PgBouncer with Transaction Pooling",
        description:
          "Relational schema with shared database, tenant_id row-level security (RLS), and dedicated PgBouncer pooler.",
        pros: "Full ACID guarantees, battle-tested migrations, lowest egress cost.",
        cons: "Requires connection-aware migrations and transaction pool limits.",
        metrics: {
          latency: { score: 92, label: "6ms P99" },
          cost: { score: 88, label: "$48/mo" },
          simplicity: { score: 85, label: "Low Ops" },
          scalability: { score: 90, label: "50k Tenants" },
        },
        confirmedSpec: {
          title: "Multi-Tenant PostgreSQL Data Tier with PgBouncer Pooling",
          category: "Data",
          constraints: "All queries must pass through PgBouncer on port 6543; tenant isolation enforced via Postgres RLS.",
        },
      },
      {
        id: "opt-2",
        name: "Serverless HTTP Postgres (Neon / Supabase)",
        description:
          "Stateless HTTP driver bypassing TCP handshakes entirely on edge lambdas.",
        pros: "Zero connection limit bottlenecks; auto-suspends on idle.",
        cons: "Higher per-request HTTP latency; vendor lock-in on serverless driver.",
        metrics: {
          latency: { score: 76, label: "24ms P99" },
          cost: { score: 94, label: "$25/mo" },
          simplicity: { score: 95, label: "Zero Config" },
          scalability: { score: 95, label: "100k Tenants" },
        },
        confirmedSpec: {
          title: "Serverless HTTP Connection Pool Architecture",
          category: "Infrastructure",
          constraints: "Database queries must execute over HTTP fetch adapter; idle compute timeout set to 5m.",
        },
      },
      {
        id: "opt-3",
        name: "NoSQL DynamoDB Single-Table Design",
        description:
          "Key-value document model with partition key as tenant ID and sort key as entity ID.",
        pros: "Predictable single-digit millisecond latency at any throughput scale.",
        cons: "Complex multi-table queries require secondary indexes; schema migrations painful.",
        metrics: {
          latency: { score: 98, label: "3ms P99" },
          cost: { score: 70, label: "$140/mo" },
          simplicity: { score: 55, label: "High Dev Friction" },
          scalability: { score: 99, label: "Unlimited" },
        },
        confirmedSpec: {
          title: "Single-Table DynamoDB Partition Isolation",
          category: "Architecture",
          constraints: "Cross-entity reporting requires async stream consumer into analytical replica.",
        },
      },
    ],
  },
  {
    id: "ai-pipeline",
    title: "Real-Time AI Ingestion & Cache",
    badge: "AI Architecture",
    icon: Sparkles,
    prompt:
      "Target: 200 req/sec semantic search & RAG pipeline. Latency SLA: < 400ms end-to-end. AI Stack: Gemma-4 + Gemini.",
    ambiguityFound:
      "Repetitive vector embeddings: Over 65% of user queries share semantic overlap, but no caching tier exists — wasting $1,800/mo in redundant inference calls.",
    question: "Where should semantic caching and vector indexing be positioned in the request pipeline?",
    options: [
      {
        id: "opt-4",
        name: "Redis Semantic Cache + pgvector in Primary DB",
        description:
          "In-memory cosine similarity cache for top 80% queries; fallback to pgvector inside Postgres.",
        pros: "Sub-15ms cached responses; unified backup with primary operational database.",
        cons: "pgvector HNSW index consumes significant RAM above 1M documents.",
        metrics: {
          latency: { score: 94, label: "18ms (Cache Hit)" },
          cost: { score: 92, label: "$65/mo" },
          simplicity: { score: 88, label: "Unified Stack" },
          scalability: { score: 85, label: "1M Vectors" },
        },
        confirmedSpec: {
          title: "Two-Tier Semantic Cache (Redis + pgvector)",
          category: "AI",
          constraints: "Similarity threshold set to 0.92; cache eviction policy volatile-lru with 24h TTL.",
        },
      },
      {
        id: "opt-5",
        name: "Dedicated Cloud Vector Engine (Pinecone / Qdrant)",
        description:
          "External managed vector database with automatic sharding and metadata filtering.",
        pros: "Infinite scaling without database RAM tuning; zero maintenance.",
        cons: "Additional network hop on cache misses; higher SaaS subscription cost.",
        metrics: {
          latency: { score: 82, label: "65ms P99" },
          cost: { score: 65, label: "$180/mo" },
          simplicity: { score: 92, label: "Managed" },
          scalability: { score: 98, label: "50M Vectors" },
        },
        confirmedSpec: {
          title: "Managed Dedicated Vector Index Architecture",
          category: "Infrastructure",
          constraints: "Network egress secured via PrivateLink VPC peering; batch ingestion capped at 500 vectors/chunk.",
        },
      },
    ],
  },
  {
    id: "auth-security",
    title: "Zero-Trust Session Architecture",
    badge: "Security Architecture",
    icon: Lock,
    prompt:
      "Target: High-security developer workspace. Requirement: Instant session revocation without database roundtrips on every API call.",
    ambiguityFound:
      "Session invalidation trap: Pure JWT tokens cannot be revoked before expiration, leaving security audit vulnerabilities if credentials leak.",
    question: "What session verification model satisfies sub-millisecond validation with instant revocation?",
    options: [
      {
        id: "opt-6",
        name: "Hybrid JWT + Redis Distributed Revocation Bloom Filter",
        description:
          "Short-lived stateless JWT (10 mins) paired with high-speed Redis revocation list checked in middleware.",
        pros: "Blazing fast verification (0.8ms) with true instant kill-switch capability.",
        cons: "Requires syncing Redis across multi-region deployments.",
        metrics: {
          latency: { score: 97, label: "0.8ms P99" },
          cost: { score: 90, label: "$30/mo" },
          simplicity: { score: 80, label: "Moderate" },
          scalability: { score: 96, label: "100k RPS" },
        },
        confirmedSpec: {
          title: "Hybrid JWT with Edge Bloom Filter Revocation",
          category: "Security",
          constraints: "JWT access token expiry must not exceed 600s; refresh tokens rotated on every renewal.",
        },
      },
      {
        id: "opt-7",
        name: "Database-Backed Stateful Sessions in Postgres",
        description:
          "Traditional cryptographic session ID verified against primary database on each request.",
        pros: "100% immediate consistency; zero extra infrastructure dependencies.",
        cons: "Adds read queries to primary DB on every authenticated endpoint.",
        metrics: {
          latency: { score: 72, label: "12ms P99" },
          cost: { score: 98, label: "$0 Extra" },
          simplicity: { score: 95, label: "Dead Simple" },
          scalability: { score: 75, label: "5k RPS" },
        },
        confirmedSpec: {
          title: "PostgreSQL Database-Backed Session Store",
          category: "Security",
          constraints: "Session table must be indexed on token hash with automatic cron purge of expired sessions.",
        },
      },
    ],
  },
];

export function InteractiveArchitectureWidget() {
  const [activeScenarioId, setActiveScenarioId] = useState("saas-data");
  const [selectedOptionId, setSelectedOptionId] = useState<string>("opt-1");
  const [isLocked, setIsLocked] = useState(false);

  const currentScenario =
    SCENARIOS.find((s) => s.id === activeScenarioId) ?? SCENARIOS[0];
  const selectedOption =
    currentScenario.options.find((o) => o.id === selectedOptionId) ??
    currentScenario.options[0];

  function handleScenarioChange(scenarioId: string) {
    setActiveScenarioId(scenarioId);
    const newScenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (newScenario && newScenario.options.length > 0) {
      setSelectedOptionId(newScenario.options[0].id);
    }
    setIsLocked(false);
  }

  function handleOptionSelect(optionId: string) {
    setSelectedOptionId(optionId);
    setIsLocked(false);
  }

  return (
    <section id="demo" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[#121215] px-3.5 py-1 text-xs font-mono font-semibold text-zinc-300 mb-3">
            <Cpu className="size-3.5 text-zinc-400" />
            Live Architecture Workbench
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
            See how Archon reasons. <br />
            <span className="text-zinc-400">Test real architectural trade-offs.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            Archon doesn&apos;t just produce static text — it identifies unstated assumptions, scores trade-offs across cost and latency, and locks decisions into confirmed requirements.
          </p>
        </div>

        {/* Workbench Shell */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#121215] shadow-2xl shadow-black/60 overflow-hidden">
          {/* Top Scenario Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-[#09090B] px-4 py-3 sm:px-6 gap-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-zinc-700" />
              <span className="size-2 rounded-full bg-zinc-700" />
              <span className="size-2 rounded-full bg-zinc-700" />
              <span className="ml-2 font-mono text-xs text-zinc-400 hidden sm:inline">
                archon-reasoning-engine: active
              </span>
            </div>

            {/* Scenario Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#121215] rounded-lg border border-white/[0.08]">
              {SCENARIOS.map((scenario) => {
                const Icon = scenario.icon;
                const isActive = scenario.id === activeScenarioId;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => handleScenarioChange(scenario.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-white text-zinc-950 font-semibold shadow-xs"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{scenario.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workbench Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
            {/* Left Column: Input Vision & Clarification Q&A (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              {/* Project Prompt */}
              <div className="rounded-xl border border-white/[0.08] bg-[#09090B] p-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Layers className="size-3.5 text-zinc-400" />
                    Project Vision & Constraints
                  </span>
                  <span className="rounded border border-white/[0.1] bg-zinc-900/80 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    {currentScenario.badge}
                  </span>
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  {currentScenario.prompt}
                </p>
              </div>

              {/* Ambiguity Alert */}
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 shrink-0 mt-0.5">
                    <AlertTriangle className="size-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono">
                      Architectural Gap Detected
                    </span>
                    <p className="mt-1 text-xs text-zinc-300 leading-relaxed font-mono">
                      {currentScenario.ambiguityFound}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clarification Question */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BrainCircuit className="size-4 text-zinc-300" />
                  <h3 className="text-sm font-semibold text-foreground">
                    {currentScenario.question}
                  </h3>
                </div>

                {/* Option Cards */}
                <div className="space-y-3">
                  {currentScenario.options.map((option) => {
                    const isSelected = option.id === selectedOption.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        className={`rounded-xl border p-4 cursor-pointer transition-all ${
                          isSelected
                            ? "border-white/30 bg-[#09090B] ring-1 ring-white/20"
                            : "border-white/[0.08] bg-[#09090B] hover:border-white/[0.18]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 size-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                              isSelected
                                ? "border-white bg-white text-zinc-950"
                                : "border-zinc-700 bg-zinc-900 text-transparent"
                            }`}
                          >
                            <Check className="size-2.5 stroke-[3]" />
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`text-xs sm:text-sm font-semibold transition ${
                                isSelected ? "text-foreground" : "text-zinc-300"
                              }`}
                            >
                              {option.name}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                              {option.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] text-zinc-400 font-mono">
                          <strong className="text-zinc-200">Trade-off:</strong> {option.pros}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Trade-Off Scorecard & Locked Spec (5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-[#09090B]/60 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Scale className="size-4 text-zinc-400" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                      Trade-Off Evaluation
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Real-time
                  </span>
                </div>

                <div className="mt-4 mb-6">
                  <span className="text-[10px] font-mono uppercase font-semibold text-zinc-500 tracking-wider">
                    Selected Architecture
                  </span>
                  <h4 className="text-sm font-bold text-foreground mt-0.5">
                    {selectedOption.name}
                  </h4>
                </div>

                {/* Score Meters */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-300 font-medium flex items-center gap-1.5 font-mono text-[11px]">
                        <Zap className="size-3 text-zinc-400" />
                        P99 Query Latency
                      </span>
                      <span className="font-mono font-semibold text-foreground">
                        {selectedOption.metrics.latency.label}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${selectedOption.metrics.latency.score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-300 font-medium flex items-center gap-1.5 font-mono text-[11px]">
                        <Server className="size-3 text-zinc-400" />
                        Estimated Monthly Cost
                      </span>
                      <span className="font-mono font-semibold text-foreground">
                        {selectedOption.metrics.cost.label}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${selectedOption.metrics.cost.score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-300 font-medium flex items-center gap-1.5 font-mono text-[11px]">
                        <Cpu className="size-3 text-zinc-400" />
                        Operational Overhead
                      </span>
                      <span className="font-mono font-semibold text-foreground">
                        {selectedOption.metrics.simplicity.label}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${selectedOption.metrics.simplicity.score}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-300 font-medium flex items-center gap-1.5 font-mono text-[11px]">
                        <Layers className="size-3 text-zinc-400" />
                        Scaling Ceiling
                      </span>
                      <span className="font-mono font-semibold text-foreground">
                        {selectedOption.metrics.scalability.label}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${selectedOption.metrics.scalability.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement Conversion / Confirmation Drawer */}
              <div className="mt-6 pt-6 border-t border-white/[0.08] space-y-3">
                {isLocked ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="size-4" />
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider">
                        Locked into Confirmed Specification
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-foreground">
                      {selectedOption.confirmedSpec.title}
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      Constraint: {selectedOption.confirmedSpec.constraints}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/[0.08] bg-[#09090B] p-4">
                    <span className="text-[10px] font-mono font-semibold uppercase text-zinc-400 block mb-1">
                      Ready to Convert
                    </span>
                    <p className="text-xs text-zinc-400 font-mono">
                      Locking this decision stores it as a confirmed specification in your Archon workspace with enforced constraints.
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => setIsLocked(!isLocked)}
                  variant={isLocked ? "outline" : "default"}
                  className="w-full rounded-md text-xs font-semibold h-10 transition cursor-pointer"
                >
                  {isLocked ? (
                    <>
                      <RotateCcw className="size-3.5 mr-1.5" />
                      Modify Decision
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5 mr-1.5" />
                      Lock Decision into Specification
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
