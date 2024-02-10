import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { DataService } from 'src/app/services/data.service';
import { ProfileService } from 'src/app/services/profile-service';
import { Utility } from 'src/app/utility/utility';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  imageUrl!: any;
  name: string | null = localStorage.getItem('name');
  username: string | null = localStorage.getItem('username');
  utility!: Utility;
  
  constructor(
    private profileService: ProfileService,
    private dataService: DataService,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataService.getProfileImageObservable().subscribe((imageUrl: string) => {
      this.imageUrl = imageUrl;
    });
    if (isEmpty(this.imageUrl) && !isEmpty(this.username)) {
      this.getProfileImage();
    }
    this.utility = new Utility();
  }

  getProfileImage() {
    this.profileService.getProfileImage(localStorage.getItem('username')).subscribe({
      next: (response) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
          this.dataService.updateProfileImage(this.imageUrl);
        };
        reader.readAsDataURL(response);
      },
      error: (error) => {
        console.log("Error in getProfileImage: ", error);
        this.imageUrl = "";
        this.dataService.updateProfileImage(this.imageUrl);
        if (error?.statusText === 'Unauthorized') {
          this.utility.resetLocalStorage();
          this.router.navigate(['/login']);
          this.loadSnackBar("Session Expired. Please login again.");
        } else {
          this.loadSnackBar("Internal Server Error");
        }
      }
    });
  }

  logOut() {
    localStorage.removeItem('name');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.imageUrl = "";
    this.dataService.updateProfileImage(this.imageUrl);
    this.username = "";
    this.router.navigate(['/login']);
  }

  isUserLogin() {
    return !isEmpty(this.username);
  }

  loadSnackBar(message: string): void {
    this.snack.open(message, "Ok", { duration: 3000, });
  }
}
