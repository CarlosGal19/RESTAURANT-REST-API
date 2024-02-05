let objClient = {
    table: '',
    hour: '',
    order: []
}

const btnSave = document.querySelector('#guardar-cliente');

const content = document.querySelector('#resumen .contenido');


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
        } else {
            objClient.order = [...order, product];
        }
    } else {
        const result = order.filter(article => article.id !== product.id);
        objClient.order = { ...result };
    }

    cleanHTML(content);

    updateSummary();
}

function updateSummary() {

    const summary = document.createElement('DIV');
    summary.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    const table = document.createElement('p');
    table.textContent = `Table: `;
    table.classList.add('fw-bold');

    const tableSpan = document.createElement('SPAN');
    tableSpan.classList.add('fw-normal')
    tableSpan.textContent = objClient.table;

    const hour = document.createElement('p');
    hour.textContent = `Hour: `;
    hour.classList.add('fw-bold');

    const hourSpan = document.createElement('SPAN');
    hourSpan.classList.add('fw-normal')
    hourSpan.textContent = objClient.hour;

    const heading = document.createElement('H3');
    heading.textContent = 'CONSUMED DISHES'
    heading.classList.add('my-4', 'text-center');

    const group = document.createElement('UL');
    group.classList.add('list-group');

    const { order } = objClient;

    order.forEach(element => {
        const { nombre, amount, precio, id } = element;

        const list = document.createElement('LI');
        list.classList.add('list-group-item');

        const nameEl = document.createElement('H4');
        nameEl.classList.add('my-4');
        nameEl.textContent = nombre;

        const amountEl = document.createElement('p');
        amountEl.classList.add('fw-bold');
        amountEl.textContent = `Amount: `;

        const amountValue = document.createElement('SPAN');
        amountValue.classList.add('fw-normal');
        amountValue.textContent = amount;

        amountEl.appendChild(amountValue);

        const priceEl = document.createElement('p');
        priceEl.classList.add('fw-bold');
        priceEl.textContent = 'Price: ';

        const priceValue = document.createElement('SPAN');
        priceValue.classList.add('fw-normal');
        priceValue.textContent = `$${precio}`;

        priceEl.appendChild(priceValue);

        const subtotalEl = document.createElement('p');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: $';

        const subtotalValue = document.createElement('SPAN');
        subtotalValue.classList.add('fw-normal');
        subtotalValue.textContent = calculateSubtotal(precio, amount);

        subtotalEl.appendChild(subtotalValue);

        const btnRemove = document.createElement('BUTTON');
        btnRemove.classList.add('btn', 'btn-danger');
        btnRemove.textContent = 'Remove meal';

        btnRemove.onclick = () => {
            removeMeal(id);
        }

        list.appendChild(nameEl);
        list.appendChild(amountEl);
        list.appendChild(priceEl);
        list.appendChild(subtotalEl);
        list.appendChild(btnRemove);

        group.appendChild(list);
    });

    table.appendChild(tableSpan);
    hour.appendChild(hourSpan);

    summary.appendChild(table);
    summary.appendChild(hour);
    summary.appendChild(heading);
    summary.appendChild(group);

    content.appendChild(summary);
}

function cleanHTML(spaceToClean) {
    while (spaceToClean.firstChild) {
        spaceToClean.removeChild(spaceToClean.firstChild);
    }
}

function calculateSubtotal(price, amount) {
    return price * amount;
}


function removeMeal(id) {
    const {order} =objClient;

    const result = order.filter(article => article.id !== id);

    objClient.order=[...result];

    cleanHTML(content);

    updateSummary();
}
