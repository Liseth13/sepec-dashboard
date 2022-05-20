import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-content',
  templateUrl: './page-content.component.html',
  styleUrls: ['./page-content.component.scss']
})
export class PageContentComponent implements OnInit {

  @Input() public pageId : string = '';

  constructor() { }

  ngOnInit(): void {
    //console.log(this.pageId)
  }

}
