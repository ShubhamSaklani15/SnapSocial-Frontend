import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ProfileService } from 'src/app/services/profile-service';
import { Utility } from 'src/app/utility/utility';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  imageUrl!: any;
  name: string | null = localStorage.getItem('name');
  username: string | null = localStorage.getItem('username');
  utility!: Utility;

  constructor(
    private profileService: ProfileService,
    private snack: MatSnackBar,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataService.getProfileImageObservable().subscribe((imageUrl : string) => {
      this.imageUrl = imageUrl;
    });
    this.utility = new Utility();
  }

  updateProfileImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageUrl = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('username', this.username ?? "");

      this.profileService.updateProfileImage(formData).subscribe({
        next: (response) => console.log('Image uploaded successfully', response),
        error: (error) => {
          this.imageUrl = "";
          this.dataService.updateProfileImage(this.imageUrl);
          if (error?.statusText === 'Unauthorized') {
            this.utility.resetLocalStorage();
            this.router.navigate(['/login']);
            this.loadSnackBar("Session Expired. Please login again.");
          } else {
            this.loadSnackBar("Internal Server Error");
          }
        },
        complete: () => {
          this.dataService.updateProfileImage(this.imageUrl);
          this.loadSnackBar("Image uploaded successfully");
        }
      });
    } else {
      this.imageUrl = null;
    }
  }

  loadSnackBar(message: string) {
    this.snack.open(message, "Ok", { duration: 3000, });
  }

}