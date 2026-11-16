import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonGrid, IonText, IonImg, IonButton, IonContent, IonInput } from '@ionic/angular';
import { Preview } from '../../services/preview';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  imports: [IonGrid, IonText, IonImg, FormsModule, RouterLink, IonButton, IonContent, IonInput],
})
export class RegisterPage {
  private readonly preview = inject(Preview);
  private readonly router = inject(Router);
  name = '';
  email = '';
  password = '';

  submit() {
    this.preview.account.set({ name: this.name.trim(), email: this.email.trim() });
    this.password = '';
    void this.router.navigate(['/events']);
  }
}
