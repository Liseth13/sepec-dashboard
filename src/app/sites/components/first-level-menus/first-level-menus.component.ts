import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Pagination } from 'src/app/shared/interfaces/Pagination';
import { Menu } from '../../interfaces/menu';

@Component({
  selector: 'app-first-level-menus',
  templateUrl: './first-level-menus.component.html',
  styleUrls: ['./first-level-menus.component.scss']
})
export class FirstLevelMenusComponent implements OnInit, OnChanges {

  @Input() menus : Array<Menu> = [];

  @Input() sites : Array<any> = [];
  
  @Input() pages : Array<any> = [];

  @Input() allMenus : Array<any> = [];

  menusForTable : Array<Menu> = [];
  
  submenus : Array<Menu> = [];

  pagMenu = new Pagination();

  tableMode : 'all' | 'actives' | 'inactives' | string = 'all';


  constructor() { }
  
  ngOnInit(): void {
    this.showMenus('all');
  }

  ngOnChanges(changes: SimpleChanges): void {
    changes.menus && this.showMenus( this.tableMode );
  }

  showMenus = ( mode : string ) => {
    if ( mode === 'all' ) {
      this.menusForTable = this.menus;
    }

    if ( mode === 'actives' ){
      this.menusForTable = this.menus.filter((m:Menu) => m.is_active);
    }

    if ( mode === 'inactives' ){
      this.menusForTable = this.menus.filter((m:Menu) => !m.is_active);
    }

    this.pagMenu.collectionSize = this.menusForTable.length;
    this.pagMenu.page = 1;
  }

}
