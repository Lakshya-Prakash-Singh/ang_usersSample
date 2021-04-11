import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'

import { LoginComponent } from "./login/login.component";
import { UserListComponent } from "./user-list/user-list.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", canActivate: [AuthGuard], component: UserListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
