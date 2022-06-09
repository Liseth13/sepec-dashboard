import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Pagination } from 'src/app/shared/interfaces/Pagination';
import { Menu } from '../../interfaces/menu';

@Component({
  selector: 'app-third-level-menus',
  templateUrl: './third-level-menus.component.html',
  styleUrls: ['./third-level-menus.component.scss']
})
export class ThirdLevelMenusComponent implements OnInit, OnChanges {
  @Input() menus : Array<Menu> = [];

  @Input() sites : Array<any> = [];
  
  @Input() pages : Array<any> = [];

  @Input() allMenus : Array<any> = [];
  
  @Output() messageEvent = new EventEmitter<Menu>();

  menusForTable : Array<Menu> = [];
  
  submenus : Array<Menu> = [];

  pagMenu = new Pagination();

  tableMode : 'all' | 'actives' | 'inactives' | string = 'all';
 

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    changes.menus && this.showMenus( this.tableMode );
  }

  ngOnInit(): void {
    this.showMenus('all');
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

  chooseMenus = ( menu : any ) => {
    this.messageEvent.emit(menu);
  }

}
