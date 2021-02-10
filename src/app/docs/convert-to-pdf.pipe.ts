import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToPdf'
})
export class ConvertToPdfPipe implements PipeTransform {
  transform(doculists: Array<any>): any {
    if (doculists !== undefined || doculists !== null) {

      const arrDocumentTypeDate = [
        { documenttypeName: 'Physician Notes', ImageData: [] },
        { documenttypeName: 'Patient Referral', ImageData: [] },
        { documenttypeName: 'Others', ImageData: [] },
        { documenttypeName: 'Lab', ImageData: [] },
        { documenttypeName: 'Discharge Note', ImageData: [] } ];

      doculists.forEach((doc) => {
        if (doc.documenttypeName === 'Physician Notes') {
          arrDocumentTypeDate[0].ImageData.push(`https://demo.docstime.com/backend/web/uploads/doctor/${doc.documentFilename}`);
        }
        if (doc.documenttypeName === 'Patient Referral') {
          arrDocumentTypeDate[1].ImageData.push(`https://demo.docstime.com/backend/web/uploads/doctor/${doc.documentFilename}`);
        }
        if (doc.documenttypeName === 'Others') {
          arrDocumentTypeDate[2].ImageData.push(`https://demo.docstime.com/backend/web/uploads/doctor/${doc.documentFilename}`);
        }
        if (doc.documenttypeName === 'Lab') {
          arrDocumentTypeDate[3].ImageData.push(`https://demo.docstime.com/backend/web/uploads/doctor/${doc.documentFilename}`);
        }
        if (doc.documenttypeName === 'Discharge Note') {
          arrDocumentTypeDate[4].ImageData.push(`https://demo.docstime.com/backend/web/uploads/doctor/${doc.documentFilename}`);
        }
      });
      return arrDocumentTypeDate.filter(data => data.ImageData.length > 0);
    }
    return doculists;
  }
}
