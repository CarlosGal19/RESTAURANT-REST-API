let objClient = {
    table: '',
    hour: '',
    order: []
}

const btnSave =  document.querySelector('#guardar-cliente');

btnSave.addEventListener('click', saveClient);

function saveClient(){
    const tableForm = document.querySelector('#mesa').value;
    const hourForm = document.querySelector('#hora').value;
    const emptyFields = [tableForm, hourForm].some(value => value === '');
    if (emptyFields) {
        showAlert('All fields are required');
    }
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
