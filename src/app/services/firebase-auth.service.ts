import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  constructor(public auth: AngularFireAuth) { }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email,password);
  }
  logout() {
    this.auth.signOut();
  }
  registrar(email: string, password: string){
   return this.auth.createUserWithEmailAndPassword(email,password);
  }

}
