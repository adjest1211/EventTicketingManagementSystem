import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonProgressBar,
  IonRow,
  IonText,
} from '@ionic/angular';
import { Workspace } from '../workspace';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrl: 'home.page.scss',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonProgressBar,
    IonRow,
    IonText,
  ],
})
export class HomePage {
  readonly workspace = inject(Workspace);
  readonly recentBookings = this.workspace.bookings.slice(0, 3);
  readonly weeks = [
    { label: 'Oct 19–25', total: this.workspace.grossSales(undefined, '2026-10-19', '2026-10-25') },
    { label: 'Oct 26–Nov 1', total: this.workspace.grossSales(undefined, '2026-10-26', '2026-11-01') },
    { label: 'Nov 2–8', total: this.workspace.grossSales(undefined, '2026-11-02', '2026-11-08') },
    { label: 'Nov 9–15', total: this.workspace.grossSales(undefined, '2026-11-09', '2026-11-15') },
  ];
  readonly peak = Math.max(1, ...this.weeks.map((week) => week.total));
}
