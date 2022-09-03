import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@interfaces/user.type';
import { BehaviorSubject, defer, from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
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
  private _userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  userSubject = this._userSubject.asObservable();

  constructor(
    private auth: Auth,
    private store: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const userRef = doc(this.store, `users/${user.uid}`);
        const user$ = docSnapshots(userRef);
        this._userSubject.next(user$);
      } else {
        this._userSubject.next(null);
      }
    });
  }

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
        console.log(val);
        if (val && val.user) {
          return defer(() => from(this.updateUserData(val.user)));
        } else {
          return of(null)
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
