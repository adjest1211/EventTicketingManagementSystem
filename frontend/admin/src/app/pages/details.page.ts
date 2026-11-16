import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonGrid, IonText, IonImg, IonButton, IonContent } from '@ionic/angular';
import { Workspace } from '../workspace';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  imports: [IonGrid, IonText, IonImg, CurrencyPipe, DatePipe, RouterLink, IonButton, IonContent],
})
export class DetailsPage {
  readonly workspace = inject(Workspace);
  readonly id = input<string>();
  readonly event = computed(() => this.workspace.events().find((event) => event.id === Number(this.id())));
}
