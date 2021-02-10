import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root'
})
export class NotUserGuard implements CanActivate {
  constructor(
    private service: HomeService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const doctor = this.service.getDocLocal() ? this.service.getDocLocal() : this.service.getDocSession();
    const facility = this.service.getFaLocal() ? this.service.getFaLocal() : this.service.getFaSession();
    if (!this.isEmpty(doctor) && !this.isBlank(doctor)) {
      return this.router.createUrlTree(['/doctor/dashboard'], { queryParams: { redirect: true } });
    }
    if (!this.isEmpty(facility) && !this.isBlank(facility)) {
      return this.router.createUrlTree(['/facility/facility-dashboard'], { queryParams: { redirect: true } });
    }
    if (this.isEmpty(facility) && this.isBlank(facility)) {
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

