import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class ReReferStoreGuard implements CanActivate {
  constructor(
    private service: Store,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isEmpty(this.service.reRefer) && !this.isBlank(this.service.reRefer)) {
      return true;
    } else {
      switch (state.url) {
        case '/facility/facility-dashboard/re-refer-case':
          return this.router.createUrlTree([`/facility/facility-dashboard`], { queryParams: { reload_view: true } });
        case '/facility/facility-doctors-list/re-refer-case':
          return this.router.createUrlTree([`/facility/facility-doctors-list`], { queryParams: { reload_view: true } });
        case '/facility/facility-referral-received/re-refer-case':
          return this.router.createUrlTree([`/facility/facility-referral-received`], { queryParams: { reload_view: true } });
        case '/facility/facility-referral-sent/re-refer-case':
          return this.router.createUrlTree([`/facility/facility-referral-sent`], { queryParams: { reload_view: true } });
        case '/facility/facility-add-refer-case/re-refer-case':
          return this.router.createUrlTree([`/facility/facility-add-refer-case`], { queryParams: { reload_view: true } });
        case '/facility/facility-notifications/re-refer-case':
          return this.router.createUrlTree([`/facility/facility-notifications`], { queryParams: { reload_view: true } });
        case '/facility/my-schedule-re-refer-case':
          return this.router.createUrlTree([`/facility/facility-my-schedule`]);
        default: return this.router.createUrlTree([`/facility/facility-dashboard`], { queryParams: { reload_view: true } });
      }
    }
  }
  isEmpty = (str: string | any[]) => {
    return (!str || 0 === str.length);
  }
  isBlank = (str: string | any) => {
    return (!str || /^\s*$/.test(str));
  }
}

