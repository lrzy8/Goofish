import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'pink' | 'system';

const STORAGE_KEY = 'theme_mode';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    readonly themeMode = signal<ThemeMode>(this.loadTheme());
    readonly isDark = signal(false);

    constructor() {
        // 在构造函数中延迟执行，确保DOM准备好
        setTimeout(() => {
            this.applyTheme();
            this.watchSystemTheme();
        }, 0);
    }

    private loadTheme(): ThemeMode {
        return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'pink';
    }

    setTheme(mode: ThemeMode) {
        this.themeMode.set(mode);
        localStorage.setItem(STORAGE_KEY, mode);
        this.applyTheme();
    }

    private applyTheme() {
        const mode = this.themeMode();
        let themeName = 'pink';
        let isDark = false;

        if (mode === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            themeName = isDark ? 'pink-dark' : 'pink';
        } else if (mode === 'dark') {
            themeName = 'pink-dark';
            isDark = true;
        } else if (mode === 'light') {
            themeName = 'pink';
            isDark = false;
        } else {
            // pink 模式
            themeName = 'pink';
            isDark = false;
        }

        this.isDark.set(isDark);
        document.documentElement.setAttribute('data-theme', themeName);
    }

    private watchSystemTheme() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.themeMode() === 'system') {
                this.applyTheme();
            }
        });
    }
}
