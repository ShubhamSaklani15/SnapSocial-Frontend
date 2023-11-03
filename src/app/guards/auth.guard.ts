import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const router: Router = inject(Router);
    if (token && username) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
};

export const loginAuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const router: Router = inject(Router);
    if (token && username) {
      router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
};
