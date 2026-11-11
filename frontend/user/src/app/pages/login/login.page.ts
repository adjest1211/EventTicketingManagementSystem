import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonButtons, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonIcon, ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { addIcons } from 'ionicons';
import { arrowBackOutline, ticketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonContent, IonHeader, IonButtons, IonTitle, IonToolbar, CommonModule, FormsModule, RouterLink, IonInput, IonButton, IonIcon],
})
export class LoginPage implements OnInit {
  username = '';
  password = '';


  constructor(
    private auth: Auth,
    private router: Router,
    private toast: ToastController
  ) {
    addIcons({ticketOutline, arrowBackOutline});
  }

  async login() {
    if(!this.username.trim() || !this.password){
      this.showToast("Please enter your username or password", 'warning');
      return;
    }



    this.auth.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.username = "";
        this.password = "";
        this.router.navigate(['/events']);
      },
      error: err => {

        this.showToast(err.error?.detail || 'Login failed', 'danger');
      }
    });
  }

  async showToast(message: string, color: string){
    const toast = await this.toast.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });

    await toast.present();
  }

  ngOnInit() {}
}
