import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonGrid,
  IonLabel,
  IonApp,
  IonButton,
  IonIcon,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonRouterOutlet,
  IonToolbar,
} from '@ionic/angular';
import { gridOutline, logInOutline, logOutOutline, personAddOutline, ticket, ticketOutline } from 'ionicons/icons';
import { Preview } from './services/preview';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonGrid,
    IonLabel,
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
  readonly preview = inject(Preview);
  readonly icons = { gridOutline, logInOutline, logOutOutline, personAddOutline, ticket, ticketOutline };
}
