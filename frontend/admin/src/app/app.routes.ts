import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.page').then((module) => module.HomePage) },
  { path: 'events', loadComponent: () => import('./pages/events.page').then((module) => module.EventsPage) },
  { path: 'events/new', loadComponent: () => import('./pages/editor.page').then((module) => module.EditorPage) },
  { path: 'events/:id/edit', loadComponent: () => import('./pages/editor.page').then((module) => module.EditorPage) },
  { path: 'events/:id', loadComponent: () => import('./pages/details.page').then((module) => module.DetailsPage) },
  { path: 'bookings', loadComponent: () => import('./pages/bookings.page').then((module) => module.BookingsPage) },
  { path: 'login', loadComponent: () => import('./pages/login.page').then((module) => module.LoginPage) },
  { path: '**', redirectTo: 'home' },
];
