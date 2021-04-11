import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { ApiServciesService } from '../api-servcies.service';

declare const M: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public global_variables:any = environment;
  ProfilePic:any = "../assets/images/icons/defaultUser.svg";
  toggleLoginForm:Boolean = false;
  IsSignUpFormSubmitTried:Boolean = false;
  IsLogInFormSubmitTried:Boolean = false;

  constructor(private api:ApiServciesService, private pageRouter:Router) { }

  signUpForm = new FormGroup({
    "FirstName": new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    "LastName": new FormControl("", [Validators.maxLength(20)]),
    "Email": new FormControl("", [Validators.required, Validators.email, Validators.maxLength(50)]),
    "PhoneNumber": new FormControl("", [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]+$")]),
    "Password": new FormControl("", [Validators.minLength(8), Validators.maxLength(20)]),
    "ProfilePic": new FormControl()
  });

  loginForm = new FormGroup({
    "Email": new FormControl("", [Validators.required, Validators.email]),
    "Phone Number": new FormControl("", [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]+$")]),
    "Password": new FormControl("", [Validators.minLength(8), Validators.maxLength(20)])
  });

  ngOnInit(): void {
  }

  login(event: any) {

    this.IsLogInFormSubmitTried = true;

    if (this.loginForm.invalid) { 
      if (!this.loginForm.get('Phone Number')?.hasError('required') && (this.loginForm.get('Phone Number')?.hasError('pattern') || this.loginForm.get('Phone Number')?.hasError('minlength') || this.loginForm.get('Phone Number')?.hasError('maxlength'))) {
        M.Toast.dismissAll();
        M.toast({html: 'Please Fill Phone Number Correctly To Proceed!', displayLength: 5000, classes: 'rounded red'});
        return false;
      }
      else if (!this.loginForm.get('Email')?.hasError('required') && this.loginForm.get('Email')?.hasError('email')) {
        M.Toast.dismissAll();
        M.toast({html: 'Please Fill Email Correctly To Proceed!', displayLength: 5000, classes: 'rounded red'});
        return false;
      }
      else if (this.loginForm.get('Email')?.hasError('required') && this.loginForm.get('Phone Number')?.hasError('required')) {
        M.Toast.dismissAll();
        M.toast({html: 'Please Fill Email Or Phone Number To Proceed!', displayLength: 5000, classes: 'rounded red'});
        return false;
      }
      else if (this.loginForm.get('Password')?.invalid) {
        M.Toast.dismissAll();
        M.toast({html: 'Invalid Password!', displayLength: 5000, classes: 'rounded red'});
        return false;
      }
    }
    
    this.api.post("/login", {Email: this.loginForm.get('Email')?.value, PhoneNumber: this.loginForm.get('Phone Number')?.value, Password: (this.loginForm.get("Password")?.value)}).subscribe(
      (result) => {
        
        let loginData = (result as any);

        console.log(loginData);

        if (loginData.status == "success") {

          M.Toast.dismissAll();
          M.toast({html: 'Logged In Successfully!', displayLength: 5000, classes: 'rounded green'});
    
          localStorage.setItem("UserName", loginData.data[0].FirstName + " " + loginData.data[0].LastName);
          localStorage.setItem("UserFirstName", loginData.data[0].FirstName);
          localStorage.setItem("UserLastName", loginData.data[0].LastName);
          localStorage.setItem("UserPhoneNumber", loginData.data[0].PhoneNumber);
          localStorage.setItem("UserEmail", loginData.data[0].Email);
          localStorage.setItem("UserProfilePic", loginData.data[0].ProfilePic);

          this.global_variables.logInDetails.UserName = loginData.data[0].FirstName + " " + loginData.data[0].LastName;
          this.global_variables.logInDetails.UserFirstName = loginData.data[0].FirstName;
          this.global_variables.logInDetails.UserLastName = loginData.data[0].LastName;
          this.global_variables.logInDetails.UserPhoneNumber = loginData.data[0].PhoneNumber;
          this.global_variables.logInDetails.UserEmail = loginData.data[0].Email;
          this.global_variables.logInDetails.UserProfilePic = loginData.data[0].ProfilePic;
    
          this.pageRouter.navigateByUrl("");
    
        }
        else {          
          M.Toast.dismissAll();
          M.toast({html: loginData.message, displayLength: 5000, classes: 'rounded red'});    
        }
      }
    );
    
    return false;
  }

  signUp(event: any) {

    this.IsSignUpFormSubmitTried = true;

    if (this.signUpForm.invalid) { 
      M.Toast.dismissAll();
      M.toast({html: 'Please Fill All Required Feilds And Remove Errors To Proceed!', displayLength: 5000, classes: 'rounded red'});
      return false;
    }
    
    const signUpFormData = new FormData();
    signUpFormData.append('FirstName', this.signUpForm.get("FirstName")?.value);
    signUpFormData.append('LastName', this.signUpForm.get("LastName")?.value);
    signUpFormData.append('Email', this.signUpForm.get("Email")?.value);
    signUpFormData.append('PhoneNumber', this.signUpForm.get("PhoneNumber")?.value);
    signUpFormData.append('Password', (this.signUpForm.get("Password")?.value));
    signUpFormData.append('ProfilePic', this.signUpForm.get("ProfilePic")?.value);

    this.api.post("/registration", signUpFormData).subscribe(
      (result) => {
        let signupData = (result as any);
        
        if (signupData.status == "success") {

          M.Toast.dismissAll();
          M.toast({html: 'Signed Up Successfully!', displayLength: 5000, classes: 'rounded green'});
    
          localStorage.setItem("UserName", signupData.data[0].FirstName + " " + signupData.data[0].LastName);
          localStorage.setItem("UserFirstName", signupData.data[0].FirstName);
          localStorage.setItem("UserLastName", signupData.data[0].LastName);
          localStorage.setItem("UserPhoneNumber", signupData.data[0].PhoneNumber);
          localStorage.setItem("UserEmail", signupData.data[0].Email);
          localStorage.setItem("UserProfilePic", signupData.data[0].ProfilePic);
          
          this.global_variables.logInDetails.UserName = signupData.data[0].FirstName + " " + signupData.data[0].LastName;
          this.global_variables.logInDetails.UserFirstName = signupData.data[0].FirstName;
          this.global_variables.logInDetails.UserLastName = signupData.data[0].LastName;
          this.global_variables.logInDetails.UserPhoneNumber = signupData.data[0].PhoneNumber;
          this.global_variables.logInDetails.UserEmail = signupData.data[0].Email;
          this.global_variables.logInDetails.UserProfilePic = signupData.data[0].ProfilePic;

          
    
          this.pageRouter.navigateByUrl("");
    
        }
        else {
          M.Toast.dismissAll();
          M.toast({html: signupData.message, displayLength: 5000, classes: 'rounded red'});    
        }

      }
    );

    return false;

  }

  signUpForm_ImageUpload(event: any) { 
    const files = event.target.files;
    if (files.length === 0)
        return;   


    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        M.Toast.dismissAll();
        M.toast({html: 'Invalid File! Only images allowed.', displayLength: 5000, classes: 'rounded red'});
        return;
    }

    console.log(files[0].size);
    if (files[0].size >= 600000) {
      M.Toast.dismissAll();
      M.toast({html: 'Image Should be less than 5mb!', displayLength: 5000, classes: 'rounded red'});
      return;
    }

    
    const reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
        this.ProfilePic = reader.result;
    }

    this.signUpForm.get("ProfilePic")?.setValue(event.target.files[0]);
  }

  func_toggleLoginForm() {
    this.toggleLoginForm = !this.toggleLoginForm;
  }

}
