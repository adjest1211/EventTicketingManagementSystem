import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonGrid, IonText, IonImg, IonButton, IonContent, IonInput, IonTextarea } from '@ionic/angular';
import { EventDraft, Workspace } from '../workspace';

const photoTypes = ['image/jpeg', 'image/png', 'image/webp'];
const photoSizeLimit = 1024 * 1024;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.page.html',
  imports: [
    IonGrid,
    IonText,
    IonImg,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    RouterLink,
    IonButton,
    IonContent,
    IonInput,
    IonTextarea,
  ],
})
export class EditorPage {
  private readonly workspace = inject(Workspace);
  private readonly router = inject(Router);
  readonly id = input<string>();
  readonly existing = computed(() => this.workspace.events().find((event) => event.id === Number(this.id())));
  readonly minimum = computed(() => Math.max(1, this.workspace.ticketsSold(this.existing()?.id ?? -1)));
  draft = this.emptyDraft();
  message = '';
  saving = false;
  readonly readingPhoto = signal(false);
  readonly photoError = signal('');

  ionViewWillEnter() {
    this.resetDraft();
  }

  ngOnChanges() {
    this.resetDraft();
  }

  private resetDraft() {
    const event = this.existing();
    this.draft = event ? { ...event } : this.emptyDraft();
    this.message = '';
    this.saving = false;
    this.readingPhoto.set(false);
    this.photoError.set('');
  }

  async selectPhoto(picker: HTMLInputElement) {
    const file = picker.files?.[0];
    picker.value = '';
    if (!file) return;

    this.photoError.set('');
    if (!photoTypes.includes(file.type) || file.size > photoSizeLimit) {
      this.photoError.set('Choose a JPG, PNG, or WebP image up to 1 MB.');
      return;
    }

    const draft = this.draft;
    this.readingPhoto.set(true);
    try {
      const photo = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      const image = new Image();
      image.src = photo;
      await image.decode();
      if (draft === this.draft) draft.photo = photo;
    } catch {
      if (draft === this.draft) this.photoError.set('This image could not be opened. Choose another file.');
    } finally {
      if (draft === this.draft) this.readingPhoto.set(false);
    }
  }

  removePhoto() {
    this.draft.photo = undefined;
    this.photoError.set('');
  }

  submit(form: NgForm) {
    if (form.invalid || this.saving || this.readingPhoto()) return;
    const draft = {
      ...this.draft,
      name: this.draft.name.trim(),
      category: this.draft.category.trim(),
      venue: this.draft.venue.trim(),
      description: this.draft.description.trim(),
    };

    if (
      !draft.name ||
      !draft.category ||
      !draft.venue ||
      !draft.description ||
      !Number.isFinite(draft.price) ||
      draft.price < 0
    ) {
      this.message = 'Enter complete event details and a valid ticket price.';
      return;
    }

    let event;
    try {
      event = this.workspace.save(draft, this.existing()?.id);
    } catch {
      this.message =
        'Browser storage could not save the event. Try a smaller image or remove the picture and save again.';
      return;
    }
    if (!event) {
      this.message = 'Enter a whole-number capacity that covers existing ticket sales.';
      return;
    }

    this.saving = true;
    void this.router.navigate(['/events', event.id], { replaceUrl: true });
  }

  private emptyDraft(): EventDraft {
    return { name: '', category: '', venue: '', date: '', time: '', price: 0, capacity: 1, description: '' };
  }
}
