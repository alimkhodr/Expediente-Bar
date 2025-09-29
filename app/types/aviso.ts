export interface AvisoAction {
  trailingIcon: string
  label: string
  color: string
  variant: string
  link: string
}

export interface Aviso {
  title: string
  description: string
  avatar: {
    src: string
    alt: string
  }
  days: string[]
  status: boolean
  actions?: AvisoAction[]
}
