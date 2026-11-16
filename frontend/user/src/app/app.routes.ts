import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage) },
  {
    path: 'events/:id/book',
    loadComponent: () => import('./pages/event-details/checkout.page').then((m) => m.CheckoutPage),
  },
  { path: 'events', loadComponent: () => import('./pages/events/events.page').then((m) => m.EventsPage) },
  {
    path: 'event-details/:id',
    loadComponent: () => import('./pages/event-details/event-details.page').then((m) => m.EventDetailsPage),
  },
  {
    path: 'booking-confirmed/:id',
    loadComponent: () => import('./pages/my-bookings/confirmation.page').then((m) => m.ConfirmationPage),
  },
  {
    path: 'my-bookings',
    loadComponent: () => import('./pages/my-bookings/my-bookings.page').then((m) => m.MyBookingsPage),
  },
  { path: '**', redirectTo: 'events' },
];
