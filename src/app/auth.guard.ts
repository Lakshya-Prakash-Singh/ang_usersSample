import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (private pageRouter:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (typeof localStorage.getItem("UserEmail") == "undefined" || localStorage.getItem("UserEmail") == null || localStorage.getItem("UserEmail") == "") {
        this.pageRouter.navigate(["/login"]);
        return false;
      }
      else {
        return true;
      }
    }  
}
