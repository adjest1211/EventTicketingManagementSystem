import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonGrid,
  IonText,
  IonApp,
  IonButton,
  IonIcon,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonRouterOutlet,
  IonToolbar,
} from '@ionic/angular';
import {
  addOutline,
  calendarOutline,
  gridOutline,
  logInOutline,
  logOutOutline,
  ticket,
  ticketOutline,
} from 'ionicons/icons';
import { Workspace } from './workspace';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonGrid,
    IonText,
    IonApp,
    IonButton,
    IonIcon,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
    IonRouterOutlet,
    IonToolbar,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppComponent {
  readonly workspace = inject(Workspace);
  readonly icons = { ticket, logInOutline, logOutOutline };
  readonly links = [
    { path: '/home', label: 'Dashboard', icon: gridOutline },
    { path: '/events', label: 'Events', icon: calendarOutline },
    { path: '/events/new', label: 'Add event', icon: addOutline },
    { path: '/bookings', label: 'Bookings', icon: ticketOutline },
  ];
}
