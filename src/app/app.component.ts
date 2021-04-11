import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

declare const M: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Lakshya Test';
  public global_variables:any = environment;
  IsloggedIn = environment.IsLoggedIn();
  hi = this.global_variables.updateLogInDetails();
  UserName = (this.global_variables.logInDetails.UserName)? this.global_variables.logInDetails.UserName: localStorage.getItem("UserName");
  UserEmail = (this.global_variables.logInDetails.UserEmail)? this.global_variables.logInDetails.UserName: localStorage.getItem("UserEmail");
  ProfilePic:any = (this.global_variables.logInDetails.UserProfilePic)? this.global_variables.fixedBaseAPI + this.global_variables.logInDetails.UserProfilePic:"../assets/images/icons/defaultUser.svg";
  
  constructor(private pageRouter:Router) {    
    this.global_variables.updateLogInDetails();
  }

  ngOnInit(): void {
    M.AutoInit();
    
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems, {edge: "right"});
    });
  }

  logOut() {
    localStorage.clear();
    
    this.global_variables.logInDetails.UserName = "";
    this.global_variables.logInDetails.UserFirstName = "";
    this.global_variables.logInDetails.UserLastName = "";
    this.global_variables.logInDetails.UserPhoneNumber = "";
    this.global_variables.logInDetails.UserEmail = "";
    this.global_variables.logInDetails.UserProfilePic = "";

    M.Toast.dismissAll();
    M.toast({html: 'Logged Out Successfully!', displayLength: 5000, classes: 'rounded green'});
    this.pageRouter.navigateByUrl("/login");
  }

}
