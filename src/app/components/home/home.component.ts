import { Component } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  username!: string;
  myPosts!: Post[];
  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') ?? "";
    this.fetchMyPosts();
  }
  fetchMyPosts() {
    this.postService.getPosts(this.username).subscribe({
      next: (response) => {
        this.myPosts = response.posts;
      },
      error: (error) => console.log("Error in getProfileImage: ", error)
    });
  }
}
