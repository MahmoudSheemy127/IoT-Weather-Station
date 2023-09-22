import { Injectable } from '@angular/core';
// import { signInWithEmailAndPassword, Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  UserData: any

  constructor(public afs: AngularFireAuth, private router: Router) {

    this.afs.authState.subscribe((user) => {
      if(user)
      {
        this.UserData = user;
        localStorage.setItem('user',JSON.stringify(this.UserData));
        JSON.parse(localStorage.getItem('user')!)
        this.router.navigate(['/dashboard']);
      }
      else
      {
        localStorage.setItem('user','null');
        JSON.parse(localStorage.getItem('user')!)
      }
    })
  }

  //check if user is authenticated
  getLoggedIn(): boolean 
  {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user != null ? true : false;
  }




   //login method
   login(email: string, password: string){
    return this.afs.signInWithEmailAndPassword(email,password).then((result: any) => {
      this.UserData = result.user;
      this.afs.authState.subscribe((user) => {
        if (user) {
          this.router.navigate(['dashboard']);
        }
      })
    }).catch((error) => {
      window.alert("User not found!");
    });

  //login
  
  
}
  signOut()
  {
      return this.afs.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigateByUrl('/login');
        //this.router.navigate(['login']);
      });    
  }

}