import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from "firebase/auth";
import { Router } from '@angular/router';
import { User } from '@interface/user/user.type';
import { lastValueFrom, Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$!: Observable<User | null | undefined>;

  constructor(
    private afAuth: AngularFireAuth,
    private store: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          return this.store.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  getUser() {
    const user = this.afAuth.authState.pipe(first());
    return lastValueFrom(user);
  }

  async emailSignUp(email: string, password: string) {
    const credential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = credential.user;
    if (user) {
      this.updateUserData(user);
    }
  }

  async emailSignIn(email: string, password: string) {
    const credential = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );
    const user = credential.user;
    if (user) return this.updateUserData(user);
  }

  async googleSignIn() {
    const provider = new GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    const user = credential.user;
    if (user) return this.updateUserData(user);
  }

  private updateUserData(user: User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.store.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      providerId: user.providerId,
      permission: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    };

    return userRef.set(data, { merge: true });
  }

  sendResetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}
