import { useState, useEffect } from 'react'
import { Logo } from '../../ui/Logo'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NavLink {
  href: string
  label: string
}

export interface TripInfo {
  name: string
  subtitle: string
}

export interface NavUserInfo {
  name: string
  role: string
  initials: string
  color?: string
}

interface LandingNavbarProps {
  variant: 'landing'
  navLinks?: NavLink[]
}

interface DashboardNavbarProps {
  variant: 'dashboard'
  trip?: TripInfo
  user?: NavUserInfo
  notificationCount?: number
  isOnline?: boolean
  onToggleSidebar?: () => void
  onTripSelect?: () => void
  onNotifications?: () => void
  onUserMenu?: () => void
}

export type NavbarProps = LandingNavbarProps | DashboardNavbarProps

// ── Shared icons ──────────────────────────────────────────────────────────────

function IconChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

// ── Landing variant ───────────────────────────────────────────────────────────

const DEFAULT_LANDING_LINKS: NavLink[] = [
  { href: '#features', label: 'Explorar' },
  { href: '#how',      label: 'Cómo funciona' },
]

function LandingDesktopRight() {
  return (
    <div className="ml-auto flex items-center gap-3">
      <a
        href="#"
        className="hidden md:block font-body text-sm text-gray500 hover:text-purpleNavbar transition-colors"
      >
        Mis viajes
      </a>
      <a
        href="/login"
        className="font-body text-sm border border-[#E2E8F0] text-gray700 rounded-lg px-4 py-1.5 hover:border-bluePrimary hover:text-bluePrimary transition-colors"
      >
        Iniciar sesión
      </a>
      <a
        href="/register"
        className="font-body text-sm font-medium bg-bluePrimary text-white rounded-full px-4 py-1.5 hover:opacity-90 transition-opacity"
      >
        Crear cuenta
      </a>
    </div>
  )
}

function LandingMobileMenu({ navLinks }: { navLinks: NavLink[] }) {
  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#E2E8F0] shadow-lg px-6 py-4 flex flex-col gap-3 z-40">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="font-body text-sm text-gray500 hover:text-purpleNavbar py-1 transition-colors"
        >
          {link.label}
        </a>
      ))}
      <div className="border-t border-[#E2E8F0] pt-3 flex flex-col gap-2">
        <a
          href="/login"
          className="font-body text-sm text-center border border-[#E2E8F0] text-gray700 rounded-lg px-4 py-2 hover:border-bluePrimary hover:text-bluePrimary transition-colors"
        >
          Iniciar sesión
        </a>
        <a
          href="/register"
          className="font-body text-sm font-medium text-center bg-bluePrimary text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Crear cuenta
        </a>
      </div>
    </div>
  )
}

function LandingNavContent({
  navLinks,
  mobileOpen,
}: {
  navLinks: NavLink[]
  mobileOpen: boolean
}) {
  return (
    <>
      <div className="hidden md:flex items-center gap-6 ml-8">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-body text-sm text-gray500 hover:text-purpleNavbar transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
      <LandingDesktopRight />
      {mobileOpen && <LandingMobileMenu navLinks={navLinks} />}
    </>
  )
}

// ── Dashboard variant ─────────────────────────────────────────────────────────

const DEFAULT_TRIP: TripInfo    = { name: 'Cancún 2025', subtitle: 'Riviera Maya, México' }
const DEFAULT_USER: NavUserInfo = { name: 'Bryan A.', role: 'Organizador', initials: 'BA', color: '#1E6FD9' }

function DashboardMobileMenu({ trip, user }: { trip: TripInfo; user: NavUserInfo }) {
  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-purpleNavbar border-b border-white/10 shadow-lg px-6 py-4 flex flex-col gap-4 z-40">
      {/* Trip info */}
      <div className="flex flex-col gap-1 py-2 border-b border-white/10">
        <p className="font-body text-[10px] font-semibold text-white/40 uppercase tracking-widest">
          Viaje activo
        </p>
        <p className="font-body text-sm font-bold text-white">{trip.name}</p>
        <p className="font-body text-xs text-white/60">{trip.subtitle}</p>
      </div>
      {/* User info */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-body font-bold text-sm shrink-0"
          style={{ backgroundColor: user.color ?? '#1E6FD9' }}
        >
          {user.initials}
        </div>
        <div>
          <p className="font-body text-sm font-bold text-white">{user.name}</p>
          <p className="font-body text-xs text-white/50">{user.role}</p>
        </div>
      </div>
    </div>
  )
}

