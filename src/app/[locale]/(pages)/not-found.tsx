import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

export default function NotFound() {
  const t = useTranslations("NotFound")

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">{t("title")}</h2>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div>
          <Link href="/">
            <Button>{t("back_home")}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
