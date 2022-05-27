import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'menuName'
})
export class MenuNamePipe implements PipeTransform {

  transform(menuId: string, menus: any[]): string {
    
    const menu : any = menus.find(m => m.id === menuId);
    return menu? menu.title : '';
  }

}
