import { Component } from '@angular/core';
import { isEmpty } from 'lodash';
import { UserData } from 'src/app/models/user';
import { ProfileService } from 'src/app/services/profile-service';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.css']
})
export class NewUsersComponent {

  newUsers: UserData[] = [];
  loader: boolean = true;
  constructor(private userService: UserService, private profileService: ProfileService) { }

  ngOnInit() {
    this.getNewUsers();
  }

  getNewUsers() {
    this.userService.getNewUsers().subscribe({
      next: (response) => {
        if (!isEmpty(response.users)) {
          this.newUsers = response.users;
        }
        this.loader = false;
        console.log("new User: ");
        console.log(this.newUsers);
      },
      error: (error) => {
        this.newUsers = [];
      },
      complete: () => {
        this.newUsers.forEach((newUser: UserData) => {
          this.getProfileImage(newUser);
          console.log("new profile: ", newUser.profile);
        })
      }
    });
  }
  getProfileImage(user: UserData | any) {
    this.profileService.getProfileImage(user.username).subscribe({
      next: (response) => {
        console.log("response in getProfile: ", response)
        const reader = new FileReader();
        reader.onload = () => {
          user["newField"] = reader.result as string;
        };
        reader.readAsDataURL(response);
      },
      error: (error) => {
        console.log("Error fetching profile image for : ", user.username);
      }
    });
  }
}
