import { Pipe, PipeTransform } from '@angular/core';
import { Page } from '../../web-pages/interfaces/Page';

@Pipe({
  name: 'counterStatus'
})
export class CounterStatusPipe implements PipeTransform {

  transform(items : any[], statusToCount : boolean ) : number {

    let actives   : number = 0;
    let inactives : number = 0;

    items.forEach(i => {
      i.is_active? actives ++ : inactives ++ ;
    });
    return statusToCount? actives : inactives ;
  }

}
