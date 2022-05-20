import { Pipe, PipeTransform } from '@angular/core';
import { Page } from '../interfaces/Page';

@Pipe({
  name: 'counterStatus'
})
export class CounterStatusPipe implements PipeTransform {

  transform(pages: Page[], statusToCount : boolean ): number {

    let actives   : number = 0;
    let inactives : number = 0;

    pages.forEach(page => {
      page.is_active? actives ++ : inactives ++ ;
    });
    return statusToCount? actives : inactives ;
  }

}
