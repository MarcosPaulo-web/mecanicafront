import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';

  constructor() {
    // Aplica o tema assim que o serviço carregar
    this.loadTheme();
  }

  setTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const next = currentTheme === 'light' ? 'dark' : 'light';

    this.setTheme(next);
    console.log('Tema alterado para: ' + next);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return (
      (localStorage.getItem(this.STORAGE_KEY) as 'light' | 'dark') ||
      document.documentElement.getAttribute('data-bs-theme') ||
      'light'
    );
  }

  loadTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);

    if (savedTheme) {
      document.documentElement.setAttribute('data-bs-theme', savedTheme);
    } else {
      // Se não existir, salva uma vez o tema padrão
      this.setTheme('light');
    }
  }
}
