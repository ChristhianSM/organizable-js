export function notification(type, message) {
  toastr[type](message);

}
export function optionsToast(options = {progressBar: false, closeButton: false, position: 'toast-top-right' }) {
  toastr.options = {
    "closeButton": options.closeButton,
    "debug": false,
    "newestOnTop": true,
    "progressBar": options.progressBar,
    "positionClass": options.position,
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
}

export async function alert(message) {
  return await swal({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
}