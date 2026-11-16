import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonGrid, IonText, IonButton, IonContent } from '@ionic/angular';
import { events } from '../../services/preview';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  imports: [IonGrid, IonText, DatePipe, RouterLink, IonButton, IonContent],
})
export class EventDetailsPage {
  readonly id = input<string>();
  readonly event = computed(() => events.find((event) => event.id === Number(this.id())));
}
