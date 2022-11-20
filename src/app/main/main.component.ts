import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ChatService } from '@services/chat/chat.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SubSink } from 'subsink2';

@Component({
  selector: 'v-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
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

  isHandset: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private chat: ChatService) {}

  ngOnInit(): void {
    this.subs.sink = this.isHandset$.subscribe((resp) => this.isHandset = resp);
  }

  async createChat() {
    await this.chat.create();
  }

  selectPrimaryMenu(name: string) {
    this.selectedPrimaryMenu = name;
    if (this.isHandset) {
      this.primaryDrawer.toggle();
    }
  }

  openState() {
    this.openedDrawer = !this.openedDrawer;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
