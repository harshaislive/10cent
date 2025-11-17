// Typeform global type definitions
interface TypeformPopup {
  open(): void
  close(): void
}

interface TypeformMakeOptions {
  mode?: 'popup' | 'drawer' | 'side-panel'
  hideHeaders?: boolean
  hideFooter?: boolean
  onSubmit?: () => void
  onClose?: () => void
  [key: string]: any
}

interface TypeformCreatePopupButtonOptions {
  formId: string
  buttonProps?: {
    style?: {
      display?: string
      [key: string]: any
    }
  }
  hidden?: Record<string, any>
  transitiveSearchParams?: boolean
  enableSandbox?: boolean
  [key: string]: any
}

interface TypeformGlobal {
  makePopup?: (url: string, options?: TypeformMakeOptions) => TypeformPopup
  createPopupButton?: (element: HTMLElement, options: TypeformCreatePopupButtonOptions) => void
  [key: string]: any
}

declare global {
  interface Window {
    tf?: TypeformGlobal
  }
}

export {}