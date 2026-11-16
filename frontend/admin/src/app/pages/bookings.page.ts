import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonGrid, IonText, IonButton, IonContent } from '@ionic/angular';
import { BookingTable } from './booking-table';
import { Workspace } from '../workspace';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  imports: [IonGrid, IonText, CurrencyPipe, RouterLink, IonButton, IonContent, BookingTable],
})
export class BookingsPage {
  readonly workspace = inject(Workspace);
  readonly event = input<string>();
  readonly selected = computed(() => this.workspace.events().find((item) => item.id === Number(this.event())));
}
