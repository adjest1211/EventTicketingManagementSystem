import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonGrid, IonText, IonButton, IonContent } from '@ionic/angular';
import { events, Preview } from '../../services/preview';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  imports: [IonGrid, IonText, DatePipe, RouterLink, IonButton, IonContent],
})
export class ConfirmationPage {
  private readonly preview = inject(Preview);
  readonly id = input<string>();
  readonly booking = computed(() => this.preview.bookings().find((booking) => booking.id === this.id()));
  readonly event = computed(() => events.find((event) => event.id === this.booking()?.eventId));
}
