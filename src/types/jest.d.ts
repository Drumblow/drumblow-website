import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveClass(className: string): R
      toHaveStyle(css: Record<string, any>): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveTextContent(text: string | RegExp): R
      toHaveValue(value: string | string[] | number): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toBeRequired(): R
      toBeValid(): R
      toBeInvalid(): R
      toBeEmptyDOMElement(): R
      toHaveFocus(): R
      toContainElement(element: HTMLElement | null): R
      toContainHTML(html: string): R
    }
  }
}