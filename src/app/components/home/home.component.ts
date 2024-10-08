import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty, times } from 'lodash';
import { Post } from 'src/app/models/post';
import { DataService } from 'src/app/services/data.service';
import { PostService } from 'src/app/services/post-service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Utility } from 'src/app/utility/utility';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  token = localStorage.getItem('token');
  username!: string;
  allPosts: Post[] = [];
  pageNumber: number = 1;
  loadMore: boolean = true;
  isLoading = false;
  button: string = "Load More";
  utility!: Utility;
  // comments = new Map<string | undefined, boolean>();
  constructor(
    private postService: PostService,
    private dataService: DataService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') ?? "";
    this.utility = new Utility();
    this.dataService.getNewPostObservable().subscribe(() => {
      this.pageNumber = 1;
      this.loadMorePosts(true);
    });
  }

  loadMorePosts(newPostAdded: boolean) {
    this.isLoading = true;
    this.button = 'Loading';
    setTimeout(() => {
      this.postService.getAllPosts(this.pageNumber).subscribe({
        next: (response) => {
          if (isEmpty(response.posts)) {
            this.loadMore = false;
          }
          if (newPostAdded) {
            this.allPosts = response.posts;
          } else {
            this.allPosts.push(...response.posts);
          }
          this.pageNumber++;
        },
        error: (error) => {
          this.isLoading = false;
          this.button = 'Load More';
          if (error?.statusText === 'Unauthorized') {
            this.utility.resetLocalStorage();
            this.router.navigate(['/login']);
            this.loadSnackBar("Session Expired. Please login again.");
          } else {
            this.loadSnackBar("Internal Server Error");
          }
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
    return this.utility.getTimeAgo(timestamp);
  }

  openConfirmationDialog(id: string) {
    const heading = "Delete Post";
    const confirmationMessage = "Are you sure you want to delete this post ?";
    const [option1, option2] = ["No", "Yes"];
    const dialogConfig = this.utility.configureConfirmationDialog(heading, confirmationMessage, option1, option2);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((action: string) => {
      if (action === 'yes') {
        this.deletePost(id);
      }
    });
  }

  deletePost(id: string) {
    this.postService.deletePost(id).subscribe({
      error: (error) => {
        if (error?.statusText === 'Unauthorized') {
          this.utility.resetLocalStorage();
          this.router.navigate(['/login']);
          this.loadSnackBar("Session Expired. Please login again.");
        } else {
          this.loadSnackBar("Internal Server Error");
        }
      },
      complete: () => {
        this.dataService.updatePosts();
        this.loadSnackBar("Post Deleted")
      }
    });
  }

  toggleLike(post: Post, index: number) {
    this.updatePost(post, index);
  }

  // toggleComment(id: string | undefined) {
  //   if (this.comments.get(id) === true) {
  //     this.comments.set(id, false);
  //   } else {
  //     this.comments.set(id, true);
  //   }
  // }

  updatePost(post: Post, index: number) {
    this.postService.updatePost(post?._id, this.username).subscribe({
      next: (response: any) => {
        this.allPosts[index] = response.message;
      },
      error: (error) => {
        if (error?.statusText === 'Unauthorized') {
          this.utility.resetLocalStorage();
          this.router.navigate(['/login']);
          this.loadSnackBar("Session Expired. Please login again.");
        } else {
          this.loadSnackBar("Internal Server Error");
        }
        console.log("Error in updatePost ", error);
      },
      complete: () => console.log("post updated ")
    });
  }

  isLikedPost(post: Post) {
    const index = post?.likes?.users_liked?.indexOf(this.username) ?? -1;
    return (index != -1);
  }
}
