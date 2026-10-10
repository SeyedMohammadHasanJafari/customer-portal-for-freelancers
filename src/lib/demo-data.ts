export interface MockTask {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
}

export interface MockInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  dueDate: Date;
  paidAt?: Date | null;
  client: { companyName: string };
}

export interface MockProject {
  id: string;
  title: string;
  description: string;
  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  budget: number;
  currency: string;
  timeline: string;
  client: { companyName: string };
  tasks: MockTask[];
}

export const MOCK_DEMO_CLIENTS = [
  { id: "c1", companyName: "Apex Tech Labs", notes: "Enterprise AI and Cloud Analytics platform." },
  { id: "c2", companyName: "Vanguard Creative Studios", notes: "Global boutique creative and production studio." },
  { id: "c3", companyName: "Solaria Wellness Co.", notes: "Direct-to-consumer organic wellness brand." },
];

export const MOCK_DEMO_PROJECTS: MockProject[] = [
  {
    id: "p1",
    title: "Enterprise Design System & Component Library",
    description: "Comprehensive token-based design system and Figma UI library built with Tailwind CSS.",
    status: "IN_PROGRESS",
    budget: 8500,
    currency: "USD",
    timeline: "4 Weeks remaining",
    client: { companyName: "Apex Tech Labs" },
    tasks: [
      { id: "t1", title: "Define Color Tokens & Typography scales", status: "DONE" },
      { id: "t2", title: "Build Core Button, Input & Dialog components", status: "DONE" },
      { id: "t3", title: "Implement Data Table with sorting and filters", status: "IN_PROGRESS" },
      { id: "t4", title: "Accessibility (WCAG 2.1 AAA) audit & documentation", status: "TODO" },
    ],
  },
  {
    id: "p2",
    title: "Vanguard Studios Portfolio & Video Showcase",
    description: "Award-winning portfolio site featuring fluid WebGL transitions and Vimeo Pro integrations.",
    status: "COMPLETED",
    budget: 12000,
    currency: "USD",
    timeline: "Completed",
    client: { companyName: "Vanguard Creative Studios" },
    tasks: [
      { id: "t5", title: "Interactive wireframes and moodboard presentation", status: "DONE" },
      { id: "t6", title: "WebGL Shader background and audio-reactive cursor", status: "DONE" },
      { id: "t7", title: "Performance optimization for mobile devices", status: "DONE" },
    ],
  },
  {
    id: "p3",
    title: "Solaria DTC E-Commerce Redesign & Checkout",
    description: "Shopify headless storefront architecture with customized subscriptions and bundle builder.",
    status: "IN_PROGRESS",
    budget: 9600,
    currency: "USD",
    timeline: "2 Weeks remaining",
    client: { companyName: "Solaria Wellness Co." },
    tasks: [
      { id: "t8", title: "Cart drawer and instant upsell modals", status: "DONE" },
      { id: "t9", title: "Stripe subscription billing integration", status: "IN_PROGRESS" },
      { id: "t10", title: "End-to-end checkout flow testing", status: "TODO" },
    ],
  },
  {
    id: "p4",
    title: "Mobile App Native UI (iOS / Android)",
    description: "React Native prototype with biometrics authentication and offline synchronization.",
    status: "PLANNING",
    budget: 6500,
    currency: "USD",
    timeline: "Starting next month",
    client: { companyName: "Apex Tech Labs" },
    tasks: [
      { id: "t11", title: "Specification document & API contract review", status: "IN_PROGRESS" },
      { id: "t12", title: "UI Mockups for Onboarding & Security settings", status: "TODO" },
    ],
  },
];

export const MOCK_DEMO_INVOICES: MockInvoice[] = [
  {
    id: "inv1",
    invoiceNumber: "INV-2026-001",
    amount: 4250,
    currency: "USD",
    status: "PAID",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    client: { companyName: "Apex Tech Labs" },
  },
  {
    id: "inv2",
    invoiceNumber: "INV-2026-002",
    amount: 4250,
    currency: "USD",
    status: "PENDING",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    client: { companyName: "Apex Tech Labs" },
  },
  {
    id: "inv3",
    invoiceNumber: "INV-2026-003",
    amount: 12000,
    currency: "USD",
    status: "PAID",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28),
    client: { companyName: "Vanguard Creative Studios" },
  },
  {
    id: "inv4",
    invoiceNumber: "INV-2026-004",
    amount: 4800,
    currency: "USD",
    status: "PAID",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
    client: { companyName: "Solaria Wellness Co." },
  },
  {
    id: "inv5",
    invoiceNumber: "INV-2026-005",
    amount: 4800,
    currency: "USD",
    status: "OVERDUE",
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    client: { companyName: "Solaria Wellness Co." },
  },
  {
    id: "inv6",
    invoiceNumber: "INV-2026-006",
    amount: 3250,
    currency: "USD",
    status: "PENDING",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    client: { companyName: "Apex Tech Labs" },
  },
];
