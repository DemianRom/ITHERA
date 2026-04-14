import { useState } from 'react'
import { Navbar } from '../../components/layout/Navbar'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Participant {
  id: string
  name: string
  role: 'Organizador' | 'Miembro'
  color: string
  isOnline: boolean
}

interface ActivityMeta {
  time?: string
  location?: string
  votes?: number
}

interface Activity {
  id: string
  title: string
  description: string
  status: 'confirmed' | 'pending'
  category: 'transport' | 'lodging' | 'activity'
  image: string
  price: string
  proposedBy?: string
  meta: ActivityMeta
}

interface TripDay {
  id: number
  shortDate: string
  label: string
  activityCount: number
}

interface ChatMessage {
  id: string
  text: string
  isOwn: boolean
  author?: string
  timestamp: string
}

interface BudgetItem {
  label: string
  amount: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const PARTICIPANTS: Participant[] = [
  { id: '1', name: 'Bryan A.',    role: 'Organizador', color: '#1E6FD9', isOnline: true  },
  { id: '2', name: 'Ana L.',      role: 'Miembro',     color: '#35C56A', isOnline: true  },
  { id: '3', name: 'Luis R.',     role: 'Miembro',     color: '#7A4FD6', isOnline: true  },
  { id: '4', name: 'Mariana G.', role: 'Miembro',     color: '#F59E0B', isOnline: false },
]

const DAYS: TripDay[] = [
  { id: 1, shortDate: '16 JUN', label: 'Día 1', activityCount: 3 },
  { id: 2, shortDate: '17 JUN', label: 'Día 2', activityCount: 4 },
  { id: 3, shortDate: '18 JUN', label: 'Día 3', activityCount: 2 },
  { id: 4, shortDate: '19 JUN', label: 'Día 4', activityCount: 1 },
]

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Traslado aeropuerto – hotel',
    description: 'Servicio privado de traslado con aire acondicionado y conductor profesional',
    status: 'confirmed',
    category: 'transport',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=300&fit=crop',
    price: '$280 MXN / Persona',
    meta: { time: '09:00 hrs', location: 'Aeropuerto · Hotel' },
  },
  {
    id: '2',
    title: 'Hotel Malecón Premium',
    description: 'Hotel frente al mar con alberca infinity, desayuno incluido y acceso a playa privada',
    status: 'confirmed',
    category: 'lodging',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=300&fit=crop',
    price: '$2,100 MXN / Noche',
    meta: { time: 'Check-in 14:00' },
  },
  {
    id: '3',
    title: 'Tour de snorkel',
    description: 'Explora arrecifes de coral con equipo incluido, guía certificado y transporte desde el hotel',
    status: 'pending',
    category: 'activity',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=300&fit=crop',
    price: '$650 MXN / Persona',
    proposedBy: 'Bryan A.',
    meta: { time: '10:00 hrs', location: 'Playa Delfines', votes: 6 },
  },
  {
    id: '4',
    title: 'Cena en La Habichuela',
    description: 'Restaurante tradicional mexicano en el centro de Cancún con ambiente romántico y jardín tropical',
    status: 'pending',
    category: 'activity',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=300&fit=crop',
    price: '$390 MXN / Persona',
    proposedBy: 'Ana L.',
    meta: { time: '20:00 hrs', votes: 3 },
  },
]

const BUDGET_ITEMS: BudgetItem[] = [
  { label: 'Vuelos',      amount: '$5,600' },
  { label: 'Hospedaje',   amount: '$6,300' },
  { label: 'Actividades', amount: '$2,300' },
]

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', text: 'El hotel confirmó check-in a las 2 pm', isOwn: false, author: 'Ana L.',  timestamp: '10:42 am' },
  { id: '2', text: 'Perfecto, ya agregué el traslado',       isOwn: true,  author: 'Bryan A.', timestamp: '10:44 am' },
]

// ── Inline icons ──────────────────────────────────────────────────────────────

