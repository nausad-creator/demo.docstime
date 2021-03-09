import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class RejectReferGuard implements CanActivate {
  constructor(
    private service: Store,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isEmpty(this.service.rejectRefer) && !this.isBlank(this.service.rejectRefer)) {
      return true;
    }
    if (state.url === '/facility/facility-dashboard/reject-re-refer-case') {
      return this.router.createUrlTree([`/facility/facility-dashboard`], { queryParams: { reject_refer: false } });
    }
    if (state.url === '/facility/facility-referral-received/reject-re-refer-case') {
        return this.router.createUrlTree([`/facility/facility-referral-received`], { queryParams: { reject_refer: false } });
    }
  }
  isEmpty = (str: string | any[]) => {
    return (!str || 0 === str.length);
  }
  isBlank = (str: string | any) => {
    return (!str || /^\s*$/.test(str));
  }
}
