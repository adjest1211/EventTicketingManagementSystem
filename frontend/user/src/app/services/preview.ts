import { Injectable, signal } from '@angular/core';

export const events = [
  {
    id: 1,
    name: 'Night Shift',
    category: 'Music',
    poster: 'night',
    headline: 'Night Shift',
    date: '2026-11-28T20:00:00+08:00',
    venue: 'The Roundhouse',
    price: 350,
    capacity: 40,
    description: 'A late-night set with local DJs, from house to electronic.',
  },
  {
    id: 2,
    name: 'Open Studio',
    category: 'Art workshop',
    poster: 'studio',
    headline: 'Open Studio',
    date: '2026-11-29T11:00:00+08:00',
    venue: 'Peckham Levels',
    price: 200,
    capacity: 16,
    description: 'Spend a morning making prints. Instructors and materials are provided.',
  },
  {
    id: 3,
    name: 'The Comedy Club',
    category: 'Stand-up comedy',
    poster: 'comedy',
    headline: 'A Good Bad Idea.',
    date: '2026-12-04T19:30:00+08:00',
    venue: 'Soho Theatre',
    price: 250,
    capacity: 35,
    description: 'Three independent comedians share the bill for an evening of stand-up.',
  },
];

export interface TicketBooking {
  id: string;
  eventId: number;
  quantity: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class Preview {
  readonly bookings = signal(this.readBookings());
  readonly account = signal<{ name: string; email: string } | null>(null);

  available(event: (typeof events)[number]) {
    return (
      event.capacity -
      this.bookings()
        .filter((booking) => booking.eventId === event.id)
        .reduce((total, booking) => total + booking.quantity, 0)
    );
  }

  book(event: (typeof events)[number], quantity: number, name: string, email: string) {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > this.available(event)) {
      return null;
    }

    const booking = { id: crypto.randomUUID(), eventId: event.id, quantity, name, email };
    this.save([...this.bookings(), booking]);
    return booking;
  }

  cancel(id: string) {
    this.save(this.bookings().filter((booking) => booking.id !== id));
  }

  private save(bookings: TicketBooking[]) {
    localStorage.setItem('eventify-preview-bookings', JSON.stringify(bookings));
    this.bookings.set(bookings);
  }

  private readBookings(): TicketBooking[] {
    try {
      const bookings = JSON.parse(localStorage.getItem('eventify-preview-bookings') ?? '[]');
      return Array.isArray(bookings) ? bookings : [];
    } catch {
      return [];
    }
  }
}
