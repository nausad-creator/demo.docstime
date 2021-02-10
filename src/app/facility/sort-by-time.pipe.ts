import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByTime'
})
export class SortByTimePipe implements PipeTransform {
  transform(appointments: Array<any>): any {
    if (appointments !== undefined || appointments !== null){
      appointments.sort((a, b) => {
        a.statusDate = new Date(`${a.refercaseVisitDate} ${a.refercaseVisitTime}`);
        b.statusDate = new Date(`${b.refercaseVisitDate} ${b.refercaseVisitTime}`);
        if (a.statusDate.getTime() < b.statusDate.getTime()) { return -1; }
        if (a.statusDate.getTime() > b.statusDate.getTime()) { return 1; }
        return 0;
      });
      return appointments;
    }
    return appointments;
  }
}
