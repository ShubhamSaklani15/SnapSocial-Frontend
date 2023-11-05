import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  isLoading = false;
  button: string = "Load More"
  constructor(
    private postService: PostService,
    private snack: MatSnackBar
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') ?? "";
    this.loadMorePosts();
  }

  loadMorePosts() {
    this.isLoading = true;
    this.button = 'Loading';
    setTimeout(() => {
      this.postService.getPosts(this.username, this.pageNumber).subscribe({
        next: (response) => {
          if (isEmpty(response.posts)) {
            this.loadMore = false;
          }
          this.myPosts.push(...response.posts);
          this.pageNumber++;
        },
        error: (error) => {
          this.isLoading = false;
          this.button = 'Load More';
          this.loadSnackBar("Internal Server Error");
          console.log("Error in getProfileImage: ", error)
        },
        complete: () => {
          this.isLoading = false;
          this.button = 'Load More';
        }
      });
    }, 500)
  }

  loadSnackBar(message: string) {
    this.snack.open(message, "Ok", { duration: 3000, });
  }
}
