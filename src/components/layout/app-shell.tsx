"use client";

import { Bell, CalendarDays, ClipboardList, FileText, LayoutDashboard, Menu, Package, ReceiptText, Search, Settings, ShieldCheck, Stethoscope, Users, X } from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import Link from "next/link";
import type { UserRole } from "@/types";
import { classNames } from "@/lib/utils";

type AppShellProps = PropsWithChildren<{ activeItem: string; role: UserRole; userName: string; onRoleChange: (role: UserRole) => void }>;
type NavItem = { label: string; icon: typeof LayoutDashboard; href?: string };

const navigation: Record<UserRole, NavItem[]> = {
  admin: [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }, { label: "Calendar", icon: CalendarDays, href: "/calendar" }, { label: "Patients", icon: Users, href: "/patients/mariam-adel" }, { label: "Doctors", icon: Stethoscope, href: "/doctors" }, { label: "Services", icon: ClipboardList }, { label: "Billing", icon: ReceiptText, href: "/billing" }, { label: "Inventory", icon: Package, href: "/inventory" }, { label: "Notifications", icon: Bell, href: "/notifications" }, { label: "Reports", icon: FileText, href: "/reports" }, { label: "Settings", icon: Settings, href: "/settings" }, { label: "Audit logs", icon: ShieldCheck, href: "/audit-logs" }],
  receptionist: [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard?role=receptionist" }, { label: "Calendar", icon: CalendarDays, href: "/calendar?role=receptionist" }, { label: "Patients", icon: Users, href: "/patients/mariam-adel?role=receptionist" }, { label: "Billing", icon: ReceiptText, href: "/billing?role=receptionist" }, { label: "Reports", icon: FileText, href: "/reports?role=receptionist" }],
  dentist: [{ label: "Today", icon: LayoutDashboard, href: "/dashboard?role=dentist" }, { label: "Calendar", icon: CalendarDays, href: "/calendar?role=dentist" }, { label: "Patients", icon: Users, href: "/patients/mariam-adel?role=dentist" }, { label: "Clinical records", icon: ClipboardList }, { label: "Treatment plans", icon: FileText }],
};

export function AppShell({ activeItem, children, role, userName, onRoleChange }: AppShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const sidebar = (
    <aside className="app-sidebar" aria-label="Primary navigation">
      <div className="app-sidebar__brand"><span className="app-sidebar__mark"><Stethoscope aria-hidden="true" /></span><span>DCMS</span><button className="sidebar-close" type="button" onClick={() => setIsMobileOpen(false)} aria-label="Close navigation"><X aria-hidden="true" /></button></div>
      <nav className="sidebar-nav">
        {navigation[role].map(({ href, icon: Icon, label }) => href ? <Link key={label} href={href} onClick={() => setIsMobileOpen(false)} className={classNames("sidebar-nav__item", activeItem === label && "sidebar-nav__item--active")} aria-current={activeItem === label ? "page" : undefined}><Icon aria-hidden="true" /><span>{label}</span></Link> : <button key={label} className="sidebar-nav__item" type="button"><Icon aria-hidden="true" /><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-footer"><span className="sidebar-footer__dot" aria-hidden="true" />Clinic day in progress</div>
    </aside>
  );

  return (
    <div className="app-shell">
      <div className="app-shell__desktop-sidebar">{sidebar}</div>
      <div className={classNames("mobile-nav", isMobileOpen && "mobile-nav--open")}><button className="mobile-nav__backdrop" type="button" aria-label="Close navigation" onClick={() => setIsMobileOpen(false)} />{sidebar}</div>
      <section className="app-shell__content">
        <header className="app-header">
          <button className="menu-button" type="button" onClick={() => setIsMobileOpen(true)} aria-label="Open navigation"><Menu aria-hidden="true" /></button>
          <label className="global-search"><Search aria-hidden="true" /><input type="search" placeholder="Search patients by name or mobile" aria-label="Search patients" /></label>
          <div className="app-header__actions"><button className="icon-button" type="button" aria-label="Notifications"><Bell aria-hidden="true" /><span className="notification-dot" /></button><select className="role-switcher" aria-label="Demo role selector" value={role} onChange={(event) => onRoleChange(event.target.value as UserRole)}><option value="admin">Demo: Admin</option><option value="receptionist">Demo: Receptionist</option><option value="dentist">Demo: Dentist</option></select><button className="account-summary" type="button" aria-label={`${userName}, ${roleLabel} account menu`}><span className="account-avatar">{userName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span className="account-summary__text"><strong>{userName}</strong><small>{roleLabel}</small></span></button></div>
        </header>
        <main className="app-main">{children}</main>
      </section>
    </div>
  );
}
