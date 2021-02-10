import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DocStore } from './doc-store.service';

@Injectable({
  providedIn: 'root'
})
export class DocViewGuard implements CanActivate {
  constructor(
    private service: DocStore,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isEmpty(this.service.referView) && !this.isBlank(this.service.referView)) {
      return true;
    } else {
      switch (state.url) {
        case '/doctor/referrals-received/view-refer':
          return this.router.createUrlTree([`/doctor/referrals-received`], { queryParams: { reload_view: true } });
        case '/doctor/referrals-sent/view-refer':
          return this.router.createUrlTree([`/doctor/referrals-sent`], { queryParams: { reload_view: true } });
        case '/doctor/dashboard/view-refer':
          return this.router.createUrlTree([`/doctor/dashboard`], { queryParams: { reload_view: true } });
        case '/doctor/notifications/view-refer':
          return this.router.createUrlTree([`/doctor/notifications`], { queryParams: { reload_view: true } });
        case '/doctor/add-refer-case/view-refer':
          return this.router.createUrlTree([`/doctor/add-refer-case`], { queryParams: { reload_view: true } });
        case '/doctor/doc-my-schedule-view-refer':
          return this.router.createUrlTree([`/doctor/my-schedule`]);
        default: return this.router.createUrlTree([`/doctor/dashboard`], { queryParams: { reload_view: true } });
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
