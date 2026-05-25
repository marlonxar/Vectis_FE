import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements AfterViewInit, OnDestroy {

  mobileMenuOpen = false;

  private scrollListener!: () => void;

  ngAfterViewInit(): void {
    this.initRevealAnimations();
    this.initNavbarScroll();
    this.initActiveLinks();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    document.body.style.overflow = this.mobileMenuOpen
      ? 'hidden'
      : '';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  private initRevealAnimations(): void {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  private initNavbarScroll(): void {
    const nav = document.querySelector('nav');

    if (!nav) return;

    this.scrollListener = () => {
      if (window.scrollY > 20) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    };

    window.addEventListener('scroll', this.scrollListener, {
      passive: true
    });
  }

  private initActiveLinks(): void {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.getAttribute('id');

          links.forEach((link) => {
            link.classList.remove('active');

            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        });
      },
      {
        threshold: 0.35
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}