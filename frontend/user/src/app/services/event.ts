import { Service, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class Event {
    private api = 'http://127.0.0.1:8000';

    constructor(private http: HttpClient){}

    getEvents(): Observable<any> {
        return this.http.get(`${this.api}/events`);
    }

    getEvent(id: number): Observable<any>{
        return this.http.get(`${this.api}/events/${id}`);
    }
}
