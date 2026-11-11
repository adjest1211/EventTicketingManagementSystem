import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Booking {
    private api = 'http://127.0.0.1:8000';
    constructor(private http: HttpClient){}

    createBooking(item: any): Observable<any> {
        return this.http.post(`${this.api}/bookings`, item);
    }

    getMyBookings(userID: number): Observable<any> {
        return this.http.get(`${this.api}/customer/bookings/${userID}`);
    }

    updateBooking(bookID: number, item: any): Observable<any>{
        return this.http.put(`${this.api}/bookings/${bookID}`, item);
    }
}
