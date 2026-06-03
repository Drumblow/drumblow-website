'use client'

import { useTranslations } from "next-intl"
import { Button } from '@/components/ui/button'

interface FilterBarProps {
  allStacks: string[]
  selectedStacks: string[]
  onToggleStack: (stack: string) => void
  selectedStatus: 'all' | 'Ativo' | 'Arquivado'
  onStatusChange: (status: 'all' | 'Ativo' | 'Arquivado') => void
}

export function FilterBar({
  allStacks,
  selectedStacks,
  onToggleStack,
  selectedStatus,
  onStatusChange,
}: FilterBarProps) {
  const t = useTranslations("Projects")

  return (
    <div className="mb-8 flex flex-wrap gap-4 items-center text-gray-600">
      <div>
        <span className="text-sm font-medium mr-2">{t("filter_stacks")}</span>
        {allStacks.map(stack => (
          <button
            key={stack}
            onClick={() => onToggleStack(stack)}
            className={`text-xs mr-2 mb-1 px-3 py-1 rounded-full border transition-colors ${
              selectedStacks.includes(stack)
                ? 'bg-orange-500 text-white border-orange-500'
                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
            }`}
          >
            {stack}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium mr-1 text-gray-600">{t("filter_status")}</span>
        <Button
          variant={selectedStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange('all')}
        >
          {t("filter_all")}
        </Button>
        <Button
          variant={selectedStatus === 'Ativo' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange('Ativo')}
          className={selectedStatus === 'Ativo' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          {t("filter_actives")}
        </Button>
        <Button
          variant={selectedStatus === 'Arquivado' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange('Arquivado')}
          className={selectedStatus === 'Arquivado' ? 'bg-amber-600 hover:bg-amber-700' : ''}
        >
          {t("filter_archived")}
        </Button>
      </div>
    </div>
  )
}
