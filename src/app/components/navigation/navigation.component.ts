import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { DataService } from 'src/app/services/data.service';
import { ProfileService } from 'src/app/services/profile-service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  imageUrl!: any;
  name: string | null = localStorage.getItem('name');
  username: string | null = localStorage.getItem('username');

  constructor(
    private profileService: ProfileService,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.dataService.getProfileImageObservable().subscribe((imageUrl: string) => {
      this.profileService.imageUrl = this.imageUrl = imageUrl;
    });
    if (isEmpty(this.imageUrl)) {
      this.getProfileImage();
    }
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
}
