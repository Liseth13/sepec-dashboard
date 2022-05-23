import { Component, Input, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  @Input() idPage : string = '';
  posts : Array<any> = [];
  public config: PerfectScrollbarConfigInterface = {};

  constructor(private postService : PostsService) { }

  ngOnInit(): void {
    this.get()
  }

  get(){
    this.postService.get().subscribe(
      ( res : any ) => {this.posts = res},
      ( error : any ) => {console.log(error)},
    )
  }

  change( id : string){
    alert(id)
  }

}
