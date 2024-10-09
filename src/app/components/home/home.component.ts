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
import { ProfileService } from 'src/app/services/profile-service';


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
  profileImageMap = new Map<string, string>();
  userNames: string[] = [];
  // Create an array to track the visibility state for each post
  showFullMessage: boolean[] = [];

  constructor(
    private postService: PostService,
    private profileService: ProfileService,
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
          this.userNames = response.posts.map((post: Post) => post.author?.username);
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
          this.userNames.forEach((username: string) => {
            if (!(username in this.profileImageMap)) {
              this.getProfileImage(username);
            }
          });
          this.button = 'Load More';
        }
      });
    }, 500)
  }

  //Toggle read-more option to show full post message
  toggleReadMore(index: number) {
    this.showFullMessage[index] = !this.showFullMessage[index];
  }

  getMessageLength(message: string): number {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = message;
    return tempDiv.innerText.trim().length;
  }

  //Get truncated message to show (More option is provided to see complete post/message)
  getTruncatedMessage(message: string): string {
    const messageLength = this.getMessageLength(message);
    if (messageLength > 300) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = message;
      return tempDiv.innerText.slice(0, 300) + '...';
    }
    return message; // Return the full message if it's shorter than 300 characters
  }

  loadSnackBar(message: string): void {
    this.snack.open(message, "Ok", { duration: 3000, });
  }

  getTimeAgo(timestamp: string): string {
    return this.utility.getTimeAgo(timestamp);
  }

  //Fetch the profile image of the user and store it in map
  getProfileImage(username: string) {
    this.profileService.getProfileImage(username).subscribe({
      next: (response) => {
        console.log("response in getProfile: ", response)
        const reader = new FileReader();
        reader.onload = () => {
          this.profileImageMap.set(username, reader.result as string);
        };
        reader.readAsDataURL(response);
      },
      error: (error) => {
        console.log("Error fetching profile image for : ", username);
      }
    });
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
