// landing.component.ts
import {
  AfterViewInit,
  Component,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements AfterViewInit, OnDestroy {

  private scrollListener!: () => void;
  private mobileMenuOpen = false;

  ngAfterViewInit(): void {
    this.initScrollReveal();
    this.initNavScroll();
    this.initMobileMenu();
    this.initRatioBars();
    this.initSmoothClose();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  // ─── Scroll reveal ───────────────────────────────────────────────────────────
  private initScrollReveal(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);

            // Animate ratio fills if inside the build-ratio card
            const fills = (entry.target as HTMLElement).querySelectorAll('.ratio-fill');
            fills.forEach((fill) => {
              const el = fill as HTMLElement;
              const pct = el.getAttribute('data-pct') ?? '0%';
              setTimeout(() => { el.style.width = pct; }, 400);
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  // ─── Nav border on scroll ────────────────────────────────────────────────────
  private initNavScroll(): void {
    const nav = document.querySelector('nav') as HTMLElement | null;
    if (!nav) return;

    this.scrollListener = () => {
      nav.style.borderBottomColor =
        window.scrollY > 60
          ? 'rgba(232, 197, 71, 0.15)'
          : 'rgba(240, 240, 232, 0.07)';
      nav.style.background =
        window.scrollY > 60
          ? 'rgba(15, 15, 30, 0.96)'
          : 'rgba(15, 15, 30, 0.82)';
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  // ─── Mobile menu ─────────────────────────────────────────────────────────────
  private initMobileMenu(): void {
    const hamburger = document.getElementById('navHamburger');
    const menu      = document.getElementById('mobileMenu');
    const closeBtn  = document.getElementById('mobileMenuClose');

    if (!hamburger || !menu) return;

    const open = () => {
      this.mobileMenuOpen = true;
      menu.removeAttribute('hidden');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      this.mobileMenuOpen = false;
      menu.setAttribute('hidden', '');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      this.mobileMenuOpen ? close() : open();
    });

    closeBtn?.addEventListener('click', close);

    // Close on link click
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', close);
    });

    // Close on Escape
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.mobileMenuOpen) close();
    });
  }

  // ─── Ratio bar animation (triggered by scroll reveal) ────────────────────────
  private initRatioBars(): void {
    // Also animate fills that are already visible on load
    const ratioBlock = document.querySelector('.build-ratio');
    if (!ratioBlock) return;

    const ratioObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.ratio-fill');
            fills.forEach((fill) => {
              const el = fill as HTMLElement;
              const pct = el.getAttribute('data-pct') ?? '0%';
              setTimeout(() => { el.style.width = pct; }, 300);
            });
            ratioObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    ratioObserver.observe(ratioBlock);
  }

  // ─── Active nav link highlight on scroll ─────────────────────────────────────
  private initSmoothClose(): void {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.style.color = 'var(--brass)';
              } else {
                link.style.color = '';
              }
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }
}