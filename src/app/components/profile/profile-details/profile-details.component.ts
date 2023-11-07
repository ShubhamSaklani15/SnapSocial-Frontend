import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty } from 'lodash';
import { Post } from 'src/app/models/post';
import { DataService } from 'src/app/services/data.service';
import { PostService } from 'src/app/services/post-service';
import { getTimeAgo } from 'src/app/utility/utility';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent {
  isLoading: boolean = false;
  button!: string;
  username!: string;
  pageNumber: number = 1;
  loadMore: boolean = true;
  myPosts: Post[] = [];
  imageUrl!: string;
  constructor(
    private postService: PostService,
    private snack: MatSnackBar,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') ?? '';
    this.dataService.getProfileImageObservable().subscribe((imageUrl: string) => {
      this.imageUrl = imageUrl;
    });
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
        },
        complete: () => {
          this.isLoading = false;
          this.button = 'Load More';
        }
      });
    }, 500)
  }

  loadSnackBar(message: string): void {
    this.snack.open(message, "Ok", { duration: 3000, });
  }

  getTimeAgo(timestamp: string): string {
    return getTimeAgo(timestamp);
  }

}