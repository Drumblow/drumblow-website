import { getTranslations } from "next-intl/server"
import { getAllProjects } from "@/lib/projetos/loader"
import ProjetosClient from "./projetos-client"
import { Suspense } from "react"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Projects" })

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  }
}

export default async function ProjetosPage() {
  const t = await getTranslations("Projects")
  const projects = await getAllProjects()

  return (
    <div className="container py-16">
      <div className="mb-12">
        <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">{t("label")}</div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{t("title")}</h1>
        <p className="text-xl text-gray-500 max-w-3xl">
          {t("description")}
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-8">{t("loading")}</div>}>
        <ProjetosClient projects={projects} />
      </Suspense>
    </div>
  )
}
