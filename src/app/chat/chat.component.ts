import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ChatService } from '@services/chat/chat.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chat$: Observable<any> = new Observable();
  newMsg!: string;

  constructor(
    public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const chatId = this.route.snapshot.paramMap.get('id');
    if (chatId) {
      const source = this.cs.get(chatId);
      this.chat$ = this.cs.joinUsers(source);
    }
  }

  submit(chatId: string) {
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

  trackByCreated(i: any, msg: any) {
    return msg.createdAt;
  }
}
