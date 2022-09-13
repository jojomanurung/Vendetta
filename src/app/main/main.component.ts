import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ChatService } from '@services/chat/chat.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'v-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  @ViewChild('primaryDrawer') primaryDrawer!: MatSidenav;
  logo = '../../assets/images/logo.png';
  primaryMenu = [
    {
      icon_active: 'chat',
      icon_default: 'chat-outline',
      name: 'message'
    },
    {
      icon_active: 'account-multiple',
      icon_default: 'account-multiple-outline',
      name: 'people'
    },
    {
      icon_active: 'cog',
      icon_default: 'cog-outline',
      name: 'setting'
    },
  ];
  selectedPrimaryMenu = 'message';

  openedDrawer = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private chat: ChatService) {}

  async createChat() {
    await this.chat.create();
  }

  selectPrimaryMenu(name: string) {
    this.selectedPrimaryMenu = name;

  }

  openState() {
    this.openedDrawer = !this.openedDrawer;
  }

}
