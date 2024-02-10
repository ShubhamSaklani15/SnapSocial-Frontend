import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty } from 'lodash';
import { Post } from 'src/app/models/post';
import { DataService } from 'src/app/services/data.service';
import { PostService } from 'src/app/services/post-service';
import { Utility } from 'src/app/utility/utility';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  utility!: Utility;
  constructor(
    private postService: PostService,
    private snack: MatSnackBar,
    private dataService: DataService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') ?? '';
    this.utility = new Utility();
    this.dataService.getProfileImageObservable().subscribe((imageUrl: string) => {
      this.imageUrl = imageUrl;
    });
    this.dataService.getNewPostObservable().subscribe(() => {
      this.pageNumber = 1;
      this.loadMorePosts(true);
    });
  }

  loadMorePosts(newPostAdded: boolean) {
    this.isLoading = true;
    this.button = 'Loading';
    setTimeout(() => {
      this.postService.getPosts(this.username, this.pageNumber).subscribe({
        next: (response) => {
          if (isEmpty(response.posts)) {
            this.loadMore = false;
          }
          if (newPostAdded) {
            this.myPosts = response.posts;
          } else {
            this.myPosts.push(...response.posts);
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

}