import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@interfaces/user.type';
import { defer, from, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Firestore, doc, setDoc, docSnapshots } from '@angular/fire/firestore';
import {
  applyActionCode,
  Auth,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private store: Firestore,
    private router: Router
  ) {}

  /**
   * Get current user data
   * @note Use this if you need user data once
   * @returns Promise User
   */
  getUser() {
    return new Promise<User | null>((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Get current user data from collection.
   * @note Use this if you want to listen every user state
   * @returns Observable User
   */
  getUser$() {
    return new Observable<any>((subs) => {
      onAuthStateChanged(this.auth, (auth) => {
        if (auth) {
          const userRef = doc(this.store, `users/${auth.uid}`);
          const user$ = docSnapshots(userRef);
          const unsubs = user$.pipe(map((val) => val.data())).subscribe((al) => {
            subs.next(al);
            unsubs.unsubscribe();
            subs.complete();
          });
        } else {
          subs.next(null);
        }
      });
    });
  }

  private createUserWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  private sendEmailVerification() {
    return sendEmailVerification(this.auth.currentUser!);
  }

  private signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithRedirect(this.auth, provider);
  }

  emailSignUp(email: string, password: string) {
    const credential = defer(() =>
      from(this.createUserWithEmail(email, password))
    );
    return credential.pipe(
      concatMap((val) => defer(() => from(this.updateUserData(val.user)))),
      concatMap(() => defer(() => from(this.sendEmailVerification()))),
      concatMap(() => defer(() => from(this.signOut(true))))
    );
  }

  emailSignIn(email: string, password: string) {
    const credential = defer(() => from(this.signInWithEmail(email, password)));
    return credential.pipe(
      concatMap((val) => defer(() => from(this.updateUserData(val.user))))
    );
  }

  getRedirectResult() {
    const redirect = defer(() => from(getRedirectResult(this.auth)));
    return redirect.pipe(
      concatMap((val) => {
        if (val && val.user) {
          return defer(() => from(this.updateUserData(val.user)));
        } else {
          return of(null);
        }
      })
    );
  }

  verifyEmail(actionCode: string) {
    return applyActionCode(this.auth, actionCode);
  }

  sendPasswordReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  confirmPasswordReset(code: string, newPassword: string) {
    return confirmPasswordReset(this.auth, code, newPassword);
  }

  /**
   * Sets user data to firestore on login
   */
  private updateUserData(user: User) {
    const userRef = doc(this.store, `users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      providerId: user.providerId,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
    };

    data.permission = {
      create: true,
      read: true,
      update: true,
      delete: true,
    };

    return setDoc(userRef, data);
  }

  async signOut(firstSignup?: boolean) {
    await signOut(this.auth);
    if (!firstSignup) {
      this.router.navigate(['/']);
    }
  }
}
