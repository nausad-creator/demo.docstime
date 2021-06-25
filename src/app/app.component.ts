import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Cookie } from 'ng2-cookies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgcCookieConsentService, NgcInitializeEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { Subscription } from 'rxjs';
import { filter, map, mergeMap, timeout } from 'rxjs/operators';
import { DocsService } from './docs/docs.service';
import { FacilityLoginSignupComponent } from './facility-login-signup/facility-login-signup.component';
import { FacilityService } from './facility/facility.service';
import { HomeService } from './home.service';
import { LoginSignupModalComponent } from './login-signup-modal/login-signup-modal.component';
import { SeoService } from './seo.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  bsModalRef: BsModalRef;
  // for session timeout
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  private timeOut: Subscription;
  private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;
  private initializeSubscription: Subscription;
  private statusChangeSubscription: Subscription;
  private revokeChoiceSubscription: Subscription;
  private noCookieLawSubscription: Subscription;
  constructor(
    private service: HomeService,
    private router: Router,
    private ccService: NgcCookieConsentService,
    private cd: ChangeDetectorRef,
    private idle: Idle,
    private keepalive: Keepalive,
    private swUpdate: SwUpdate,
    private seoService: SeoService,
    private activatedRoute: ActivatedRoute,
    private facilityService: FacilityService,
    private docService: DocsService,
    private modalService: BsModalService,
  ) { }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.activatedRoute), map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter((route) => route.outlet === 'primary'), mergeMap((route) => route.data)).subscribe(data => {
        const seoData = data.seo;
        this.seoService.updateTitle(seoData.title);
        this.seoService.updateMetaTags(seoData.metaTags);
      });
    // create canonical
    this.seoService.createCanonicalURL();
    // check for new update
    this.checkForUpdate();
    // cookie consent
    this.cookieConsent();
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.idle.watch();
        Cookie.set('url', event.url);
      });
    // for scrolling
    ($(window) as any).scroll(() => {
      const windowTop = $(window).scrollTop() + 1;
      if (windowTop > 50) {
        $('.main_menu').addClass('menu_fixed animated fadeInDown');
      } else {
        $('.main_menu').removeClass('menu_fixed animated fadeInDown');
      }
    });
    // sets an idle timeout of 60 seconds.
    this.idle.setIdle(60);
    // sets a timeout period of 60 seconds. after 1800 seconds of inactivity, the user will be considered timed out (30 minutes).
    this.idle.setTimeout(1800);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.sessionTimeOut();
    this.cd.markForCheck();
  }
  checkForUpdate = () => {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version is available. Load New version?')) {
          window.location.reload();
        }
      });
    }
  }
  onActivate = () => {
    window.scroll(0, 0);
  }
  sessionTimeOut = () => {
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
    });
    this.timeOut = this.idle.onTimeout.subscribe(() => {
      let user: string;
      this.idleState = 'Timed out!';
      this.timedOut = true;
      // unsubscribing from observables
      this.docService.unSubscribe();
      this.docService.unSubs();
      this.facilityService.unSubscribe();
      this.facilityService.unSubs();
      this.service.unSubscribe();
      // removing user from local or session refer
      if (this.service.getDocLocal()) {
        user = 'refer';
        this.service.removeLocal();
      }
      if (this.service.getDocSession()) {
        user = 'refer';
        this.service.removeSession();
      }
      // removing user from local or session facility
      if (this.service.getFaLocal()) {
        user = 'facility';
        this.service.removeFaLocal();
      }
      if (this.service.getFaSession()) {
        user = 'facility';
        this.service.removeFaSession();
      }
      if (window.sessionStorage) {
        sessionStorage.clear();
      }
      setTimeout(() => {
        if (user === 'facility'){
          this.openFacility();
          this.unsubscribeTimeout();
          user = '';
        }
        if (user === 'refer'){
          this.openDoctor();
          this.unsubscribeTimeout();
          user = '';
        }
        this.router.navigate(['/']);
      }, 500);
    });
    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
    });
    this.idle.onTimeoutWarning.subscribe((countdown: number) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }
  unsubscribeTimeout = () => {
    this.timeOut.unsubscribe();
  }
  reset = () => {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  openFacility = () => {
    this.bsModalRef = this.modalService.show(FacilityLoginSignupComponent, { id: 99 });
    this.bsModalRef.content.event.subscribe((res: { data: string; }) => {
      if (res.data === 'Confirmed') {
        setTimeout(() => {
          this.router.navigate(['/facility/facility-dashboard']);
        }, 100);
      } else {
        console.error(res.data);
      }
    });
  }
  openDoctor = () => {
    this.bsModalRef = this.modalService.show(LoginSignupModalComponent, { id: 223 });
    this.bsModalRef.content.event.subscribe((res: { data: string; }) => {
      if (res.data === 'Confirmed') {
        setTimeout(() => {
          this.router.navigate(['/doctor/dashboard']);
        }, 100);
      } else {
        console.error(res.data);
      }
    });
  }
  ngOnDestroy(): void {
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializeSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }
  cookieConsent = () => {
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
      () => {
        console.log('popupOpen');
      });
    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
      () => {
        console.log('popuClose');
      });
    this.initializeSubscription = this.ccService.initialize$.subscribe(
      (event: NgcInitializeEvent) => {
        console.log(`initialize: ${JSON.stringify(event)}`);
      });
    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        console.log(`statusChange: ${JSON.stringify(event)}`);
      });
    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        console.log(`revokeChoice`);
      });
    this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        console.log(`noCookieLaw: ${JSON.stringify(event)}`);
      });
  }
}
