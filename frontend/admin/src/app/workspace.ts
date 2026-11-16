import { computed, Injectable, signal } from '@angular/core';

export interface EventDraft {
  name: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  description: string;
  photo?: string;
}

export interface ManagedEvent extends EventDraft {
  id: number;
}

const initialEvents: ManagedEvent[] = [
  {
    id: 1,
    name: 'Night Shift',
    category: 'Music / Electronic',
    venue: 'The Roundhouse',
    date: '2026-11-28',
    time: '20:00',
    price: 350,
    capacity: 1000,
    description: 'A late-night set with local DJs, from house to electronic.',
    photo: 'assets/night-shift-concert.jpg',
  },
  {
    id: 2,
    name: 'Open Studio',
    category: 'Art workshop',
    venue: 'Peckham Levels',
    date: '2026-11-29',
    time: '11:00',
    price: 200,
    capacity: 120,
    description: 'A guided printmaking session with materials provided.',
  },
  {
    id: 3,
    name: 'The Comedy Club',
    category: 'Stand-up comedy',
    venue: 'Soho Theatre',
    date: '2026-12-04',
    time: '19:30',
    price: 250,
    capacity: 500,
    description: 'Three independent comedians share the bill for an evening of stand-up.',
    photo: 'assets/signup-comedy.jpg',
  },
];

function sampleBooking(
  reference: string,
  attendee: string,
  event: ManagedEvent,
  quantity: number,
  bookedOn: string,
  status = 'Confirmed',
) {
  return {
    reference,
    attendee,
    eventId: event.id,
    eventName: event.name,
    quantity,
    total: event.price * quantity,
    bookedOn,
    status,
  };
}

@Injectable({ providedIn: 'root' })
export class Workspace {
  private readonly eventState = signal(this.readEvents());
  readonly events = this.eventState.asReadonly();
  readonly organizer = signal('');
  readonly bookings = [
    sampleBooking('NS-260184', 'Alex Morgan', initialEvents[0], 2, '2026-11-15'),
    sampleBooking('CC-260183', 'Jamie Chen', initialEvents[2], 3, '2026-11-15'),
    sampleBooking('NS-260182', 'Taylor Reed', initialEvents[0], 1, '2026-11-15'),
    sampleBooking('NS-260181', 'Jordan Ellis', initialEvents[0], 4, '2026-11-14'),
    sampleBooking('CC-260180', 'Morgan Lee', initialEvents[2], 2, '2026-11-14'),
    sampleBooking('NS-260179', 'Sam Patel', initialEvents[0], 2, '2026-11-13'),
    sampleBooking('NS-260178', 'Robin Scott', initialEvents[0], 1, '2026-11-13', 'Cancelled'),
    sampleBooking('CC-260177', 'Casey Cruz', initialEvents[2], 3, '2026-11-08'),
    sampleBooking('NS-260176', 'Drew Reyes', initialEvents[0], 2, '2026-11-03'),
    sampleBooking('CC-260175', 'Avery Santos', initialEvents[2], 2, '2026-10-25'),
  ];
  readonly tickets = this.ticketsSold();
  readonly revenue = this.grossSales();
  readonly asOf = '2026-11-15';
  readonly upcoming = computed(() =>
    this.events()
      .filter((event) => event.date >= this.asOf)
      .sort((first, second) => (first.date + first.time).localeCompare(second.date + second.time)),
  );

  ticketsSold(eventId?: number) {
    return this.confirmed(eventId).reduce((sum, booking) => sum + booking.quantity, 0);
  }

  grossSales(eventId?: number, from = '', through = '9999') {
    return this.confirmed(eventId)
      .filter((booking) => booking.bookedOn >= from && booking.bookedOn <= through)
      .reduce((sum, booking) => sum + booking.total, 0);
  }

  save(draft: EventDraft, id?: number) {
    const existing = this.events().find((event) => event.id === id);
    if (id !== undefined && !existing) return null;
    if (!Number.isInteger(draft.capacity) || draft.capacity < Math.max(1, this.ticketsSold(id ?? -1))) return null;

    const updated = { ...existing, ...draft, id: existing?.id ?? Date.now() };
    this.persist(
      existing ? this.events().map((event) => (event.id === id ? updated : event)) : [...this.events(), updated],
    );
    return updated;
  }

  delete(id: number) {
    if (this.ticketsSold(id) > 0) return false;
    this.persist(this.events().filter((event) => event.id !== id));
    return true;
  }

  private confirmed(eventId?: number) {
    return this.bookings.filter(
      (booking) => booking.status === 'Confirmed' && (eventId === undefined || booking.eventId === eventId),
    );
  }

  private persist(events: ManagedEvent[]) {
    localStorage.setItem('eventify-admin-events', JSON.stringify(events));
    this.eventState.set(events);
  }

  private readEvents(): ManagedEvent[] {
    try {
      const stored = JSON.parse(localStorage.getItem('eventify-admin-events') ?? 'null');
      return Array.isArray(stored) ? stored : initialEvents;
    } catch {
      return initialEvents;
    }
  }
}
