import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

/**
 * ### Put feature or app that need navigation and toolbar here
 * Main component contains navigation and toolbar.
 * Our core feature should be rendered inside main component.
 * This is to avoid route that need different view rendered
 * inside navigation and toolbar.
 */
const main: Routes = [
  {
    path: 'chats',
    loadChildren: () =>
      import('./chat/chat.module').then((m) => m.ChatModule),
  }
];

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [...main],
  },
  {
    path: 'session',
    loadChildren: () =>
      import('./sessions/sessions.module').then((m) => m.SessionsModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
