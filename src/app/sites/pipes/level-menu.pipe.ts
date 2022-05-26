import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'levelMenu'
})
export class LevelMenuPipe implements PipeTransform {

  transform( menus : any[], level : number): any[] {
    const filters : any = menus.filter( m => m.level === level )
    return filters;
  }

}
