import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IonGrid, IonRow, IonCol, IonBadge } from '@ionic/angular';
import { Workspace } from '../workspace';

@Component({
  selector: 'app-booking-table',
  imports: [IonGrid, IonRow, IonCol, CurrencyPipe, DatePipe, IonBadge],
  template: `
    <ion-grid class="ui-layout table-scroll" tabindex="0" role="region" aria-label="Booking records">
      <ion-grid class="ui-table ui-layout" role="table">
        <ion-grid class="ui-thead ui-layout" role="rowgroup">
          <ion-row class="ui-tr" role="row">
            <ion-col class="ui-th" role="columnheader">Reference</ion-col>
            <ion-col class="ui-th" role="columnheader">Attendee</ion-col>
            <ion-col class="ui-th" role="columnheader">Event</ion-col>
            <ion-col class="ui-th" role="columnheader">Tickets</ion-col>
            <ion-col class="ui-th" role="columnheader">Total</ion-col>
            <ion-col class="ui-th" role="columnheader">Booked on</ion-col>
            <ion-col class="ui-th" role="columnheader">Status</ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid class="ui-tbody ui-layout" role="rowgroup">
          @for (booking of records(); track booking.reference) {
            <ion-row class="ui-tr" role="row">
              <ion-col class="ui-td" role="cell">{{ booking.reference }}</ion-col>
              <ion-col class="ui-th" role="rowheader">{{ booking.attendee }}</ion-col>
              <ion-col class="ui-td" role="cell">{{ booking.eventName }}</ion-col>
              <ion-col class="ui-td" role="cell">{{ booking.quantity }}</ion-col>
              <ion-col class="ui-td" role="cell">{{ booking.total | currency: 'PHP' : '₱' : '1.0-2' }}</ion-col>
              <ion-col class="ui-td" role="cell">{{ booking.bookedOn | date: 'MMM d, y' }}</ion-col>
              <ion-col class="ui-td" role="cell">
                <ion-badge class="status" [class.cancelled]="booking.status === 'Cancelled'">{{
                  booking.status
                }}</ion-badge>
              </ion-col>
            </ion-row>
          } @empty {
            <ion-row class="ui-tr" role="row">
              <ion-col class="ui-td ui-empty-cell" role="cell">No bookings for this event.</ion-col>
            </ion-row>
          }
        </ion-grid>
      </ion-grid>
    </ion-grid>
  `,
})
export class BookingTable {
  private readonly workspace = inject(Workspace);
  readonly limit = input(this.workspace.bookings.length);
  readonly eventId = input<number>();

  readonly records = computed(() => {
    const eventId = this.eventId();
    const bookings = this.workspace.bookings;
    return (eventId === undefined ? bookings : bookings.filter((booking) => booking.eventId === eventId)).slice(
      0,
      this.limit(),
    );
  });
}
