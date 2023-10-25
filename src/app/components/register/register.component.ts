import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgxOtpInputConfig } from 'ngx-otp-input';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  otpGenerated: boolean = false;
  otpValue: string = "";
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeRegisterForm();
  }

  initializeRegisterForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  generateOtp() {
    if (this.registerForm.invalid) return;
    this.authService.generateOtp(this.registerForm.value).subscribe({
      next: (response) => console.log(response),
      error: (error) => this.loadSnackBar(error.error.message),
      complete: () => {
        this.registerForm.disable();
        this.loadSnackBar("Enter One Time Password.");
        this.otpGenerated = true;
      }
    });
  }

  registerUser() {
    if (this.registerForm.invalid) return;
    this.authService.registerUser(this.registerForm.value, this.otpValue).subscribe({
      next: (response) => console.log(response),
      error: (error) => this.loadSnackBar(error.error.message),
      complete: () => {
        this.loadSnackBar("Account Created Successfully...");
        this.router.navigate(['/login']);
      }
    });
  }

  handleFillEvent(value: string): void {
    this.otpValue = value;
  }

  handleOtpInputChange(event: any): void {
    this.otpValue = event.target.value;
  }

  loadSnackBar(message: string) {
    this.snack.open(message, "Ok", { duration: 3000, });
  }
}
