let objClient = {
    table: '',
    hour: '',
    order: []
}

const btnSave = document.querySelector('#guardar-cliente');

btnSave.addEventListener('click', saveClient);

function saveClient() {
    const table = document.querySelector('#mesa').value;
    const hour = document.querySelector('#hora').value;
    const emptyFields = [table, hour].some(value => value === '');
    if (emptyFields) {
        showAlert('All fields are required');
        return
    }

    objClient = { ...objClient, table, hour };

    const modalForm = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
    modalBootstrap.hide();

    showSections();

    getMeals();

}

function showAlert(message) {
    const alertExist = document.querySelector('.invalid-feedback')
    if (!alertExist) {
        const alert = document.createElement('DIV');
        alert.classList.add('invalid-feedback', 'd-block', 'text-center');
        alert.textContent = message;
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

function getMeals() {
    fetch('http://localhost:4000/platillos')
        .then(response => response.json())
        .then(meals => {
            showMeals(meals);
        })
        .catch(error => console.log(error))
}

const categories = {
    1: 'Food',
    2: 'Drink',
    3: 'Dessert'
}

function showMeals(meals) {
    const divMeals = document.querySelector('#platillos .contenido');

    meals.forEach(meal => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const name = document.createElement('DIV');
        name.classList.add('col-md-4');
        name.textContent = meal.nombre;

        const price = document.createElement('DIV');
        price.classList.add('col-md-3', 'fw-bold')
        price.textContent = `$${meal.precio}`;

        const category = document.createElement('DIV');
        category.classList.add('col-md-3')
        category.textContent = `${categories[meal.categoria]}`;

        const inputAmount = document.createElement('INPUT');
        inputAmount.type = 'number';
        inputAmount.min = 0;
        inputAmount.value = 0;
        inputAmount.id = `product-${meal.id}`;
        inputAmount.classList.add('form-control');

        inputAmount.onchange = function () {
            const amount = parseInt(inputAmount.value);
            addMeal({ ...meal, amount });
        }

        const add = document.createElement('DIV');
        add.classList.add('col-md-2');

        add.appendChild(inputAmount);

        row.appendChild(name);
        row.appendChild(price);
        row.appendChild(category);
        row.appendChild(add);

        divMeals.appendChild(row);
    });
}

function addMeal(product) {

    let { order } = objClient;

    if (product.amount > 0) {
        if (order.some(article => article.id === product.id)) {
            const orderUpdated = order.map(article => {
                if (article.id === product.id) {
                    article.amount = product.amount;
                }
                return article;
            });
            objClient.order = [...orderUpdated];
        }else{
            objClient.order = [...order, product];
        }
    }else{
        const result = order.filter(article => article.id !== product.id);
        objClient.order = {...result};
    }
    console.log(objClient.order);
}
