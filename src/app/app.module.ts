import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ProfileDetailsComponent } from './components/profile/profile-details/profile-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserDetailsComponent } from './components/profile/user-details/user-details.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { NewUsersComponent } from './components/home/new-users/new-users.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationInterceptor} from './interceptor/authentication.interceptor';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavigationComponent,
    ProfileComponent,
    ProfileDetailsComponent,
    UserDetailsComponent,
    NewPostComponent,
    ConfirmationDialogComponent,
    NewUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxOtpInputModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatTabsModule,
    MatDialogModule,
    AngularEditorModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
