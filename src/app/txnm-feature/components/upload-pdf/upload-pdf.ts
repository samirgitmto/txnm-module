import { Component, SimpleChanges } from '@angular/core';

// what if i declare it here??
// The top of the file is for imports, helpers, and types—not for component state
//  or template data.
enum Status { Active, Inactive }

@Component({
  selector: 'app-upload-pdf',
  standalone: false,
  templateUrl: './upload-pdf.html',
  styleUrl: './upload-pdf.css'
})
export class UploadPdf {

  parentValue:string = "";

  // Holds form data
  formData: {
    username: string;
    email: string;
    password: string;
    avatar: File | null;
    country: string | null
  } = {
    username: '',
    email: '',
    password: '',
    avatar: null,
    country: null
  };


  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges:', changes);
  }
  
  ngDoCheck() {
    console.log('ngDoCheck triggered');
  }

  showAlert() {
    alert('Projected Button Clicked!');
  }

  // Handles file input change event
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.avatar = input.files[0];
    }
  }

  // Handles form submission
  onSubmit(form: any, event: Event) {
    event.preventDefault(); // Prevents default browser submit
    if (form.valid) {
      // Handle form submission (e.g., send to server)
      console.log('Form submitted:', this.formData);
      // You can add your upload logic here
    }
  }

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'IN', name: 'India' }
  ];
}
