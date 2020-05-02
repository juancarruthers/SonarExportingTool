import Swal, { SweetAlertIcon } from 'sweetalert2';


export class SweetAlert {


  constructor(private progressModal = Swal) {}

  onLoad(): void{

    this.progressModal.fire({
      title:'Loading',
      html: '<span id="action"></span>',
      allowOutsideClick: false,
      onBeforeOpen:() => {
        Swal.showLoading()
      },

    })

  }

  update(p_title: string): void{
    document.getElementById("action").innerHTML = p_title;
  }

  completed(p_text : string, p_result : SweetAlertIcon):void{
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: p_result,
      title: p_text
    })
  }

  close(): void{
    this.progressModal.close();
  }

  error(p_errorMessage: string): void{
    const swalWithBootstrapButtons = this.progressModal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      icon: 'error',
      title: 'Oops...',
      text: p_errorMessage,
    })
  }

}