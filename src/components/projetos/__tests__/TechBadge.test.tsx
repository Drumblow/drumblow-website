import { render, screen } from '@testing-library/react'
import { TechBadge } from '../TechBadge'

describe('TechBadge', () => {
  it('renders tech name correctly', () => {
    render(<TechBadge tech="Rust" />)
    const badge = screen.getByText('Rust')
    expect(badge).toBeInTheDocument()
  })
})