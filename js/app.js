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


