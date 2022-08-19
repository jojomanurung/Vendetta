import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@interfaces/user.type';
import { defer, forkJoin, from, lastValueFrom, Observable, of } from 'rxjs';
import { concatMap, first, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
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

  createUserWithEmail(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  sendEmailVerification(user: firebase.User) {
    return user?.sendEmailVerification();
  }

  verifyEmail(actionCode: string) {
    return this.afAuth.applyActionCode(actionCode);
  }

  sendPasswordReset(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  confirmPasswordReset(code: string, newPassword: string) {
    return this.afAuth.confirmPasswordReset(code, newPassword);
  }

  signInWithEmail(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithRedirect(provider);
  }

  emailSignUp(email: string, password: string) {
    const credential = from(this.createUserWithEmail(email, password));
    return credential.pipe(
      concatMap((val) =>
        forkJoin({
          update: defer(() => from(this.updateUserData(val.user!))),
          send: defer(() => from(this.sendEmailVerification(val.user!))),
        })
      )
    );
  }

  emailSignIn(email: string, password: string) {
    const credential = from(this.signInWithEmail(email, password));
    return credential.pipe(
      concatMap((val) => defer(() => from(this.updateUserData(val.user!))))
    );
  }

  googleSignIn() {
    const redirect = from(this.signInWithGoogle());
    return redirect.pipe(
      concatMap(() => defer(() => from(this.afAuth.getRedirectResult()))),
      concatMap((val) => defer(() => from(this.updateUserData(val.user!))))
    );
  }

  /**
   * Sets user data to firestore on login
   */
  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.store.doc(
      `users/${user.uid}`
    );

    const data: User = _.cloneDeep(user);
    data.permission = {
      create: true,
      read: true,
      update: true,
      delete: true,
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }
}
