import { Pipe, PipeTransform } from '@angular/core';
import { Page } from '../interfaces/Page';

@Pipe({
  name: 'pageName'
})
export class PageNamePipe implements PipeTransform {

  transform(idPage : string, pages : Page[]): string {
    const page : Page = pages.find(s => s.id === idPage);
    return page? page.name : '';
  }

}
