import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEmpty, times } from 'lodash';
import { Post } from 'src/app/models/post';
import { DataService } from 'src/app/services/data.service';
import { PostService } from 'src/app/services/post-service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Utility } from 'src/app/utility/utility';


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
  button: string = "Load More";
  utilityInstance!: Utility;
  constructor(
    private postService: PostService,
    private dataService: DataService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') ?? "";
    this.utilityInstance = new Utility();
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
            this.myPosts = response.posts;
          } else {
            this.myPosts.push(...response.posts);
          }
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
    return this.utilityInstance.getTimeAgo(timestamp);
  }

  openConfirmationDialog(id: string) {
    const heading = "Delete Post";
    const confirmationMessage = "Are you sure you want to delete this post ?";
    const [option1, option2] = ["No", "Yes"];
    const dialogConfig = this.utilityInstance.configureConfirmationDialog(heading, confirmationMessage, option1, option2);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((action: string) => {
      if (action === 'yes') {
        this.deletePost(id);
      }
    });
  }

  deletePost(id: string) {
    this.postService.deletePost(id).subscribe({
      error: (error) => this.loadSnackBar("Internal Server Error"),
      complete: () => {
        this.dataService.updatePosts();
        this.loadSnackBar("Post Deleted")
      }
    });
  }
}
