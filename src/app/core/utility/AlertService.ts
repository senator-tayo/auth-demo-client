import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message
    });
  }

  error(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }

  warning(message: string) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: message
    });
  }

  loading(message = 'Please wait...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  }

  close() {
    Swal.close();
  }
}