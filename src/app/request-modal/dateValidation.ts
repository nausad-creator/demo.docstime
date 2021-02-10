import { FormControl } from '@angular/forms';
import * as moment from 'moment';

export function DateValidator(): any {
  return (control: FormControl): { [key: string]: any } => {
    const val = moment(control.value, 'MM/DD/YYYY', true);
    if (!val.isValid()) {
      return { invalidDate: true };
    }
    return null;
  };
}
