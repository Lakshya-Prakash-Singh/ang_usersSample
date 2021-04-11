import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServciesService } from '../api-servcies.service';
import { environment } from '../../environments/environment';

declare const M: any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  userList:any;
  public global_variables:any = environment;
  addUserProfilePic:any = "../assets/images/icons/defaultUser.svg"; 
  editUserProfilePic:any = "../assets/images/icons/defaultUser.svg"; 
  baseImageURL = this.global_variables.fixedBaseAPI;
  
  @ViewChild('FirstName') FirstName!: ElementRef;
  @ViewChild('LastName') LastName!: ElementRef;
  @ViewChild('Email') Email!: ElementRef;
  @ViewChild('PhoneNumber') PhoneNumber!: ElementRef;

  addUserForm = new FormGroup({
    "First Name": new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    "Last Name": new FormControl("", [Validators.maxLength(20)]),
    "Email": new FormControl("", [Validators.required, Validators.email]),
    "Phone Number": new FormControl("", [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]+$")]),
    "Profile Pic": new FormControl()
  });

  editUserForm = new FormGroup({
    "UserID": new FormControl("", [Validators.required]),
    "First Name": new FormControl("Processing", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    "Last Name": new FormControl("Processing", [Validators.maxLength(20)]),
    "Email": new FormControl("a@b.c", [Validators.required, Validators.email]),
    "Phone Number": new FormControl("9999999999", [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]+$")]),
    "Profile Pic": new FormControl()
  });

  constructor(private api:ApiServciesService) {

    this.userList = this.api.post("/userlist", {}).subscribe(
      (result) => {
        this.userList = (result as any);
        if (this.userList.status != "success") {
          M.Toast.dismissAll();
          M.toast({html: this.userList.message, displayLength: 5000, classes: 'rounded red'});    
        }
        return this.userList;
      }
    );
  }

  ngOnInit(): void {
    M.AutoInit();
  }

  addUser(event:any):void {

    if (this.addUserForm.invalid) { 
      M.Toast.dismissAll();
      M.toast({html: 'Please Fill All Required Feilds And Remove Errors To Proceed!', displayLength: 5000, classes: 'rounded red'});
    }
    
    const addUserFormData = new FormData();
    addUserFormData.append('FirstName', this.addUserForm.get("First Name")?.value);
    addUserFormData.append('LastName', this.addUserForm.get("Last Name")?.value);
    addUserFormData.append('Email', this.addUserForm.get("Email")?.value);
    addUserFormData.append('PhoneNumber', this.addUserForm.get("Phone Number")?.value);
    addUserFormData.append('ProfilePic', this.addUserForm.get("Profile Pic")?.value);

    this.api.post("/adduser", addUserFormData).subscribe(
      (result) => {
        let addUserData = (result as any);
        
        if (addUserData.status == "success") {

          M.Toast.dismissAll();
          M.toast({html: 'User Added Successfully!', displayLength: 5000, classes: 'rounded green'});
    
    
          this.userList = this.api.post("/userlist", {}).subscribe(
            (result) => {
              this.userList = (result as any);
              if (this.userList.status != "success") {
                M.Toast.dismissAll();
                M.toast({html: this.userList.message, displayLength: 5000, classes: 'rounded red'});    
              }
              return this.userList;
            }
          );
    
        }
        else {
          M.Toast.dismissAll();
          M.toast({html: addUserData.message, displayLength: 5000, classes: 'rounded red'});    
        }

      }
    );
  }

  updateList(id:string, event?:any) {
    console.log(id);  
    this.api.post("/userlist/" + id, {}).subscribe(
      (result) => {
        let userData = (result as any);
        
        if (userData.status == "success") {
// console.log(userData);
          this.editUserForm.setValue({
            "UserID": userData?.data[0]._id,
            "First Name": userData?.data[0].FirstName,
            "Last Name": userData?.data[0].LastName,
            "Email": userData?.data[0].Email,
            "Phone Number": userData?.data[0].PhoneNumber,
            "Profile Pic": ''
          });
          this.PhoneNumber.nativeElement.focus();
          this.Email.nativeElement.focus();
          this.editUserForm.get("Phone Number")?.disable();
          this.editUserForm.get("Email")?.disable();
          this.LastName.nativeElement.focus();
          this.FirstName.nativeElement.focus();

          this.editUserProfilePic = (userData?.data[0].ProfilePic)? this.global_variables.fixedBaseAPI + userData?.data[0].ProfilePic:"../assets/images/icons/defaultUser.svg";

        }
        else {
          M.Toast.dismissAll();
          M.toast({html: userData.message, displayLength: 5000, classes: 'rounded red'});    
        }

      }
    );
  }

  editUser(event:any) {

    const edituserFormData = new FormData();
    edituserFormData.append('FirstName', this.editUserForm.get("First Name")?.value);
    edituserFormData.append('LastName', this.editUserForm.get("Last Name")?.value);
    edituserFormData.append('ProfilePic', this.editUserForm.get("Profile Pic")?.value);

    this.userList = this.api.put("/userlist/" + this.editUserForm.get("UserID")?.value, edituserFormData).subscribe(
      (result) => {
        const editUserResult = (result as any);
        if (editUserResult.status == "success") {
          
          this.userList = this.api.post("/userlist", {}).subscribe(
            (result) => {
              this.userList = (result as any);
              if (this.userList.status == "success") {
                this.userList = this.api.post("/userlist", {}).subscribe(
                  (result) => {
                    this.userList = (result as any);
                    if (this.userList.status == "success") {
                      M.Toast.dismissAll();
                      M.toast({html: "User Updated Successfully!", displayLength: 5000, classes: 'rounded green'}); 
                    }
                    else {
                      M.Toast.dismissAll();
                      M.toast({html: this.userList.message, displayLength: 5000, classes: 'rounded red'});    
                    }
                    return this.userList;
                  }
                ); 
              }
              else {
                M.Toast.dismissAll();
                M.toast({html: this.userList.message, displayLength: 5000, classes: 'rounded red'});    
              }
              return this.userList;
            }
          );
        }
        else {
          M.Toast.dismissAll();
          M.toast({html: "User Not Updated!", displayLength: 5000, classes: 'rounded green'});         
        }
      }
    );    
  }

  deleteUserInitiator(id:string, name:string, event?:any) {
    if (confirm("You really want to delete " + name)) {        
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: {
          ID: id
        },
      };
      this.userList = this.api.delete("/user", options).subscribe(
        (result) => {
          const deleteUserResult = (result as any);
          if (deleteUserResult.status != "success") {
            M.Toast.dismissAll();
            M.toast({html: this.userList.message, displayLength: 5000, classes: 'rounded red'}); 
          }
          else {
            this.userList = this.api.post("/userlist", {}).subscribe(
              (result) => {
                this.userList = (result as any);
                if (this.userList.status == "success") {
                  M.Toast.dismissAll();
                  M.toast({html: "User deleted Successfully!", displayLength: 5000, classes: 'rounded green'}); 
                }
                else {
                  M.Toast.dismissAll();
                  M.toast({html: this.userList.message, displayLength: 5000, classes: 'rounded red'});    
                }
                return this.userList;
              }
            );
          }
        }
      );
    }
    return false;
  } 

  editUserForm_ImageUpload(event: any) {   
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
        this.editUserProfilePic = reader.result;
    }

    this.editUserForm.get("Profile Pic")?.setValue(event.target.files[0]);
  }

  
  addUserForm_ImageUpload(event: any) {    
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
        this.addUserProfilePic = reader.result;
    }

    this.addUserForm.get("Profile Pic")?.setValue(event.target.files[0]);
  }

}
