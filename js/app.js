let objClient = {
    table: '',
    hour: '',
    order: []
}

const btnSave =  document.querySelector('#guardar-cliente');

btnSave.addEventListener('click', saveClient);

function saveClient(){
    const table = document.querySelector('#mesa').value;
    const hour = document.querySelector('#hora').value;
    const emptyFields = [table, hour].some(value => value === '');
    if (emptyFields) {
        showAlert('All fields are required');
        return
    }

    objClient = {...objClient, table, hour};

    const modalForm= document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
    modalBootstrap.hide();

    showSections();

}

function showAlert(message) {
    const alertExist = document.querySelector('.invalid-feedback')
    if (!alertExist) {
        const alert = document.createElement('DIV');
        alert.classList.add('invalid-feedback', 'd-block', 'text-center');
        alert.textContent=message;
        document.querySelector('.modal-body form').appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

function showSections() {
    const hiddenSections = document.querySelectorAll('.d-none');
    hiddenSections.forEach(section => section.classList.remove('d-none'));
}
