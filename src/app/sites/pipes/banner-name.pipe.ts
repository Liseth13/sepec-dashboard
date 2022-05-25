import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bannerName'
})
export class BannerNamePipe implements PipeTransform {

  transform(bannerId: string, banners:any[]): string {
   
    const banner: any = banners.find(b => b.id === bannerId);
    return banner ? banner.name : ''


  }

}
