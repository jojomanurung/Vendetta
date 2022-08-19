import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [ { path: 'shell', component: ShellComponent }];

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    RouterModule.forRoot(routes),
  ],
  bootstrap: [AppComponent],
  declarations: [
    ShellComponent
  ],
})
export class AppServerModule {}
