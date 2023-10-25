import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  imageUrl!: any;
  name: string | null = localStorage.getItem('name');
  username: string | null = localStorage.getItem('username');

  constructor(
    private profileService: ProfileService,
    private snack: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getProfileImage();
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
        error: (error) => this.imageUrl = "",
        complete: () => this.loadSnackBar("Image uploaded successfully")
      });
    } else {
      this.imageUrl = null;
    }
  }

  getProfileImage() {
    this.profileService.getProfileImage(this.username).subscribe({
      next: (response) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(response);
      },
      error: (error) => {
        this.imageUrl = "";
      }
    });
  }

  loadSnackBar(message: string) {
    this.snack.open(message, "Ok", { duration: 3000, });
  }

}