function IconCalendar({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

function IconUsers({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconClock({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconMapPin({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

function IconDownload({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconPlus({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconTrash({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

function IconSearch({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconSend({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    </svg>
  )
}

function IconInfo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconPlane({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5 18 1 16 1 14.5 2.5L11 6 2.8 4.2l-2 2 3.5 3.5L2 14l2 2 4.5-2 3.5 3.5 3.5 3.5 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconBed({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 9V5a1 1 0 011-1h18a1 1 0 011 1v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="2" y="9" width="20" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
      <line x1="2" y1="18" x2="2" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="18" x2="22" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 9v4M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconStar({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Category helpers ──────────────────────────────────────────────────────────

function getCategoryIcon(category: Activity['category']) {
  if (category === 'transport') return <IconPlane size={14} />
  if (category === 'lodging')   return <IconBed size={14} />
  return <IconStar size={14} />
}

function getCategoryColor(category: Activity['category']): string {
  if (category === 'transport') return '#1E6FD9'
  if (category === 'lodging')   return '#7A4FD6'
  return '#F59E0B'
}

function getSectionLabel(category: Activity['category'], hasPending?: boolean) {
  if (category === 'transport') return { icon: <IconPlane size={12} />, text: 'TRANSPORTE' }
  if (category === 'lodging')   return { icon: <IconBed size={12} />, text: 'HOSPEDAJE' }
  return { icon: <IconStar size={12} />, text: hasPending ? 'ACTIVIDADES – POR CONFIRMAR' : 'ACTIVIDADES' }
}

// ── LeftSidebar ───────────────────────────────────────────────────────────────

interface LeftSidebarProps {
  activeDay: number
  onDayChange: (day: number) => void
  isOpen: boolean
}

function LeftSidebar({ activeDay, onDayChange, isOpen }: LeftSidebarProps) {
  return (
    <aside
      className={[
        'shrink-0 bg-purpleNavbar overflow-hidden transition-all duration-300 ease-in-out',
        isOpen ? 'w-[240px]' : 'w-0',
      ].join(' ')}
    >
    <div className="w-[240px] flex flex-col h-full px-4 pt-6 pb-4 overflow-y-auto">
      {/* Trip name */}
      <div className="mb-4">
        <h2 className="font-heading font-bold text-white text-base leading-tight">Cancún 2025</h2>
        <p className="font-body text-xs text-white/50 mt-0.5">Riviera Maya, México</p>
      </div>

      {/* Metadata pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
          <span className="text-white/70"><IconCalendar /></span>
          <span className="font-body text-[11px] text-white/70">15–18 Jun</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
          <span className="text-white/70"><IconUsers /></span>
          <span className="font-body text-[11px] text-white/70">4 personas</span>
        </div>
      </div>

      {/* Itinerary section */}
      <p className="font-body text-[10px] text-white/40 uppercase tracking-widest mb-2">Itinerario</p>
      <ul className="flex flex-col gap-1 mb-5">
        {DAYS.map((day) => {
          const isActive = day.id === activeDay
          return (
            <li key={day.id}>
              <button
                onClick={() => onDayChange(day.id)}
                className={[
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors duration-150',
                  isActive
                    ? 'bg-bluePrimary'
                    : 'hover:bg-white/10',
                ].join(' ')}
              >
                <div>
                  <p className={`font-body text-sm font-${isActive ? 'bold' : 'normal'} ${isActive ? 'text-white' : 'text-white/60'} leading-none`}>
                    {day.label}
                  </p>
                  <p className={`font-body text-xs mt-0.5 ${isActive ? 'text-white/70' : 'text-white/40'} leading-none`}>
                    {day.shortDate} · {day.activityCount} actividades
                  </p>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {/* Divider */}
      <div className="border-t border-white/10 mb-4" />

      {/* Budget */}
      <p className="font-body text-[10px] text-white/40 uppercase tracking-widest mb-2">Presupuesto Grupal</p>
      <p className="font-heading font-bold text-white text-2xl leading-none">$14,200</p>
      <p className="font-body text-xs text-white/40 mt-0.5 mb-3">de $24,000 MXN</p>

      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1">
        <div
          className="h-full rounded-full"
          style={{ width: '59%', background: 'linear-gradient(90deg, #1E6FD9, #7A4FD6)' }}
        />
      </div>
      <p className="font-body text-[11px] text-white/40 text-right mb-3">59%</p>

      {/* Breakdown */}
      <div className="flex flex-col gap-2">
        {BUDGET_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="font-body text-[11px] text-white/60">{item.label}</span>
            <span className="font-body text-[11px] font-semibold text-white/80">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
    </aside>
  )
}

// ── HeroCard ──────────────────────────────────────────────────────────────────

interface HeroCardProps {
  activeDay: number
}

function HeroCard({ activeDay }: HeroCardProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden mb-4 h-52 shrink-0">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=400&fit=crop"
        alt="Cancún"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="font-body text-[11px] font-bold text-white bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          DÍA {activeDay} / 4
        </span>
        <span className="font-body text-[11px] font-bold text-white bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          16 JUNIO 2025
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
        <h1 className="font-heading font-bold text-white text-[28px] leading-tight mb-1">
          Llegada a Cancún
        </h1>
        <p className="font-body text-[13px] text-white/70 mb-3">
          3 actividades planeadas · 1 pendiente de confirmación
        </p>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-white border border-white/50 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors">
            <IconDownload size={13} />
            Exportar PDF
          </button>
          <button className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-white bg-greenAccent rounded-lg px-4 py-2 hover:opacity-90 transition-opacity">
            <IconPlus size={13} />
            Proponer actividad
          </button>
        </div>
      </div>
    </div>
  )
}

// ── TimelineStrip ─────────────────────────────────────────────────────────────

interface TimelineStripProps {
  activeDay: number
  onDayChange: (day: number) => void
}

function TimelineStrip({ activeDay, onDayChange }: TimelineStripProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3 mb-4">
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
        {DAYS.map((day) => {
          const isActive = day.id === activeDay
          return (
            <button
              key={day.id}
              onClick={() => onDayChange(day.id)}
              className={[
                'shrink-0 flex flex-col items-center px-4 py-2 rounded-xl transition-colors duration-150 min-w-[72px]',
                isActive
                  ? 'bg-bluePrimary text-white'
                  : 'bg-white border border-[#E2E8F0] text-gray700 hover:border-bluePrimary/50',
              ].join(' ')}
            >
              <span className={`font-body text-[11px] font-bold leading-none ${isActive ? 'text-white' : 'text-gray500'}`}>
                {day.shortDate}
              </span>
              <span className={`font-heading font-bold text-sm leading-none mt-0.5 ${isActive ? 'text-white' : 'text-gray700'}`}>
                {day.label}
              </span>
              <span className={`font-body text-[11px] leading-none mt-0.5 ${isActive ? 'text-white/70' : 'text-gray500'}`}>
                {day.activityCount} act.
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── InfoBanner ────────────────────────────────────────────────────────────────

function InfoBanner() {
  return (
    <div className="flex items-start gap-3 bg-[#EEF4FF] border border-bluePrimary/20 rounded-xl px-4 py-3 mb-4">
      <span className="text-bluePrimary mt-0.5 shrink-0">
        <IconInfo size={16} />
      </span>
      <div>
        <p className="font-body text-sm font-semibold text-gray700 leading-tight">
          Acepta propuestas para confirmarlas
        </p>
        <p className="font-body text-xs text-gray500 mt-0.5 leading-relaxed">
          Las actividades con votos necesitan tu aprobación para ser incluidas en el itinerario final del grupo.
        </p>
      </div>
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-gray500">{icon}</span>
      <span className="font-body text-[11px] font-semibold text-gray500 uppercase tracking-wider">{text}</span>
    </div>
  )
}

// ── ActivityCardConfirmed ─────────────────────────────────────────────────────

function ActivityCardConfirmed({ activity }: { activity: Activity }) {
  const iconColor = getCategoryColor(activity.category)
  const iconEl    = getCategoryIcon(activity.category)

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Confirmed badge */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 font-body text-[11px] font-bold text-white bg-greenAccent rounded-full px-3 py-1 shadow-sm">
          <IconCheck size={10} />
          CONFIRMADO
        </span>
        {/* Price badge */}
        <span className="absolute top-3 right-3 font-body text-xs font-semibold text-white bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          {activity.price}
        </span>
        {/* Category icon circle */}
        <div
          className="absolute left-4 -bottom-4 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E2E8F0]"
          style={{ color: iconColor }}
        >
          {iconEl}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pt-6 pb-4">
        <h3 className="font-heading font-bold text-purpleNavbar text-[15px] mb-1 leading-snug">
          {activity.title}
        </h3>
        <p className="font-body text-xs text-gray500 mb-3 leading-relaxed">{activity.description}</p>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {activity.meta.time && (
            <span className="inline-flex items-center gap-1.5 font-body text-xs text-gray700 bg-neutralBg rounded-full px-3 py-1">
              <span className="text-bluePrimary"><IconClock /></span>
              {activity.meta.time}
            </span>
          )}
          {activity.meta.location && (
            <span className="inline-flex items-center gap-1.5 font-body text-xs text-gray700 bg-neutralBg rounded-full px-3 py-1">
              <span className="text-bluePrimary"><IconMapPin /></span>
              {activity.meta.location}
            </span>
          )}
        </div>

        {/* Confirmation status */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-greenAccent shrink-0" />
          <span className="font-body text-xs text-greenAccent font-medium">Reservación confirmada</span>
        </div>
      </div>
    </div>
  )
}

// ── ActivityCardPending ───────────────────────────────────────────────────────

interface ActivityCardPendingProps {
  activity: Activity
  onAccept: (id: string) => void
  onDelete: (id: string) => void
}

function ActivityCardPending({ activity, onAccept, onDelete }: ActivityCardPendingProps) {
  const iconColor = getCategoryColor(activity.category)
  const iconEl    = getCategoryIcon(activity.category)

  return (
    <div className="bg-white rounded-2xl border border-dashed border-[#E2E8F0] overflow-hidden">
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Pending badge */}
        <span className="absolute top-3 left-3 font-body text-[11px] font-bold text-white bg-purpleMedium rounded-full px-3 py-1">
          POR CONFIRMAR
        </span>
        {/* Price badge */}
        <span className="absolute top-3 right-3 font-body text-xs font-semibold text-white bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          {activity.price}
        </span>
        {/* Category icon circle */}
        <div
          className="absolute left-4 -bottom-4 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E2E8F0]"
          style={{ color: iconColor }}
        >
          {iconEl}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pt-6 pb-4">
        <h3 className="font-heading font-bold text-purpleNavbar text-[15px] mb-1 leading-snug">
          {activity.title}
        </h3>
        <p className="font-body text-xs text-gray500 mb-3 leading-relaxed">{activity.description}</p>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {activity.meta.time && (
            <span className="inline-flex items-center gap-1.5 font-body text-xs text-gray700 bg-neutralBg rounded-full px-3 py-1">
              <span className="text-bluePrimary"><IconClock /></span>
              {activity.meta.time}
            </span>
          )}
          {activity.meta.location && (
            <span className="inline-flex items-center gap-1.5 font-body text-xs text-gray700 bg-neutralBg rounded-full px-3 py-1">
              <span className="text-bluePrimary"><IconMapPin /></span>
              {activity.meta.location}
            </span>
          )}
          {activity.meta.votes !== undefined && (
            <span className="inline-flex items-center gap-1 font-body text-xs text-purpleMedium bg-purpleMedium/10 rounded-full px-3 py-1 font-medium">
              ↑ {activity.meta.votes} votos
            </span>
          )}
        </div>

        {activity.proposedBy && (
          <p className="font-body text-xs text-gray500 italic mb-3">
            Propuesto por {activity.proposedBy}
          </p>
        )}

        {/* Accept / Delete row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAccept(activity.id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 font-body text-sm font-bold text-white bg-bluePrimary rounded-xl h-11 hover:opacity-90 transition-opacity"
          >
            <IconCheck size={14} />
            Aceptar propuesta
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-[#E2E8F0] text-gray500 hover:text-red-500 hover:border-red-200 transition-colors"
            aria-label="Eliminar propuesta"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── AddActivityRow ────────────────────────────────────────────────────────────

function AddActivityRow() {
  return (
    <button className="w-full bg-white border border-dashed border-[#E2E8F0] rounded-2xl h-16 flex flex-col items-center justify-center gap-0.5 hover:border-bluePrimary/50 hover:bg-[#EEF4FF]/50 transition-colors group">
      <div className="flex items-center gap-2">
        <span className="text-gray500 group-hover:text-bluePrimary transition-colors">
          <IconSearch size={15} />
        </span>
        <span className="font-body text-sm font-medium text-gray500 group-hover:text-bluePrimary transition-colors">
          Buscar y proponer actividad
        </span>
      </div>
      <span className="font-body text-[11px] text-gray500/60">
        Vuelos, hoteles, lugares en Google Maps, Amadeus y más
      </span>
    </button>
  )
}

// ── BottomNavbar ──────────────────────────────────────────────────────────────

interface BottomNavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const BOTTOM_TABS = [
  { id: 'buscar',   label: 'Buscar',   icon: <IconSearch size={18} /> },
  {
    id: 'comparar', label: 'Comparar',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'mapas', label: 'Mapas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="2" x2="8" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="16" y1="6" x2="16" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'pagar', label: 'Pagar',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
]

function BottomNavbar({ activeTab, onTabChange }: BottomNavbarProps) {
  return (
    <div className="shrink-0 bg-white border-t border-[#E2E8F0] h-14 flex items-center justify-around px-4">
      {BOTTOM_TABS.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={[
              'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors',
              isActive ? 'text-bluePrimary' : 'text-gray500 hover:text-gray700',
            ].join(' ')}
          >
            {tab.icon}
            <span className={`font-body text-[10px] font-medium ${isActive ? 'text-bluePrimary' : ''}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Chat helpers ─────────────────────────────────────────────────────────────

function getParticipantColor(authorName?: string): string {
  const found = PARTICIPANTS.find((p) => p.name === authorName)
  return found?.color ?? '#7A4FD6'
}

// ── RightPanel ────────────────────────────────────────────────────────────────

interface RightPanelProps {
  chatMessages: ChatMessage[]
  chatInput: string
  onChatChange: (v: string) => void
  onChatSend: () => void
}

function RightPanel({ chatMessages, chatInput, onChatChange, onChatSend }: RightPanelProps) {
  const onlineCount = PARTICIPANTS.filter((p) => p.isOnline).length

  return (
    <aside className="hidden xl:flex flex-col w-[280px] shrink-0 bg-surface-light border-l border-[#E2E8F0] px-5 py-5 overflow-hidden gap-4">
      {/* Participants */}
      <section className="shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="font-body text-[10px] font-semibold text-gray500 uppercase tracking-widest">
            Participantes
          </span>
          <span className="font-body text-[11px] font-semibold text-greenAccent bg-greenAccent/10 rounded-full px-2 py-0.5">
            {onlineCount} en línea
          </span>
        </div>

        {/* Overlapping avatars */}
        <div className="flex -space-x-2 mb-3">
          {PARTICIPANTS.map((p) => (
            <div
              key={p.id}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-body font-bold text-xs shrink-0"
              style={{ backgroundColor: p.color }}
              title={p.name}
            >
              {p.name[0]}
            </div>
          ))}
        </div>

        {/* Participant list */}
        <ul className="flex flex-col gap-2.5">
          {PARTICIPANTS.map((p) => (
            <li key={p.id} className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-body font-bold text-xs shrink-0"
                style={{ backgroundColor: p.color }}
              >
                {p.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs font-semibold text-gray700 truncate leading-none">{p.name}</p>
                <p className="font-body text-[11px] mt-0.5 leading-none" style={{ color: p.color }}>
                  {p.role}
                </p>
              </div>
              {p.isOnline && (
                <span className="w-2 h-2 rounded-full bg-greenAccent shrink-0" />
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Mini map */}
      <section className="shrink-0">
        <p className="font-body text-[10px] font-semibold text-gray500 uppercase tracking-widest mb-2">
          Destino
        </p>
        <div className="relative rounded-xl h-28 overflow-hidden mb-2 bg-[#D4E9F7]">
          {/* Stylised map placeholder */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #B8D9F0 0%, #7EC8E3 40%, #4AA8D8 70%, #2A7DB5 100%)',
            }}
          />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Pin */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center drop-shadow-lg">
              <div className="w-8 h-8 rounded-full bg-bluePrimary flex items-center justify-center shadow-lg">
                <IconMapPin size={14} />
              </div>
              <div className="w-0.5 h-3 bg-bluePrimary" />
            </div>
          </div>
        </div>
        <p className="font-body text-xs font-bold text-purpleNavbar leading-none">Cancún, Q.R.</p>
        <p className="font-body text-[11px] text-gray500 mt-0.5 leading-none">Riviera Maya · México</p>
        <button className="font-body text-[11px] text-bluePrimary mt-1.5 hover:underline">
          Ver en mapa completo →
        </button>
      </section>

      {/* Group chat */}
      <section className="flex flex-col gap-2 flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="font-body text-[10px] font-semibold text-gray500 uppercase tracking-widest">
            Chat del Grupo
          </p>
          {/* Online participant mini-avatars */}
          <div className="flex -space-x-1">
            {PARTICIPANTS.filter((p) => p.isOnline).map((p) => (
              <div
                key={p.id}
                className="w-5 h-5 rounded-full border border-surface-light flex items-center justify-center text-white font-body font-bold text-[9px] shrink-0"
                style={{ backgroundColor: p.color }}
                title={p.name}
              >
                {p.name[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Chat card */}
        <div className="bg-surface border border-purpleMedium/20 rounded-2xl p-4 flex flex-col gap-3 flex-1 min-h-0">
          {/* Messages */}
          <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar — solo mensajes recibidos */}
                {!msg.isOwn && (
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white font-body font-bold text-[10px] mt-4"
                    style={{ backgroundColor: getParticipantColor(msg.author) }}
                  >
                    {msg.author?.[0] ?? '?'}
                  </div>
                )}

                <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  {/* Nombre remitente */}
                  {!msg.isOwn && msg.author && (
                    <span className="font-body text-[10px] text-gray500 mb-0.5 ml-1">
                      {msg.author}
                    </span>
                  )}

                  {/* Burbuja */}
                  <div
                    className={[
                      'font-body text-[13px] px-3 py-2 leading-relaxed',
                      msg.isOwn
                        ? 'text-white rounded-2xl rounded-tr-sm shadow-md'
                        : 'bg-white text-gray700 border border-[#E2E8F0] rounded-2xl rounded-tl-sm shadow-sm',
                    ].join(' ')}
                    style={msg.isOwn ? { background: 'linear-gradient(135deg, #1E6FD9, #7A4FD6)' } : {}}
                  >
                    {msg.text}
                    <p className={`text-[9px] mt-1 text-right leading-none ${msg.isOwn ? 'text-white/50' : 'text-gray500/60'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-purpleMedium/10" />

          {/* Input row */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => onChatChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onChatSend() }}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-white border border-[#E2E8F0] focus:border-bluePrimary rounded-xl px-3 h-9 font-body text-[12px] text-gray700 placeholder-gray500 outline-none shadow-sm transition-colors"
            />
            <button
              onClick={onChatSend}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 hover:opacity-90 transition-opacity shadow-md p-2"
              style={{ background: 'linear-gradient(135deg, #1E6FD9, #7A4FD6)' }}
              aria-label="Enviar mensaje"
            >
              <IconSend size={13} />
            </button>
          </div>
        </div>
      </section>
    </aside>
  )
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />
  )
}

function SkeletonView() {
  return (
    <div className="flex flex-col gap-4 px-6 py-6">
      <SkeletonPulse className="h-52 rounded-2xl" />
      <SkeletonPulse className="h-14 rounded-2xl" />
      <SkeletonPulse className="h-12 rounded-xl" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0]">
          <SkeletonPulse className="h-36 rounded-none" />
          <div className="px-5 py-4 flex flex-col gap-2">
            <SkeletonPulse className="h-4 w-2/3" />
            <SkeletonPulse className="h-3 w-full" />
            <SkeletonPulse className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-bluePrimary/10 flex items-center justify-center mb-4">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-bluePrimary">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="8" y1="18" x2="12" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="font-heading font-bold text-purpleNavbar text-lg mb-2">
        Tu itinerario está vacío
      </h3>
      <p className="font-body text-sm text-gray500 max-w-xs mb-6 leading-relaxed">
        Empieza proponiendo actividades, vuelos u hoteles para este día. El grupo podrá votar y confirmar.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 font-body text-sm font-semibold text-white bg-bluePrimary rounded-xl px-5 py-3 hover:opacity-90 transition-opacity"
      >
        <IconPlus size={14} />
        Proponer primera actividad
      </button>
    </div>
  )
}

// ── ActivitiesContent ─────────────────────────────────────────────────────────

interface ActivitiesContentProps {
  activities: Activity[]
  onAccept: (id: string) => void
  onDelete: (id: string) => void
}

function ActivitiesContent({ activities, onAccept, onDelete }: ActivitiesContentProps) {
  const transport  = activities.filter((a) => a.category === 'transport')
  const lodging    = activities.filter((a) => a.category === 'lodging')
  const acts       = activities.filter((a) => a.category === 'activity')
  const hasPending = acts.some((a) => a.status === 'pending')

  return (
    <div className="flex flex-col gap-4">
      {transport.length > 0 && (
        <section>
          <SectionLabel {...getSectionLabel('transport')} />
          <div className="flex flex-col gap-4">
            {transport.map((a) =>
              a.status === 'confirmed'
                ? <ActivityCardConfirmed key={a.id} activity={a} />
                : <ActivityCardPending key={a.id} activity={a} onAccept={onAccept} onDelete={onDelete} />
            )}
          </div>
        </section>
      )}

      {lodging.length > 0 && (
        <section>
          <SectionLabel {...getSectionLabel('lodging')} />
          <div className="flex flex-col gap-4">
            {lodging.map((a) =>
              a.status === 'confirmed'
                ? <ActivityCardConfirmed key={a.id} activity={a} />
                : <ActivityCardPending key={a.id} activity={a} onAccept={onAccept} onDelete={onDelete} />
            )}
          </div>
        </section>
      )}

      {acts.length > 0 && (
        <section>
          <SectionLabel {...getSectionLabel('activity', hasPending)} />
          <div className="flex flex-col gap-4">
            {acts.map((a) =>
              a.status === 'confirmed'
                ? <ActivityCardConfirmed key={a.id} activity={a} />
                : <ActivityCardPending key={a.id} activity={a} onAccept={onAccept} onDelete={onDelete} />
            )}
          </div>
        </section>
      )}

      <AddActivityRow />
    </div>
  )
}

// ── DashboardPage ─────────────────────────────────────────────────────────────

export function DashboardPage() {
  const [activeDay,    setActiveDay]    = useState(1)
  const [activeTab,    setActiveTab]    = useState('pagar')
  const [isLoading,    setIsLoading]    = useState(false)
  const [activities,   setActivities]   = useState<Activity[]>(ACTIVITIES)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [chatInput,    setChatInput]    = useState('')
  const [sidebarOpen,  setSidebarOpen]  = useState(() => window.innerWidth >= 1024)

  const isEmpty = activities.length === 0

  function handleAccept(id: string) {
    setActivities((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: 'confirmed' as const } : a)
    )
  }

  function handleDelete(id: string) {
    setActivities((prev) => prev.filter((a) => a.id !== id))
  }

  function handleChatSend() {
    const text = chatInput.trim()
    if (!text) return
    const now = new Date()
    const timestamp = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })
    setChatMessages((prev) => [
      ...prev,
      { id: String(Date.now()), text, isOwn: true, author: 'Bryan A.', timestamp },
    ])
    setChatInput('')
  }

  // Demo toggle for skeleton / empty states (dev helper, hidden in UI)
  void setIsLoading

  return (
    <div className="h-screen flex flex-col bg-surface overflow-hidden font-body">
      {/* Fixed top navbar */}
      <Navbar
        variant="dashboard"
        trip={{ name: 'Cancún 2025', subtitle: 'Riviera Maya, México' }}
        user={{ name: 'Bryan A.', role: 'Organizador', initials: 'BA', color: '#1E6FD9' }}
        notificationCount={3}
        isOnline
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      {/* Main layout — three columns */}
      <div className="flex flex-1 overflow-hidden pt-20">
        {/* ── Left sidebar ── */}
        <LeftSidebar activeDay={activeDay} onDayChange={setActiveDay} isOpen={sidebarOpen} />

        {/* ── Central content ── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {isLoading ? (
            <SkeletonView />
          ) : isEmpty ? (
            <EmptyState onAdd={() => {}} />
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-surface">
              <HeroCard activeDay={activeDay} />
              <InfoBanner />
              <TimelineStrip activeDay={activeDay} onDayChange={setActiveDay} />
              <ActivitiesContent
                activities={activities}
                onAccept={handleAccept}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Bottom nav */}
          <BottomNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        </main>

        {/* ── Right panel ── */}
        <RightPanel
          chatMessages={chatMessages}
          chatInput={chatInput}
          onChatChange={setChatInput}
          onChatSend={handleChatSend}
        />
      </div>
    </div>
  )
}
