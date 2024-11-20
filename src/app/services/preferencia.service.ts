import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreferenciaService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      this.setDarkMode(storedTheme === 'dark');
    } else {
      this.setDarkMode(prefersDark.matches);
    }

    prefersDark.addEventListener('change', (mediaQuery) =>
      this.setDarkMode(mediaQuery.matches)
    );
  }

  setDarkMode(isDark: boolean) {
    this.isDarkMode.next(isDark);
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode.value);
  }
}