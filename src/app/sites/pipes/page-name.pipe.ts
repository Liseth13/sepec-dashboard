import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pageNameTwo'
})
export class PageNameTwoPipe implements PipeTransform {

  transform(idPage : string, pages : any []): string {
    const page = pages.find(s => s.id === idPage);
    return page? page.name : '';
  }

}
