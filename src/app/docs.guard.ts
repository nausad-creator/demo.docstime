import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root'
})
export class DocsGuard implements CanActivate {
  constructor(
    private service: HomeService,
    private router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.service.getDocLocal() ? this.service.getDocLocal() : this.service.getDocSession();
    if (!this.isEmpty(currentUser) && !this.isBlank(currentUser)) {
      return true;
    } else {
      return this.router.createUrlTree(['/redirectMe']);
    }
  }
  isEmpty = (str: string | any[]) => {
    return (!str || 0 === str.length);
  }
  isBlank = (str: string | any) => {
    return (!str || /^\s*$/.test(str));
  }
}
