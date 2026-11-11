import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Auth {
    private api = "http://127.0.0.1:8000";
    
    constructor(private http: HttpClient){}

    register(items: any): Observable<any>{
        return this.http.post(`${this.api}/register`, items);
    }

    login(items: any): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, items).pipe(
        tap((response: any) => {
            sessionStorage.setItem('customer', JSON.stringify(response.user));
        })
    );
}

    getCustomer(): any {
        const item = sessionStorage.getItem('customer');

        return item ? JSON.parse(item) : null;
    }

    isLoggedIn(): boolean {
        return this.getCustomer() !== null;
    }

    logout(): void {
        sessionStorage.removeItem('customer');
    }
}
