import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class StoreGuard implements CanActivate {
  constructor(
    private service: Store,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isEmpty(this.service.referView) && !this.isBlank(this.service.referView)) {
      return true;
    } else {
      switch (state.url) {
        case '/facility/facility-dashboard/view-refer':
          return this.router.createUrlTree([`/facility/facility-dashboard`], { queryParams: { reload_view: true } });
        case '/facility/facility-doctors-list/view-refer':
          return this.router.createUrlTree([`/facility/facility-doctors-list`], { queryParams: { reload_view: true } });
        case '/facility/facility-referral-received/view-refer':
          return this.router.createUrlTree([`/facility/facility-referral-received`], { queryParams: { reload_view: true } });
        case '/facility/facility-referral-sent/view-refer':
          return this.router.createUrlTree([`/facility/facility-referral-sent`], { queryParams: { reload_view: true } });
        case '/facility/facility-add-refer-case/view-refer':
          return this.router.createUrlTree([`/facility/facility-add-refer-case`], { queryParams: { reload_view: true } });
        case '/facility/facility-notifications/view-refer':
          return this.router.createUrlTree([`/facility/facility-notifications`], { queryParams: { reload_view: true } });
        case '/facility/my-schedule-view-refer':
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