interface DashboardContentProps {
  trip: TripInfo
  user: NavUserInfo
  notificationCount: number
  isOnline: boolean
  mobileOpen: boolean
  onTripSelect?: () => void
  onNotifications?: () => void
  onUserMenu?: () => void
}

function DashboardNavContent({
  trip,
  user,
  notificationCount,
  isOnline,
  mobileOpen,
  onTripSelect,
  onNotifications,
  onUserMenu,
}: DashboardContentProps) {
  return (
    <>
      {/* Trip selector — absolutely centered */}
      <button
        onClick={onTripSelect}
        className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 hover:bg-white/20 transition-colors"
        aria-label="Seleccionar viaje"
      >
        <span className="text-white/60 shrink-0">
          <IconGlobe />
        </span>
        <div className="flex flex-col items-start">
          <span className="font-body text-sm font-bold text-white leading-tight">{trip.name}</span>
          <span className="font-body text-[11px] text-white/60 leading-tight">{trip.subtitle}</span>
        </div>
        <span className="text-white/60 ml-0.5 shrink-0">
          <IconChevronDown />
        </span>
      </button>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-1">
        {/* Notifications bell */}
        <button
          onClick={onNotifications}
          className="relative hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={`Notificaciones${notificationCount > 0 ? ` — ${notificationCount} sin leer` : ''}`}
        >
          <IconBell />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-redError text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <span className="hidden md:block w-px h-5 bg-white/10 mx-1" />

        {/* Online chip */}
        {isOnline && (
          <div className="hidden md:flex items-center gap-1.5 bg-greenAccent/20 border border-greenAccent/30 rounded-full px-3 py-1">
            <span className="relative flex w-2 h-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-greenAccent opacity-75" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-greenAccent" />
            </span>
            <span className="font-body text-xs font-medium text-greenAccent">En línea</span>
          </div>
        )}

        {/* Divider */}
        <span className="hidden md:block w-px h-5 bg-white/10 mx-1" />

        {/* User info */}
        <button
          onClick={onUserMenu}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/10 transition-colors"
          aria-label="Menú de usuario"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-body font-bold text-xs shrink-0"
            style={{ backgroundColor: user.color ?? '#1E6FD9' }}
          >
            {user.initials}
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="font-body text-[13px] font-bold text-white leading-tight">{user.name}</span>
            <span className="font-body text-[11px] text-white/50 leading-tight">{user.role}</span>
          </div>
          <span className="hidden md:block text-white/50">
            <IconChevronDown />
          </span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && <DashboardMobileMenu trip={trip} user={user} />}
    </>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────

export function Navbar(props: NavbarProps) {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isDashboard = props.variant === 'dashboard'

  const navBase = 'fixed top-0 left-0 right-0 z-50 h-20 px-6 flex items-center transition-shadow duration-300'
  const navTheme = isDashboard
    ? 'bg-purpleNavbar border-b border-white/10'
    : 'bg-white border-b border-[#E2E8F0]'
  const navShadow = scrolled
    ? isDashboard ? 'shadow-[0_2px_12px_rgba(0,0,0,0.4)]' : 'shadow-sm'
    : ''

  const hamburgerTheme = isDashboard
    ? 'text-white/70 hover:text-white hover:bg-white/10'
    : 'text-gray700 hover:bg-neutralBg'

  return (
    <nav className={[navBase, navTheme, navShadow].join(' ')}>
      {/* Logo */}
      <a href={isDashboard ? '/dashboard' : '/'} className="shrink-0" aria-label="Ithera">
        <Logo variant={isDashboard ? 'white' : 'color'} height={64} />
      </a>

      {/* Sidebar toggle — dashboard only, always visible */}
      {isDashboard && (
        <button
          onClick={(props as DashboardNavbarProps).onToggleSidebar}
          className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-2 shrink-0"
          aria-label="Alternar sidebar"
        >
          <IconMenu />
        </button>
      )}

      {/* Variant content */}
      {isDashboard ? (
        <DashboardNavContent
          trip={props.trip ?? DEFAULT_TRIP}
          user={props.user ?? DEFAULT_USER}
          notificationCount={props.notificationCount ?? 0}
          isOnline={props.isOnline ?? true}
          mobileOpen={mobileOpen}
          onTripSelect={props.onTripSelect}
          onNotifications={props.onNotifications}
          onUserMenu={props.onUserMenu}
        />
      ) : (
        <LandingNavContent
          navLinks={props.navLinks ?? DEFAULT_LANDING_LINKS}
          mobileOpen={mobileOpen}
        />
      )}

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className={`md:hidden ml-auto p-2 rounded-lg transition-colors ${hamburgerTheme}`}
        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <IconClose /> : <IconMenu />}
      </button>
    </nav>
  )
}
