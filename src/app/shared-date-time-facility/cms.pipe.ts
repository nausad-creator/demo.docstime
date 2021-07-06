import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'cms'
})
export class CmsPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform = (value: any) => {
    if (value !== undefined || value !== null) {
      return this.sanitized.bypassSecurityTrustHtml(value);
    }
  }
}
