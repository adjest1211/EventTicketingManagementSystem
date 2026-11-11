import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardContent, IonSearchbar, IonIcon, IonButtons, IonBadge, IonRefresher, IonRefresherContent } from '@ionic/angular';
import { Event } from '../../services/event';
import { Auth } from '../../services/auth';
import { addIcons } from 'ionicons';
import { ticket, arrowForwardOutline, sparklesOutline, locationOutline, calendarOutline, ticketOutline } from 'ionicons/icons';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  imports: [IonContent, IonHeader, IonTitle,RouterLink, IonToolbar, CommonModule, FormsModule, IonButton, IonCard, IonCardContent, IonSearchbar, IonIcon, IonButtons, IonBadge, IonRefresher, IonRefresherContent],
})
export class EventsPage implements OnInit {

  events: any[] = [];
  filteredEvents: any[] = [];
  searchText = '';
  selectedCategory = 'All';
  customer: any = null;
  
  categories = ['All', 'Upcoming', 'Ongoing', 'Ended', 'Cancelled'];

  constructor(
    private eventService: Event,
    private auth: Auth,
    private router: Router
  ) {
    addIcons({ ticket, arrowForwardOutline, sparklesOutline, locationOutline, calendarOutline, ticketOutline });
  }

  
  ngOnInit() {
    this.loadEvents();
  }

  ionViewWillEnter(){
    this.customer = this.auth.getCustomer();
    this.loadEvents();
  }

  loadEvents(){
    this.eventService.getEvents().subscribe({
      next: (item: any) => {
        this.events = item;
        this.filterEvents();
      },
      error: e => {
        console.error(e);
      }
    });
  }

  filterEvents(){
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = event.eventName.toLowerCase().includes(
        this.searchText.toLowerCase()
      ) ||
      event.venue.toLowerCase().includes(
        this.searchText.toLowerCase()
      );

      const matchesCategory = 
      this.selectedCategory === 'All' ||
      event.currentStatus === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  onSearch(value: any){
    this.searchText = value.detail.value || '';
    this.filterEvents();
  }

  selectCategory(category: string){
    this.selectedCategory = category;
    this.filterEvents();
  }

  openEvent(id: number){
    this.router.navigate(['/event-details', id]);
  }

  logout(){
    this.auth.logout();
    this.customer =null;
    this.router.navigate(['/login']);
  }

  handleRefresh(event:any){
    this.eventService.getEvents().subscribe({
      next: (item:any) => {
        this.events = item;
        this.filterEvents();
        event.target.complete();
      },
      error: () => event.target.complete()
    });
  }
}
