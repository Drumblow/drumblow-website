import { getTranslations } from "next-intl/server"

export default async function AboutPage() {
  const t = await getTranslations("About")

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">{t("title")}</h1>

      <div className="grid gap-16">
        <section>
          <h2 className="text-2xl font-bold mb-4">{t("who_we_are")}</h2>
          <p className="text-lg text-muted-foreground mb-4">
            {t("who_we_are_p1")}
          </p>
          <p className="text-muted-foreground">
            {t("who_we_are_p2")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("approach_title")}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{t("quality_title")}</h3>
              <p className="text-gray-500">
                {t("quality_desc")}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{t("tech_title")}</h3>
              <p className="text-gray-500">
                {t("tech_desc")}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{t("transparency_title")}</h3>
              <p className="text-gray-500">
                {t("transparency_desc")}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{t("metrics_title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="text-4xl font-bold gradient-text">78+</div>
              <div className="text-sm text-gray-500 mt-1">{t("metric_migrations")}</div>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="text-4xl font-bold gradient-text">20k+</div>
              <div className="text-sm text-gray-500 mt-1">{t("metric_tests")}</div>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="text-4xl font-bold gradient-text">96k</div>
              <div className="text-sm text-gray-500 mt-1">{t("metric_loc")}</div>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="text-4xl font-bold gradient-text">3</div>
              <div className="text-sm text-gray-500 mt-1">{t("metric_languages")}</div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {t("metrics_footer")}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t("tech_stack_title")}</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              "Rust (Axum / Actix-Web + SQLx)",
              "Flutter (mobile + web + desktop)",
              "Next.js 16 + TypeScript + Tailwind 4",
              "PostgreSQL • Stripe • Canada Post • integrations"
            ].map((tech) => (
              <div key={tech} className="p-4 rounded-xl border border-gray-100 bg-white text-center text-sm text-gray-600 hover:border-orange-200 transition-colors shadow-sm">
                {tech}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            {t("tech_stack_infra")}
          </p>
        </section>
      </div>
    </div>
  )
}
