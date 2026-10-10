"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { MonthlyRevenueData } from "@/lib/services/dashboard";

interface RevenueChartProps {
  data: MonthlyRevenueData[];
}

const emptySubscribe = () => () => {};

export function DashboardRevenueChart({ data }: RevenueChartProps) {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  const totalInPeriod = data.reduce((acc, curr) => acc + curr.revenue, 0);

  if (!mounted) {
    return (
      <div className="glass-panel p-6 rounded-2xl h-[360px] flex items-center justify-center animate-pulse">
        <span className="text-xs text-muted-foreground">Loading Revenue Analytics...</span>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-foreground">Revenue Analytics</h3>
            {totalInPeriod > 0 ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" /> Live Cashflow
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                Awaiting First Payment
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalInPeriod > 0 ? (
              <>
                Total revenue collected over the past 6 months:{" "}
                <strong className="text-foreground font-semibold">
                  ${totalInPeriod.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </strong>
              </>
            ) : (
              "No paid invoices in the past 6 months yet. Settle an invoice to track revenue growth."
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 bg-card/60 text-xs font-medium text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" /> Last 6 Months
          </div>
        </div>
      </div>

      <div className="h-[260px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, (dataMax: number) => (dataMax <= 0 ? 1000 : Math.ceil(dataMax * 1.25))]}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => (value === 0 ? "$0" : `$${value >= 1000 ? `${Math.round(value / 1000)}k` : value}`)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as MonthlyRevenueData;
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-border shadow-xl text-xs space-y-1">
                      <p className="font-semibold text-foreground">{item.month} 2026</p>
                      <p className="text-primary font-bold">
                        Revenue: ${item.revenue.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.invoices} invoices settled
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
