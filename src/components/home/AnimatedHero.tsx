'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations } from "next-intl"
import { Button } from '@/components/ui/button'

export default function AnimatedHero() {
  const t = useTranslations("Home")

  return (
    <motion.section
      className="relative py-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container flex flex-col items-center text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold max-w-3xl">
          {t("animated_hero_title")}
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl">
          {t("animated_hero_desc")}
        </p>

        <div className="flex gap-4">
          <Link href="/projetos">
            <Button size="lg">{t("animated_hero_cta_projects")}</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">{t("animated_hero_cta_contact")}</Button>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
