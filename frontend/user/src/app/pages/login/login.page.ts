import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonGrid, IonLabel, IonImg, IonButton, IonContent, IonInput } from '@ionic/angular';
import { Preview } from '../../services/preview';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [IonGrid, IonLabel, IonImg, FormsModule, RouterLink, IonButton, IonContent, IonInput],
})
export class LoginPage {
  private readonly preview = inject(Preview);
  private readonly router = inject(Router);

  email = '';
  password = '';

  submit() {
    this.preview.account.set({ name: '', email: this.email.trim() });
    this.password = '';
    void this.router.navigate(['/events']);
  }
}
