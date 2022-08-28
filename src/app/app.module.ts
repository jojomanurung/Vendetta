import { ErrorHandler, Inject, NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirebaseModule } from './firebase.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { OverlayContainer } from '@angular/cdk/overlay';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { ErrorService } from '@services/error/error.service';
import { MainComponent } from './main/main.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [AppComponent, MainComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FirebaseModule,
    SweetAlert2Module.forRoot({
      provideSwal: () => import('sweetalert2/dist/sweetalert2.js'),
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  providers: [
    { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    { provide: ErrorHandler, useClass: ErrorService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    overlayContainer: OverlayContainer,
    iconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    const port = process.env['PORT'] || 3000;
    const domain = isPlatformServer(platformId)
      ? `http://localhost:${port}/`
      : '';
    iconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl(
        `${domain}assets/icons/mdi.svg`
      )
    );
    iconRegistry.addSvgIcon(
      'google_logo',
      domSanitizer.bypassSecurityTrustResourceUrl(
        `${domain}assets/icons/google_g_logo.svg`
      )
    );
  }
}
