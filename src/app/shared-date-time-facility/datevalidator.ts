import { FormControl } from '@angular/forms';
import * as moment from 'moment';

export function DateValidatorFacility(): any {
    return (control: FormControl): { [key: string]: any } => {
        if (control.value === '') {
            return null;
        }
        if (control.value === null) {
            const val = moment(control.value, 'MM/DD/YYYY', true);
            if (!val.isValid()) {
                return { invalidDate: true };
            }
        }
        return null;
    };
}
