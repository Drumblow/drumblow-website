"use client"

import { Link } from "@/i18n/navigation"
import { useState } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations("Header")

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/#servicos", label: t("services") },
    { href: "/projetos", label: t("projects") },
    { href: "/#processo", label: t("process") },
    { href: "/about", label: t("about") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>
            </svg>
          </div>
          <span className="text-gray-900">DRUMBLOW</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href as any} 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <button 
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {t("cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
