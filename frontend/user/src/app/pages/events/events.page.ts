import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonGrid, IonText, IonImg, IonButton, IonCard, IonCardContent, IonContent, IonSearchbar } from '@ionic/angular';
import { events } from '../../services/preview';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  imports: [
    IonGrid,
    IonText,
    IonImg,
    DatePipe,
    RouterLink,
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonSearchbar,
  ],
})
export class EventsPage {
  readonly search = signal('');
  readonly events = computed(() => {
    const query = this.search().trim().toLowerCase();
    return events.filter((event) =>
      [event.name, event.venue, event.category].some((value) => value.toLowerCase().includes(query)),
    );
  });
  readonly featured = events[0];
}
