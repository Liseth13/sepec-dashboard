import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  
  // TEMPLATE
  public showSidebar = false;
  public config: PerfectScrollbarConfigInterface = {};
  constructor() { }

  ngOnInit(): void {
  }

  mobileSidebar() {
    this.showSidebar = !this.showSidebar;
  }

}
