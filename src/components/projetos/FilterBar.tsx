'use client'

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
  return (
    <div className="mb-8 flex flex-wrap gap-4 items-center">
      <div>
        <span className="text-sm font-medium mr-2">Stacks:</span>
        {allStacks.map(stack => (
          <button
            key={stack}
            onClick={() => onToggleStack(stack)}
            className={`text-xs mr-2 mb-1 px-3 py-1 rounded-full border transition-colors ${
              selectedStacks.includes(stack) 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'hover:bg-muted'
            }`}
          >
            {stack}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium mr-1">Status:</span>
        <Button 
          variant={selectedStatus === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onStatusChange('all')}
        >
          Todos
        </Button>
        <Button 
          variant={selectedStatus === 'Ativo' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onStatusChange('Ativo')}
          className={selectedStatus === 'Ativo' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          Ativos
        </Button>
        <Button 
          variant={selectedStatus === 'Arquivado' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => onStatusChange('Arquivado')}
          className={selectedStatus === 'Arquivado' ? 'bg-amber-600 hover:bg-amber-700' : ''}
        >
          Arquivados
        </Button>
      </div>
    </div>
  )
}
