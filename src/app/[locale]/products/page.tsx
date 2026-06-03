import Link from 'next/link'
import { getTranslations } from "next-intl/server"
import { Button } from '@/components/ui/button'

export default async function ProductsPage() {
  const t = await getTranslations("Products")

  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
        {t("description")}
      </p>

      <Link href="/projetos">
        <Button size="lg">{t("cta")} →</Button>
      </Link>

      <div className="mt-12 text-sm text-muted-foreground">
        {t("footer")}
      </div>
    </div>
  )
}
