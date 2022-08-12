import { Inject, NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirebaseModule } from './firebase.module';

import { OverlayContainer } from '@angular/cdk/overlay';
import { MatIconRegistry } from '@angular/material/icon';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FirebaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    overlayContainer: OverlayContainer,
    iconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    overlayContainer.getContainerElement().classList.add('one-dark-theme');
    const port = process.env['PORT'] || 3000;
    const domain = isPlatformServer(platformId) ? `http://localhost:${port}/` : '';
    iconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl(`${domain}assets/icons/mdi.svg`)
    );
    iconRegistry.addSvgIcon(
      'google_logo',
      domSanitizer.bypassSecurityTrustResourceUrl(
        `${domain}assets/icons/google_g_logo.svg`
      )
    );
  }
}
