import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent {
  selectedFile!: File;
  
  constructor() { }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    //     this.authService.loginUser(this.loginForm.value).subscribe({
    //       next: (response) => {
    //         localStorage.setItem('token', response.token);
    //         localStorage.setItem('username', response.username);
    //       },
    //       error: (error) => this.loadSnackBar(error.error.message),
    //       complete: () => {
    //         this.loadSnackBar("Login Successful...");
    //         this.router.navigate(['/home']);
    //       }
    //     });

    //     this.http.post('http://your-backend-server/upload', formData).subscribe(
    //       (response) => {
    //         // Handle the response from the server
    //       },
    //       (error) => {
    //         // Handle errors
    //       }
    //     );
    //   }
  }
  
}
