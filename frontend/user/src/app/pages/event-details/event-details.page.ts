import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonIcon, IonBadge, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, ticketOutline, timeOutline } from 'ionicons/icons'; 
import { Event } from '../../services/event';
import { Booking } from '../../services/booking';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonInput, IonItem, IonIcon, IonBadge, RouterLink],
})
export class EventDetailsPage implements OnInit {

  event: any = null;
  quantity = 1;
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: Event,
    private bookingService: Booking,
    private auth: Auth,
    private toast: ToastController
  ) {
    addIcons({ticketOutline, locationOutline, calendarOutline, timeOutline});
  }

  ngOnInit() {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent(id);
  }

  loadEvent(id: number){
    this.eventService.getEvent(id).subscribe({
      next: item => {
        this.event = item;
      },

      error: () =>{
        this.showToast('Event not found', 'danger');
        this.router.navigate(['/events']);
      }
    });
  }

  get totalAmount(): number {
    return Number(this.event?.price || 0) *
    Number(this.quantity || 0);
  }

  changeQuantity(amount: number){
    const maximum = Number(this.event?.availableTickets || 0);

    this.quantity = Math.min(maximum, Math.max(1, this.quantity + amount));
  }

  bookTicket(){
    const customer = this.auth.getCustomer();

    if (!customer){
      this.router.navigate(["/login"]);
      return;
    }

    if(!Number.isInteger(Number(this.quantity)) || this.quantity < 1){
      this.showToast('Enter a valid ticket quantity','warning');
      return;
    }

    if(this.quantity > this.event.availableTickets){
      this.showToast('Not enough available tickets', 'danger');
      return;
    }

    this.loading = true;

    this.bookingService.createBooking({
      userID: customer.userID,
      eventID: this.event.eventID,
      quantity: this.quantity
    }).subscribe({
      next: async (response: any)=> {
        this.loading = false;

        await this.showToast(`Booking #${response.bookID} submitted successfully!`,'success');

        this.router.navigate(['/my-bookings']);
      },
      error: err => {
        this.loading = false;

        this.showToast(
          err.error?.detail || 'Unable to book tickets', 'danger'
        );
      }
    });
  }

  async showToast(message: string, color: string){
    const toast = await this.toast.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });

    await toast.present()
  }
}
