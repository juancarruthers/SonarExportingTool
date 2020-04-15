import Swal from 'sweetalert2';


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

  update(p_title){
    document.getElementById("action").innerHTML = p_title;
  }

  close(){
    this.progressModal.close();
  }

  error(p_errorMessage: string){
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