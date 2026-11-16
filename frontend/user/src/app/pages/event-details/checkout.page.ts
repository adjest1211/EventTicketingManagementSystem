import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonGrid, IonText, IonButton, IonContent, IonInput, IonSelect, IonSelectOption } from '@ionic/angular';
import { events, Preview } from '../../services/preview';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  imports: [
    IonGrid,
    IonText,
    DatePipe,
    FormsModule,
    RouterLink,
    IonButton,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
})
export class CheckoutPage {
  private readonly preview = inject(Preview);
  private readonly router = inject(Router);
  readonly id = input<string>();
  readonly event = computed(() => events.find((event) => event.id === Number(this.id())));
  readonly quantities = computed(() => {
    const event = this.event();
    return event ? Array.from({ length: this.preview.available(event) }, (_, index) => index + 1) : [];
  });
  quantity = 1;
  name = '';
  email = '';
  message = '';
  submitting = false;

  ionViewWillEnter() {
    const account = this.preview.account();
    this.quantity = 1;
    this.name = account?.name ?? '';
    this.email = account?.email ?? '';
    this.message = '';
    this.submitting = false;
  }

  confirm() {
    const event = this.event();
    if (!event || this.submitting || !this.name.trim()) return;

    const booking = this.preview.book(event, this.quantity, this.name.trim(), this.email.trim());
    if (!booking) {
      this.message = 'That ticket quantity is no longer available.';
      return;
    }

    this.submitting = true;
    void this.router.navigate(['/booking-confirmed', booking.id], { replaceUrl: true });
  }
}
