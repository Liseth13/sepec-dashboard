import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'siteName'
})
export class SiteNamePipe implements PipeTransform {

  transform(siteId: string, sites : any []): string {
    const site = sites.find(s => s.id === siteId);
    return site? site.name : '';
  }

}
