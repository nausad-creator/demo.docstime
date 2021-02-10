import {Observable, BehaviorSubject} from 'rxjs';

export class Store {
    initialState = '';
    stateOb$: Observable<string>;
    private stateBe$: BehaviorSubject<string>;
    // re-refer
    referState = '';
    referOb$: Observable<string>;
    private referBe$: BehaviorSubject<string>;

    constructor() {
        this.stateBe$ = new BehaviorSubject(this.initialState);
        this.stateOb$ = this.stateBe$.asObservable() as Observable<string>;
        // re-refer
        this.referBe$ = new BehaviorSubject(this.referState);
        this.referOb$ = this.referBe$.asObservable() as Observable<string>;
    }

    get referView(): string {
        return this.stateBe$.getValue();
    }
    get reRefer(): string {
        return this.referBe$.getValue();
    }

    setReferView = (nextState: string) => {
        this.stateBe$.next(nextState);
    }
    setRerefer = (nextState: string) => {
        this.referBe$.next(nextState);
    }
}
