import { Injectable } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { concatMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { User } from '@interfaces/user.type';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  docData,
  docSnapshots,
  Firestore,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatsRef = collection(this.store, 'chats');

  constructor(
    private store: Firestore,
    private authService: AuthService,
    private router: Router
  ) {}

  get(chatId: string) {
    const docRef = doc(this.chatsRef, chatId);
    const snapShot = docSnapshots(docRef);
    return snapShot.pipe(
      map((doc) => {
        if (doc.exists()) {
          return { id: doc.id, ...doc.data() };
        } else {
          throw new Error('Chat not found');
        }
      })
    );
  }

  async create() {
    const user = await this.authService.getUser();
    const { uid } = user!;

    const data = {
      uid,
      createdAt: serverTimestamp(),
      count: 0,
      messages: [],
    };

    const docRef = await addDoc(this.chatsRef, data);

    return this.router.navigate(['chats', docRef.id]);
  }

  async sendMessage(chatId: string, content: any) {
    const user = await this.authService.getUser();
    const { uid } = user!;

    const data = {
      uid,
      content,
      createdAt: Date.now(),
    };

    if (uid) {
      const ref = doc(this.chatsRef, chatId);
      return updateDoc(ref, {
        messages: arrayUnion(data),
      });
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat: any;
    let joinKeys: any = {};

    return chat$.pipe(
      concatMap((collection) => {
        chat = collection;

        // User IDs
        const uids = collection.messages.map((v: any) => v.uid);

        // Firestore User Doc Reads
        const userDocs: Observable<any>[] = uids.map((u: string) => {
          const docRef = doc(this.store, `users/${u}`);
          return docData(docRef);
        });
        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map((arr) => {
        arr.forEach((v: User) => (joinKeys[v.uid] = v));
        chat.messages = chat.messages.map((v: any) => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }
}
