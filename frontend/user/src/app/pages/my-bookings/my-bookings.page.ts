import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonGrid, IonLabel, IonButton, IonContent, IonModal } from '@ionic/angular';
import { events, Preview, TicketBooking } from '../../services/preview';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.page.html',
  imports: [IonGrid, IonLabel, DatePipe, RouterLink, IonButton, IonContent, IonModal],
})
export class MyBookingsPage {
  private readonly preview = inject(Preview);
  readonly bookings = computed(() =>
    this.preview.bookings().flatMap((booking) => {
      const event = events.find((event) => event.id === booking.eventId);
      return event ? [{ booking, event }] : [];
    }),
  );
  readonly pending = signal<{ booking: TicketBooking; event: (typeof events)[number] } | null>(null);
  readonly status = signal('');

  cancel() {
    const selected = this.pending();
    if (!selected) return;

    this.preview.cancel(selected.booking.id);
    this.status.set('Booking cancelled.');
  }
}
