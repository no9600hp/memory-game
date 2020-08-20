import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { environment } from './environments/environment'
import { RootModule } from './root/root.module'
// import { setBase } from './set-base/set-base'

// setBase()

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic()
  .bootstrapModule<RootModule>(RootModule)
  .catch<void>((error): void => {
    console.error(error)
  })
