import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DocStore } from './doc-store.service';

@Injectable({
  providedIn: 'root'
})
export class EditReferGuard implements CanActivate {
  constructor(
    private service: DocStore,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.isEmpty(this.service.editRefer) && !this.isBlank(this.service.editRefer)) {
      return true;
    } else {
      return this.router.createUrlTree([`/doctor/referrals-sent/view-refer`], { queryParams: { edit_refer: false } });
    }
  }
  isEmpty = (str: string | any[]) => {
    return (!str || 0 === str.length);
  }
  isBlank = (str: string | any) => {
    return (!str || /^\s*$/.test(str));
  }
}
