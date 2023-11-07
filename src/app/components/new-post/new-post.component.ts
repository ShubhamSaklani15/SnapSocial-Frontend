import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PostService } from 'src/app/services/post-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {
  imageUrl!: any;
  htmlElement!: string;
  name!: string;
  username!: string;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '22rem',
    maxHeight: '22rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'justifyFull',
        'indent',
        'outdent',
        'fontName',
        'heading'
      ],
      [
        'backgroundColor',
        'fontSize',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'toggleEditorMode'
      ]
    ],
  }
  @ViewChild('newPostDialog', { static: true }) newPostDialog!: TemplateRef<any>;

  constructor(
    private dataService: DataService,
    private postService: PostService,
    private dialog: MatDialog,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  ngOnInit() {
    this.name = localStorage.getItem('name') ?? "";
    this.username = localStorage.getItem('username') ?? "";
    this.dataService.getProfileImageObservable().subscribe((imageUrl: string) => {
      this.imageUrl = imageUrl;
    });
  }

  openNewPostDialog() {
    const dialogRef = this.dialog.open(this.newPostDialog, {
      disableClose: true,
      width: "50%",
      height: "530px"
    });
  }

  openConfirmationDialog() {
    const dialogConfig = this.configureConfirmationDialog();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(action => {
      if (action === 'yes') {
        //add loader
        this.htmlElement = this.htmlElement.replace(/<img /g, '<img style="height: 100px; width: 100px;" ');

        const post: Post = {
          message: this.htmlElement,
          author: {
            name: this.name,
            username: this.username
          },
          timestamp: new Date().toISOString(),
        }
                this.addNewPost(post);
      }
    });
  }

  addNewPost(post: Post) {
    this.postService.addNewPost(post).subscribe({
      next: (response) => console.log("Response from addNewPost: ", response),
      error: (error) => this.loadSnackBar("Internal Server Error"),
      complete: () => {
        this.loadSnackBar("Post Added...");
        this.closeNewPostDialog();
        this.dataService.notifyNewPost();
        this.htmlElement = "";
        //close loader
      }
    });
  }
  configureConfirmationDialog(): MatDialogConfig<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = "auto";
    dialogConfig.width = "auto";
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    const heading = "Add Post";
    const confirmationMessage = "Are you sure you want to add this post ?";
    const [option1, option2] = ["Discard", "Post"];
    dialogConfig.data = { heading: heading, confirmationMessage: confirmationMessage, option1: option1, option2: option2 };
    return dialogConfig;
  }

  closeNewPostDialog() {
    this.dialog.closeAll();
  }

  gotoProfile() {
    this.closeNewPostDialog();
    this.router.navigate(['/', 'profile']);
  }

  loadSnackBar(message: string) {
    this.snack.open(message, "Ok", { duration: 3000, });
  }

}
