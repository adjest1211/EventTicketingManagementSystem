import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonGrid, IonText, IonImg, IonButton, IonContent, IonInput } from '@ionic/angular';
import { Workspace } from '../workspace';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [IonGrid, IonText, IonImg, FormsModule, IonButton, IonContent, IonInput],
})
export class LoginPage {
  private readonly workspace = inject(Workspace);
  private readonly router = inject(Router);
  email = '';
  password = '';

  submit(form: NgForm) {
    if (form.invalid) return;
    this.workspace.organizer.set(this.email.trim());
    this.password = '';
    void this.router.navigate(['/home'], { replaceUrl: true });
  }
}
