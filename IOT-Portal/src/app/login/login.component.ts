import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: any;
  password: any;

  // authService: AuthenticationService;

  constructor(public authService: AuthenticationService) {
    this.email = '';
    this.password = '';
    // AuthenticationService.login("asd","asd");
  }


  ngOnInit(): void {
  }

  login()
  {
    console.log("Hello");
    //validate email & password
    if(this.email.length > 0 && this.password.length > 0) 
    {
      //check for email format
      if((/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).test(this.email))
      {
        //do the firebase logic
        this.authService.login(this.email,this.password);
      }
      else
      {
        //format false
        window.alert("Wrong Email format");
      }
    }
    else
    {
      //empty email or password
      window.alert("Empty Email or Password");
    }
  }

  check()
  {
    console.log(this.authService.getLoggedIn())
    // return this.authService.getLoggedIn()
  }
}