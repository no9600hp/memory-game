export function setBase(): void {
  let base: HTMLBaseElement
  let location: string

  base = window.document.querySelector('base')
  location = window.location.pathname

  if (!base) {
    base = document.createElement('base')
    document.head.prepend(base)
  }
  base.href = location
}
