import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonGrid, IonText, IonRow, IonCol, IonBadge, IonButton, IonContent, IonModal } from '@ionic/angular';
import { ManagedEvent, Workspace } from '../workspace';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  imports: [
    IonGrid,
    IonText,
    IonRow,
    IonCol,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    IonBadge,
    IonButton,
    IonContent,
    IonModal,
  ],
})
export class EventsPage {
  readonly workspace = inject(Workspace);
  readonly pending = signal<ManagedEvent | null>(null);
  readonly message = signal('');

  remove(event: ManagedEvent) {
    this.message.set(
      this.workspace.delete(event.id)
        ? event.name + ' was deleted.'
        : 'Events with confirmed bookings cannot be deleted.',
    );
  }
}
