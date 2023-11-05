import { Component } from '@angular/core';
import { isEmpty } from 'lodash';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  username!: string;
  myPosts: Post[] = [];
  pageNumber: number = 1;
  loadMore: boolean = true;
  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') ?? "";
    this.loadMorePosts();
  }

  loadMorePosts() {
    this.postService.getPosts(this.username, this.pageNumber).subscribe({
      next: (response) => {
        if (isEmpty(response.posts)) {
          this.loadMore = false;
        }
        this.myPosts.push(...response.posts);
        this.pageNumber++;
      },
      error: (error) => console.log("Error in getProfileImage: ", error)
    });
  }
}
