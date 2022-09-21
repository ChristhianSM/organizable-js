
function render () {
  return `
  <section class="modal js-modal">
    <div class="modal__container js-container-edit-note">
      <div class="modal__close mb-4 js-close-modal">
        <img src="assets/icons/icon-close.svg" width="20" height="20" alt="">
      </div>
      <div class="flex justify-center gap-4">
        <form action="" class="form-create-board js-form-create-board" data-color="white">
          <input type="text" required class="js-input-create-form" name="title">
          <button type="submit" class="button">CREATE</button>
        </form>
        <div class="paleta">
          <div style="background-color: #90DBAF;" class="paleta-color" data-color = "#90DBAF"></div>
          <div style="background-color: #F77474;" class="paleta-color" data-color = "#F77474"></div>
          <div style="background-color: #60B5E5;" class="paleta-color" data-color = "#60B5E5"></div>
          <div style="background-color: #FFA759;" class="paleta-color" data-color = "#FFA759"></div>
          <div style="background-color: #C499EC;" class="paleta-color" data-color = "#C499EC"></div>
          <div style="background-color: #FABBD0;" class="paleta-color" data-color = "#FABBD0"></div>
          <div style="background-color: #42D781;" class="paleta-color" data-color = "#42D781"></div>
          <div style="background-color: #BDBDBD;" class="paleta-color" data-color = "#BDBDBD"></div>
          <div style="background-color: #9DE0F9;" class="paleta-color" data-color = "#9DE0F9"></div>
        </div>
      </div>
    </div>
  </section>
  `
}

function Modal() {
  return {
    toString(){
      return render();
    },
    addListeners() {
    },
    state :{
    }
  }
}

export default Modal;