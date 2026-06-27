"use client"

import React, { useCallback, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Filter,
  HandCoins,
  Home,
  ListChecks,
  Plus,
  ReceiptText,
  Search,
  Settings,
  SlidersHorizontal,
  Tag,
  UserRound,
  Wallet,
  X,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const CARD_SHADOW =
  "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

const SECTION_MIN_H = "min-h-[calc(100vh-10.5rem)]"
const SPRING = { type: "spring" as const, stiffness: 400, damping: 32 }
const EASE_OUT = [0.16, 1, 0.3, 1] as const

const C = {
  teal: "oklch(0.78 0.16 182)",
  azure: "oklch(0.68 0.14 245)",
  amber: "oklch(0.76 0.14 75)",
  rose: "oklch(0.62 0.22 18)",
  slate: "oklch(0.50 0.02 260)",
  grid: "oklch(0.24 0.01 260)",
  tick: "oklch(0.50 0.015 260)",
}

const NAV_ITEMS = [
  { id: "resumen", label: "Resumen", icon: Home },
  { id: "registrar-gasto", label: "Registrar gasto", icon: ReceiptText },
  { id: "registrar-ingreso", label: "Registrar ingreso", icon: Wallet },
  { id: "informes", label: "Informes", icon: BarChart3 },
  { id: "configuraciones", label: "Configuraciones", icon: Settings },
] as const

type SectionId = (typeof NAV_ITEMS)[number]["id"]
type DashboardSectionProps = {
  onNavigate: (sectionId: SectionId) => void
}

const monthlyBalance = [
  { month: "Ene", gastos: 780000, ingresos: 1240000, balance: 460000 },
  { month: "Feb", gastos: 835000, ingresos: 1240000, balance: 405000 },
  { month: "Mar", gastos: 710000, ingresos: 1320000, balance: 610000 },
  { month: "Abr", gastos: 920000, ingresos: 1280000, balance: 360000 },
  { month: "May", gastos: 875000, ingresos: 1360000, balance: 485000 },
  { month: "Jun", gastos: 642500, ingresos: 1280000, balance: 637500 },
]

const spendingByCategory = [
  { name: "Comida", value: 28, amount: 182000, color: C.teal },
  { name: "Casa", value: 22, amount: 142000, color: C.azure },
  { name: "Transporte", value: 16, amount: 104000, color: C.amber },
  { name: "Salud", value: 13, amount: 84000, color: C.rose },
  { name: "Otros", value: 21, amount: 130500, color: C.slate },
]

const recentExpenses = [
  { id: 1, date: "2026-06-24", description: "Almuerzo McDonalds con amigos", category: "Almuerzo", amount: 18500, reimbursable: true, debtor: "Nico", status: "Pendiente" },
  { id: 2, date: "2026-06-23", description: "Supermercado semana", category: "Supermercado", amount: 72450, reimbursable: false, debtor: "", status: "No aplica" },
  { id: 3, date: "2026-06-22", description: "Cuenta luz", category: "Cuenta", amount: 38990, reimbursable: false, debtor: "", status: "No aplica" },
  { id: 4, date: "2026-06-21", description: "Entrada concierto", category: "Juego", amount: 45000, reimbursable: true, debtor: "Vale", status: "Pagado parcial" },
  { id: 5, date: "2026-06-20", description: "Farmacia resfrío", category: "Farmacia", amount: 16480, reimbursable: false, debtor: "", status: "No aplica" },
  { id: 6, date: "2026-06-19", description: "Transporte oficina", category: "Transporte", amount: 7200, reimbursable: false, debtor: "", status: "No aplica" },
]

const incomes = [
  { id: 1, date: "2026-06-05", description: "Sueldo", amount: 1180000, note: "Ingreso mensual" },
  { id: 2, date: "2026-06-12", description: "Venta teclado", amount: 65000, note: "Venta puntual" },
  { id: 3, date: "2026-06-18", description: "Pega pequeña", amount: 35000, note: "Apoyo freelance" },
]

const reimbursables = [
  { person: "Nico", pending: 18500, paid: 0, last: "Almuerzo McDonalds" },
  { person: "Vale", pending: 22500, paid: 22500, last: "Entrada concierto" },
  { person: "Camila", pending: 12000, paid: 8000, last: "Once compartida" },
]

const quickCategories = [
  { id: 10, name: "Almuerzo" },
  { id: 11, name: "Comida" },
  { id: 12, name: "Once" },
  { id: 13, name: "Supermercado" },
  { id: 14, name: "Transporte" },
  { id: 15, name: "Farmacia" },
  { id: 16, name: "Mascotas" },
  { id: 17, name: "Ropa" },
  { id: 18, name: "Juego" },
  { id: 19, name: "Suscripción" },
  { id: 20, name: "Perfume" },
  { id: 21, name: "Salud" },
  { id: 22, name: "Casa" },
  { id: 23, name: "Cuenta" },
]

type QuickCategory = (typeof quickCategories)[number]

function detectQuickCategory(description: string, categories: QuickCategory[]) {
  const originalDescription = description.trim()
  const [firstWord = "", ...restWords] = originalDescription.split(/\s+/)
  const quickCategory = categories.find((category) => category.name.toLowerCase() === firstWord.toLowerCase()) ?? null

  return {
    originalDescription,
    cleanDescription: quickCategory ? restWords.join(" ") : originalDescription,
    quickCategory,
    quickCategoryId: quickCategory?.id ?? null,
  }
}

const quickCategoryValidationCases = [
  detectQuickCategory("Almuerzo McDonalds con amigos", quickCategories),
  detectQuickCategory("Pagué cuenta de la luz", quickCategories),
]

const reportCards = [
  { title: "Gastos por mes", value: "$642.500", detail: "Junio 2026", icon: ReceiptText },
  { title: "Ingresos por mes", value: "$1.280.000", detail: "Junio 2026", icon: Wallet },
  { title: "Balance mensual", value: "$637.500", detail: "Ingresos menos gastos", icon: CircleDollarSign },
  { title: "Por cobrar", value: "$53.000", detail: "Reembolsos pendientes", icon: HandCoins },
]

const quickAccessItems = [
  { title: "Registrar gasto", detail: "Acceso visual al flujo de gastos", icon: ReceiptText, target: "registrar-gasto" as const, tone: "loss" as const },
  { title: "Registrar ingreso", detail: "Acceso visual al flujo de ingresos", icon: Wallet, target: "registrar-ingreso" as const, tone: "gain" as const },
  { title: "Informes", detail: "Resumen, categorías y reembolsos", icon: BarChart3, target: "informes" as const, tone: "neutral" as const },
  { title: "Configuraciones", detail: "Categorías rápidas y saldo manual", icon: Settings, target: "configuraciones" as const, tone: "neutral" as const },
]

const notifications = [
  { id: 1, type: "success" as const, title: "Gasto mock registrado", message: "Almuerzo McDonalds aparece como gasto reembolsable pendiente.", time: "Hace 8 min", read: false },
  { id: 2, type: "warning" as const, title: "Saldo por revisar", message: "El saldo manual aún será parte de una etapa posterior.", time: "Hace 1 h", read: false },
  { id: 3, type: "info" as const, title: "Categorías rápidas", message: "La configuración visual ya muestra categorías sugeridas.", time: "Ayer", read: true },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value)
}

function ChartTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg surface-elevated p-3 text-xs backdrop-blur-md" style={{ boxShadow: CARD_SHADOW }}>
      <p className="text-muted-foreground mb-2 font-semibold text-[11px] uppercase tracking-wider font-sans">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground capitalize font-sans">{entry.name}:</span>
          <span className="font-mono font-bold text-foreground">
            {entry.name === "value" ? `${entry.value}%` : formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function KpiCard({
  label,
  value,
  change,
  delay = 0,
  icon: Icon,
  tone = "neutral",
}: {
  label: string
  value: string
  change?: string
  delay?: number
  icon: React.ElementType
  tone?: "gain" | "loss" | "neutral"
}) {
  const toneClass = tone === "gain" ? "text-fin-gain bg-fin-gain/10" : tone === "loss" ? "text-fin-loss bg-fin-loss/10" : "text-primary bg-primary/10"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT }}
      className="relative overflow-hidden rounded-lg surface-card p-4 lg:p-5 transition-transform duration-300 hover:scale-[1.01]"
      style={{ boxShadow: CARD_SHADOW }}
    >
      <div className={`mb-4 flex size-9 items-center justify-center rounded-lg ${toneClass}`}>
        <Icon className="size-4" />
      </div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans">{label}</p>
      <p className="text-2xl lg:text-3xl font-bold text-foreground font-mono tracking-tight leading-none">{value}</p>
      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
          {tone === "loss" ? <ArrowDownRight className="size-3.5 text-fin-loss" /> : <ArrowUpRight className="size-3.5 text-fin-gain" />}
          <span>{change}</span>
        </div>
      )}
    </motion.div>
  )
}

function SectionPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: EASE_OUT }}
      className={`rounded-lg surface-card p-5 lg:p-6 ${className}`}
      style={{ boxShadow: CARD_SHADOW }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-bold text-foreground tracking-tight font-display">{title}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 font-sans">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "gain" | "loss" | "neutral" | "warning" }) {
  const className =
    tone === "gain"
      ? "bg-fin-gain/10 text-fin-gain"
      : tone === "loss"
        ? "bg-fin-loss/10 text-fin-loss"
        : tone === "warning"
          ? "bg-chart-3/10 text-chart-3"
          : "bg-muted/50 text-muted-foreground"

  return <span className={`rounded-md px-2 py-1 text-[11px] font-bold font-sans ${className}`}>{children}</span>
}

function NotificationPanel({
  isOpen,
  items,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: {
  isOpen: boolean
  items: typeof notifications
  onClose: () => void
  onMarkRead: (id: number) => void
  onMarkAllRead: () => void
}) {
  const unreadCount = items.filter((n) => !n.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
          className="absolute right-0 top-full z-50 mt-3 w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-lg surface-elevated"
          style={{ boxShadow: CARD_SHADOW }}
        >
          <div className="flex items-center justify-between border-b border-border/50 p-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground font-display">Avisos</h3>
              {unreadCount > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">{unreadCount}</span>}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button onClick={onMarkAllRead} className="px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:text-primary/80">
                  Marcar leídos
                </button>
              )}
              <button onClick={onClose} className="rounded-md p-1.5 transition-colors hover:bg-accent" aria-label="Cerrar avisos">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="max-h-[22rem] overflow-y-auto">
            {items.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: i * 0.03 }}
                onClick={() => onMarkRead(item.id)}
                className={`flex w-full items-start gap-3 border-b border-border/30 p-4 text-left transition-colors hover:bg-accent/30 ${!item.read ? "bg-primary/[0.04]" : ""}`}
              >
                <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${item.type === "success" ? "bg-fin-gain/12 text-fin-gain" : item.type === "warning" ? "bg-chart-3/12 text-chart-3" : "bg-chart-2/12 text-chart-2"}`}>
                  {item.type === "success" ? <Check className="size-3.5" /> : item.type === "warning" ? <Clock className="size-3.5" /> : <ListChecks className="size-3.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-foreground font-sans">{item.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground font-sans">{item.message}</p>
                  <p className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground/60 font-mono">{item.time}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ExpensesTable({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="p-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans">Fecha</th>
            <th className="p-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans">Descripción</th>
            <th className="hidden p-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans sm:table-cell">Categoría</th>
            <th className="hidden p-4 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans md:table-cell">Reembolso</th>
            <th className="p-4 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans">Monto</th>
          </tr>
        </thead>
        <tbody>
          {recentExpenses.slice(0, compact ? 4 : recentExpenses.length).map((expense, i) => (
            <motion.tr
              key={expense.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="border-b border-border/30 transition-colors hover:bg-accent/20"
            >
              <td className="whitespace-nowrap p-4 text-xs text-muted-foreground font-mono">{expense.date}</td>
              <td className="p-4">
                <p className="font-semibold text-foreground font-sans">{expense.description}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:hidden">{expense.category}</p>
              </td>
              <td className="hidden p-4 sm:table-cell">
                <StatusBadge>{expense.category}</StatusBadge>
              </td>
              <td className="hidden p-4 md:table-cell">
                {expense.reimbursable ? (
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={expense.status === "Pendiente" ? "warning" : "gain"}>{expense.status}</StatusBadge>
                    <span className="text-xs text-muted-foreground">{expense.debtor}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No aplica</span>
                )}
              </td>
              <td className="whitespace-nowrap p-4 text-right font-bold text-fin-loss font-mono">{formatCurrency(expense.amount)}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SummarySection({ onNavigate }: DashboardSectionProps) {
  return (
    <div className={`flex flex-col gap-5 ${SECTION_MIN_H}`}>
      <SectionPanel className="!p-0 overflow-hidden">
        <div className="border-b border-border/50 p-5 lg:p-6">
          <SectionHeader title="Panel principal" subtitle="Vista inicial de Dash Gastos con accesos principales y datos falsos" />
        </div>
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
          {quickAccessItems.map((item, i) => {
            const Icon = item.icon
            const toneClass = item.tone === "gain" ? "text-fin-gain bg-fin-gain/10" : item.tone === "loss" ? "text-fin-loss bg-fin-loss/10" : "text-primary bg-primary/10"

            return (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease: EASE_OUT }}
                onClick={() => onNavigate(item.target)}
                className="flex min-h-28 items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-4 text-left transition-colors hover:bg-accent/30"
              >
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground font-sans">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground font-sans">{item.detail}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </SectionPanel>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KpiCard label="Gastos del mes" value="$642.500" change="18% menos que mayo" delay={0} icon={ReceiptText} tone="loss" />
        <KpiCard label="Ingresos del mes" value="$1.280.000" change="Sincronía mock mensual" delay={0.06} icon={Wallet} tone="gain" />
        <KpiCard label="Balance estimado" value="$637.500" change="Saldo positivo" delay={0.12} icon={CircleDollarSign} tone="gain" />
        <KpiCard label="Por cobrar" value="$53.000" change="3 personas pendientes" delay={0.18} icon={HandCoins} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <SectionPanel className="lg:col-span-2">
          <SectionHeader title="Balance mensual" subtitle="Datos falsos para validar la base visual">
            <div className="hidden items-center gap-4 text-[11px] sm:flex">
              <div className="flex items-center gap-2"><div className="size-2.5 rounded-full bg-primary" /><span className="text-muted-foreground">Ingresos</span></div>
              <div className="flex items-center gap-2"><div className="size-2.5 rounded-full bg-fin-loss" /><span className="text-muted-foreground">Gastos</span></div>
            </div>
          </SectionHeader>
          <div className="h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBalance} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.teal} stopOpacity={0.24} />
                    <stop offset="100%" stopColor={C.teal} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.rose} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={C.rose} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.tick }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.tick }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="ingresos" name="ingresos" stroke={C.teal} strokeWidth={2.5} fill="url(#incomeGrad)" animationDuration={1100} />
                <Area type="monotone" dataKey="gastos" name="gastos" stroke={C.rose} strokeWidth={2.5} fill="url(#expenseGrad)" animationDuration={1100} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel>
          <SectionHeader title="Gastos por categoría" subtitle="Distribución mock de junio" />
          <div className="flex h-48 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius="58%" outerRadius="82%" paddingAngle={4} dataKey="value" stroke="none" animationDuration={1000}>
                  {spendingByCategory.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-col gap-2.5">
            {spendingByCategory.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground font-sans">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-foreground">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>

      <SectionPanel className="!p-0 overflow-hidden">
        <div className="border-b border-border/50 p-5 lg:p-6">
          <SectionHeader title="Movimientos recientes" subtitle="Vista mock de los últimos gastos registrados" />
        </div>
        <ExpensesTable compact />
      </SectionPanel>
    </div>
  )
}

function ExpenseRegisterSection() {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [isReimbursable, setIsReimbursable] = useState(false)
  const [debtorName, setDebtorName] = useState("")
  const [showValidation, setShowValidation] = useState(false)

  const descriptionError = showValidation && description.trim().length === 0
  const amountError = showValidation && amount.trim().length === 0
  const debtorError = showValidation && isReimbursable && debtorName.trim().length === 0
  const quickCategoryResult = useMemo(() => detectQuickCategory(description, quickCategories), [description])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowValidation(true)
  }

  return (
    <div className={`flex flex-col gap-5 ${SECTION_MIN_H}`}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KpiCard label="Total gastos" value="$642.500" delay={0} icon={ReceiptText} tone="loss" />
        <KpiCard label="Gastos mock" value="6" delay={0.06} icon={ListChecks} />
        <KpiCard label="Mayor categoría" value="Comida" delay={0.12} icon={Tag} />
        <KpiCard label="Reembolsables" value="$63.500" delay={0.18} icon={HandCoins} />
      </div>

      <SectionPanel className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-border/50 p-5 lg:p-6">
          <SectionHeader title="Registrar gasto" subtitle="Formulario visual sin persistencia; los datos no se guardan todavía" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-5 border-b border-border/50 p-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="expense-description" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans">
                Nombre descriptivo
              </label>
              <Input
                id="expense-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                aria-invalid={descriptionError}
                placeholder="Ej: Almuerzo McDonalds con amigos"
                className="h-11 rounded-lg border-border/50 bg-muted/20 font-sans"
              />
              {descriptionError && <p className="text-[11px] font-semibold text-fin-loss font-sans">Ingresa un nombre descriptivo del gasto.</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="expense-amount" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans">
                Monto
              </label>
              <Input
                id="expense-amount"
                inputMode="numeric"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                aria-invalid={amountError}
                placeholder="Ej: 18500"
                className="h-11 rounded-lg border-border/50 bg-muted/20 font-mono"
              />
              {amountError && <p className="text-[11px] font-semibold text-fin-loss font-sans">Ingresa el monto del gasto.</p>}
            </div>

            <div className="flex min-h-[4.75rem] items-center gap-3 rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
              <Checkbox
                id="expense-reimbursable"
                checked={isReimbursable}
                onCheckedChange={(checked) => {
                  setIsReimbursable(checked === true)
                  if (checked !== true) setDebtorName("")
                }}
              />
              <div>
                <label htmlFor="expense-reimbursable" className="text-sm font-semibold text-foreground font-sans">
                  Es reembolsable
                </label>
                <p className="mt-0.5 text-[11px] text-muted-foreground font-sans">Activa el campo de persona asociada.</p>
              </div>
            </div>

            {isReimbursable && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="flex flex-col gap-2 sm:col-span-2"
              >
                <label htmlFor="expense-debtor" className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans">
                  Nombre deudor
                </label>
                <Input
                  id="expense-debtor"
                  value={debtorName}
                  onChange={(event) => setDebtorName(event.target.value)}
                  aria-invalid={debtorError}
                  placeholder="Ej: Nico"
                  className="h-11 rounded-lg border-border/50 bg-muted/20 font-sans"
                />
                {debtorError && <p className="text-[11px] font-semibold text-fin-loss font-sans">Ingresa quién debe el reembolso.</p>}
              </motion.div>
            )}

            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90">
                <Check className="size-4" />
                Revisar campos
              </button>
              <button
                type="button"
                onClick={() => {
                  setDescription("")
                  setAmount("")
                  setIsReimbursable(false)
                  setDebtorName("")
                  setShowValidation(false)
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans">Vista previa UI</p>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground">Descripción original</span>
                <span className="max-w-44 text-right font-bold text-foreground font-sans">{quickCategoryResult.originalDescription || "Sin nombre"}</span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground">Descripción limpia</span>
                <span className="max-w-44 text-right font-bold text-foreground font-sans">{quickCategoryResult.cleanDescription || "Sin descripción"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Categoría rápida</span>
                {quickCategoryResult.quickCategory ? (
                  <StatusBadge tone="gain">{quickCategoryResult.quickCategory.name}</StatusBadge>
                ) : (
                  <StatusBadge>Sin categoría</StatusBadge>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">quickCategoryId</span>
                <span className="font-bold text-foreground font-mono">{quickCategoryResult.quickCategoryId ?? "NULL"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Monto</span>
                <span className="font-bold text-fin-loss font-mono">{amount.trim() ? `$${amount}` : "$0"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Reembolso</span>
                <StatusBadge tone={isReimbursable ? "warning" : "neutral"}>{isReimbursable ? "Pendiente" : "No aplica"}</StatusBadge>
              </div>
              {isReimbursable && (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Persona</span>
                  <span className="font-bold text-foreground font-sans">{debtorName.trim() || "Sin nombre"}</span>
                </div>
              )}
            </div>
            <p className="mt-5 rounded-lg bg-background/35 p-3 text-[11px] leading-relaxed text-muted-foreground font-sans">
              Esta etapa solo interpreta la categoría rápida en UI. No crea registros ni persiste datos.
            </p>
          </div>
        </form>

        <div className="grid grid-cols-1 gap-4 border-b border-border/50 p-5 lg:grid-cols-2 lg:p-6">
          {quickCategoryValidationCases.map((item) => (
            <div key={item.originalDescription} className="rounded-lg border border-border/40 bg-muted/20 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground font-sans">Caso manual</p>
              <p className="mt-2 text-sm font-bold text-foreground font-sans">{item.originalDescription}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                <div className="rounded-lg bg-background/35 p-3">
                  <p className="text-muted-foreground">Categoría</p>
                  <p className="mt-1 font-bold text-foreground font-sans">{item.quickCategory?.name ?? "Sin categoría"}</p>
                </div>
                <div className="rounded-lg bg-background/35 p-3">
                  <p className="text-muted-foreground">ID</p>
                  <p className="mt-1 font-bold text-foreground font-mono">{item.quickCategoryId ?? "NULL"}</p>
                </div>
                <div className="rounded-lg bg-background/35 p-3">
                  <p className="text-muted-foreground">Descripción</p>
                  <p className="mt-1 font-bold text-foreground font-sans">{item.cleanDescription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ExpensesTable />
      </SectionPanel>
    </div>
  )
}

function IncomeRegisterSection() {
  return (
    <div className={`flex flex-col gap-5 ${SECTION_MIN_H}`}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <KpiCard label="Total ingresos" value="$1.280.000" change="3 entradas mock" delay={0} icon={Wallet} tone="gain" />
        <KpiCard label="Ingreso principal" value="Sueldo" delay={0.06} icon={CircleDollarSign} tone="gain" />
        <KpiCard label="Ingresos extra" value="$100.000" delay={0.12} icon={Plus} />
        <KpiCard label="Balance actual" value="$637.500" delay={0.18} icon={ArrowUpRight} tone="gain" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <SectionPanel className="lg:col-span-2">
          <SectionHeader title="Registrar ingreso" subtitle="Acceso visual del flujo; el formulario real se implementará después" />
          <div className="mb-5 grid grid-cols-1 gap-4 border-b border-border/50 pb-5 sm:grid-cols-3">
            {[
              { label: "Nombre descriptivo", value: "Sueldo" },
              { label: "Monto", value: "$1.180.000" },
              { label: "Nota", value: "Ingreso mensual" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-border/40 bg-muted/20 p-4">
                <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground font-sans">{item.label}</p>
                <p className="mt-2 text-sm font-bold text-foreground font-sans">{item.value}</p>
              </div>
            ))}
          </div>
          <SectionHeader title="Ingresos vs gastos" subtitle="Comparación mensual con datos mock" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBalance} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.tick }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.tick }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="ingresos" name="ingresos" fill={C.teal} radius={[6, 6, 0, 0]} animationDuration={900} />
                <Bar dataKey="gastos" name="gastos" fill={C.rose} radius={[6, 6, 0, 0]} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionPanel>

        <SectionPanel>
          <SectionHeader title="Entradas recientes" subtitle="Listado visual sin persistencia" />
          <div className="flex flex-col gap-3">
            {incomes.map((income, i) => (
              <motion.div
                key={income.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="rounded-lg border border-border/40 bg-muted/20 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground font-sans">{income.description}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground font-sans">{income.note}</p>
                  </div>
                  <span className="whitespace-nowrap text-sm font-bold text-fin-gain font-mono">{formatCurrency(income.amount)}</span>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground font-mono">{income.date}</p>
              </motion.div>
            ))}
          </div>
        </SectionPanel>
      </div>
    </div>
  )
}

function ReportsSection() {
  return (
    <div className={`flex flex-col gap-5 ${SECTION_MIN_H}`}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {reportCards.map((card, i) => (
          <KpiCard key={card.title} label={card.title} value={card.value} change={card.detail} delay={i * 0.06} icon={card.icon} tone={i === 0 ? "loss" : i === 3 ? "neutral" : "gain"} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionPanel>
          <SectionHeader title="Reembolsos por persona" subtitle="Resumen mock de montos pendientes y pagados" />
          <div className="flex flex-col gap-3">
            {reimbursables.map((item, i) => (
              <motion.div
                key={item.person}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="rounded-lg border border-border/40 bg-muted/20 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <UserRound className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground font-sans">{item.person}</p>
                      <p className="text-[11px] text-muted-foreground font-sans">{item.last}</p>
                    </div>
                  </div>
                  <StatusBadge tone={item.pending > 0 ? "warning" : "gain"}>{item.pending > 0 ? "Pendiente" : "Pagado"}</StatusBadge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-background/35 p-3">
                    <p className="text-muted-foreground">Por cobrar</p>
                    <p className="mt-1 font-bold text-chart-3 font-mono">{formatCurrency(item.pending)}</p>
                  </div>
                  <div className="rounded-lg bg-background/35 p-3">
                    <p className="text-muted-foreground">Recuperado</p>
                    <p className="mt-1 font-bold text-fin-gain font-mono">{formatCurrency(item.paid)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel>
          <SectionHeader title="Categorías con mayor gasto" subtitle="Ranking visual de junio" />
          <div className="flex flex-col gap-4">
            {spendingByCategory.map((item, i) => (
              <div key={item.name} className="flex items-center gap-4">
                <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground font-sans">{item.name}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted/60">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: EASE_OUT }}
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                  />
                </div>
                <span className="w-24 text-right text-xs font-bold text-foreground font-mono">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>
    </div>
  )
}

function SettingsSection() {
  const [activeTab, setActiveTab] = useState("categorias")
  const tabs = [
    { id: "categorias", label: "Categorías rápidas", icon: Tag },
    { id: "saldo", label: "Saldo manual", icon: Wallet },
    { id: "preferencias", label: "Preferencias", icon: SlidersHorizontal },
  ]

  return (
    <div className={`flex flex-col gap-5 ${SECTION_MIN_H}`}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-lg surface-card p-5 lg:p-6" style={{ boxShadow: CARD_SHADOW }}>
        <h3 className="text-lg font-bold text-foreground font-display tracking-tight">Configuraciones</h3>
        <p className="mt-1 text-xs text-muted-foreground font-sans">Vista visual de opciones futuras para categorías, saldo y preferencias locales.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }} className="rounded-lg surface-card p-3.5 lg:col-span-1" style={{ boxShadow: CARD_SHADOW }}>
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-semibold transition-colors font-sans ${
                    isActive ? "bg-primary/8 text-foreground" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {tab.label}
                  {isActive && <ChevronRight className="ml-auto size-3.5 text-primary" />}
                </button>
              )
            })}
          </nav>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 }} className="rounded-lg surface-card p-5 lg:col-span-3 lg:p-7" style={{ boxShadow: CARD_SHADOW }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              {activeTab === "categorias" && (
                <div className="flex flex-col gap-5">
                  <SectionHeader title="Categorías rápidas sugeridas" subtitle="La edición real se implementará en una etapa posterior" />
                  <div className="flex flex-wrap gap-2">
                    {quickCategories.map((category) => (
                      <span key={category.id} className="rounded-md border border-border/40 bg-muted/30 px-3 py-2 text-xs font-semibold text-foreground font-sans">
                        <span className="mr-2 text-muted-foreground font-mono">#{category.id}</span>
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "saldo" && (
                <div className="flex flex-col gap-4">
                  <SectionHeader title="Saldo manual" subtitle="Concepto visual para comparar saldo real contra saldo esperado" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      { label: "Cuenta", value: "Cuenta corriente" },
                      { label: "Saldo real mock", value: "$1.120.000" },
                      { label: "Diferencia estimada", value: "$12.500" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border border-border/40 bg-muted/20 p-4">
                        <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground font-sans">{item.label}</p>
                        <p className="mt-2 text-sm font-bold text-foreground font-mono">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "preferencias" && (
                <div className="flex flex-col gap-4">
                  <SectionHeader title="Preferencias locales" subtitle="Opciones visuales sin persistencia todavía" />
                  {[
                    { label: "Moneda", value: "CLP" },
                    { label: "Formato de fecha", value: "AAAA-MM-DD" },
                    { label: "Resumen inicial", value: "Mes actual" },
                    { label: "Recordatorios", value: "Desactivados" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 p-4">
                      <p className="text-sm font-semibold text-foreground font-sans">{item.label}</p>
                      <span className="rounded-md bg-muted/60 px-3 py-1.5 text-xs font-bold text-foreground font-mono">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

const sectionComponents: Record<SectionId, React.FC<DashboardSectionProps>> = {
  resumen: SummarySection,
  "registrar-gasto": ExpenseRegisterSection,
  "registrar-ingreso": IncomeRegisterSection,
  informes: ReportsSection,
  configuraciones: SettingsSection,
}

export default function FinancialAnalyticsDashboard() {
  const [activeSection, setActiveSection] = useState<SectionId>("resumen")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifItems, setNotifItems] = useState(notifications)

  const handleNavigation = useCallback((sectionId: SectionId) => {
    if (sectionId === activeSection) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveSection(sectionId)
      setIsTransitioning(false)
    }, 180)
  }, [activeSection])

  const handleMarkRead = useCallback((id: number) => {
    setNotifItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const handleMarkAllRead = useCallback(() => {
    setNotifItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const unreadCount = useMemo(() => notifItems.filter((n) => !n.read).length, [notifItems])
  const ActiveComponent = useMemo(() => sectionComponents[activeSection], [activeSection])
  const activeNav = useMemo(() => NAV_ITEMS.find((n) => n.id === activeSection), [activeSection])

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background text-foreground" style={{ boxShadow: CARD_SHADOW }}>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-card/60 backdrop-blur-xl">
        <div className="w-full px-5 lg:px-10 xl:px-14">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/12">
                  <ReceiptText className="size-4 text-primary" />
                </div>
                <span className="text-base font-extrabold tracking-tight text-foreground font-display">Dash Gastos</span>
              </div>
              <div className="ml-3 hidden items-center gap-1 text-xs text-muted-foreground font-sans md:flex">
                <span>Panel local</span>
                <ChevronRight className="size-3 text-muted-foreground/50" />
                <span className="font-semibold text-foreground">{activeNav?.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button className="rounded-lg p-2.5 transition-colors hover:bg-accent/50" aria-label="Buscar">
                <Search className="size-4 text-muted-foreground" />
              </button>
              <button className="rounded-lg p-2.5 transition-colors hover:bg-accent/50" aria-label="Filtrar vista">
                <Filter className="size-4 text-muted-foreground" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                  className="relative rounded-lg p-2.5 transition-colors hover:bg-accent/50"
                  aria-label="Avisos"
                  aria-expanded={notificationsOpen}
                >
                  <Bell className="size-4 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={SPRING}
                      className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground font-mono"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </button>
                <NotificationPanel
                  isOpen={notificationsOpen}
                  items={notifItems}
                  onClose={() => setNotificationsOpen(false)}
                  onMarkRead={handleMarkRead}
                  onMarkAllRead={handleMarkAllRead}
                />
              </div>
              <button className="rounded-lg p-2.5 transition-colors hover:bg-accent/50" aria-label="Configuraciones" onClick={() => handleNavigation("configuraciones")}>
                <Settings className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-16 z-20 border-b border-border/40 bg-card/40 backdrop-blur-xl">
        <div className="w-full px-5 lg:px-10 xl:px-14">
          <div className="-mb-px flex items-center gap-0.5 overflow-x-auto py-1.5 scrollbar-none">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === activeSection
              const Icon = item.icon

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors font-sans ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary"
                      style={{ boxShadow: "0 0 8px 2px oklch(0.78 0.16 182 / 0.3)" }}
                      transition={SPRING}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full flex-1 px-5 py-6 lg:px-10 lg:py-8 xl:px-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: isTransitioning ? 0.3 : 1, y: isTransitioning ? 6 : 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <ActiveComponent onNavigate={handleNavigation} />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 mt-auto border-t border-border/40">
        <div className="w-full px-5 py-4 lg:px-10 xl:px-14">
          <div className="flex items-center justify-between gap-4 text-[11px] text-muted-foreground font-sans">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-fin-gain animate-pulse-soft" />
              <span className="font-medium">Layout principal de Etapa 2</span>
            </div>
            <span className="text-right font-mono text-muted-foreground/60">Datos mock · Sin persistencia</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
