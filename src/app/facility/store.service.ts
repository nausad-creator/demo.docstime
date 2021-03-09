import {Observable, BehaviorSubject} from 'rxjs';

export class Store {
    initialState = '';
    stateOb$: Observable<string>;
    private stateBe$: BehaviorSubject<string>;
    // re-refer
    referState = '';
    referOb$: Observable<string>;
    private referBe$: BehaviorSubject<string>;
    // edit-refer
    referStateEdit = '';
    referObEdit$: Observable<string>;
    private referBeEdit$: BehaviorSubject<string>;
     // reject re-refer
     referStateReject = '';
     referObReject$: Observable<string>;
     private referBeReject$: BehaviorSubject<string>;

    constructor() {
        this.stateBe$ = new BehaviorSubject(this.initialState);
        this.stateOb$ = this.stateBe$.asObservable() as Observable<string>;
        // re-refer
        this.referBe$ = new BehaviorSubject(this.referState);
        this.referOb$ = this.referBe$.asObservable() as Observable<string>;
        // edit-refer
        this.referBeEdit$ = new BehaviorSubject(this.referStateEdit);
        this.referObEdit$ = this.referBeEdit$.asObservable() as Observable<string>;
        // reject re-refer
        this.referBeReject$ = new BehaviorSubject(this.referStateReject);
        this.referObReject$ = this.referBeReject$.asObservable() as Observable<string>;
    }

    get referView(): string {
        return this.stateBe$.getValue();
    }
    get reRefer(): string {
        return this.referBe$.getValue();
    }
    get editRefer(): string {
        return this.referBeEdit$.getValue();
    }
    get rejectRefer(): string {
        return this.referBeReject$.getValue();
    }

    setReferView = (nextState: string) => {
        this.stateBe$.next(nextState);
    }
    setRerefer = (nextState: string) => {
        this.referBe$.next(nextState);
    }
    setEditrefer = (nextState: string) => {
        this.referBeEdit$.next(nextState);
    }
    setRejectrefer = (nextState: string) => {
        this.referBeReject$.next(nextState);
    }
}
