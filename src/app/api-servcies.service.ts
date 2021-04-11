import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiServciesService {

  constructor(private http:HttpClient) { }

  public get(url: string, options?: any) {
    return this.http.get(environment.fixedUserURL + url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  public post(url: string, data: any, options?: any) {
    return this.http.post(environment.fixedUserURL + url, data, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  public put(url: string, data: any, options?: any) {
    return this.http.put(environment.fixedUserURL + url, data, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  public delete(url: string, options?: any) {
    return this.http.delete(environment.fixedUserURL + url, options).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  handleError(error:any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }    
    console.log(error);
    localStorage.setItem("userErrorLog", errorMessage);
    // window.alert(errorMessage);
    return [{
      "status": "error",
      "message": "An error occured :-(, Please try again or contact us now!"
    }];
  }


 }
