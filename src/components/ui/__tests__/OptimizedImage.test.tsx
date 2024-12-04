import { render, screen } from '@testing-library/react'
import { OptimizedImage } from '../OptimizedImage'

describe('OptimizedImage', () => {
  it('renders with correct props', () => {
    render(
      <OptimizedImage
        src="/test.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    )

    const img = screen.getByAltText('Test image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', expect.stringContaining('test.jpg'))
  })

  it('applies loading blur effect', () => {
    render(
      <OptimizedImage
        src="/test.jpg"
        alt="Test image"
        width={400}
        height={300}
      />
    )

    const img = screen.getByAltText('Test image')
    expect(img.className).toContain('blur-2xl')
  })
})