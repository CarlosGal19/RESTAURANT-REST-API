/*
    json-server --watch db.json --port 4000
    That is the command needed to can create the API using JSON-SERVER
    It is necessary to have JSON-SERVER and npm installed
*/

// Object that will have the data input
let objClient = {
    table: '',
    hour: '',
    order: []
}

// Button from modal
const btnSave = document.querySelector('#guardar-cliente');

// Section of content that will show the meals of the order
const content = document.querySelector('#resumen .contenido');


btnSave.addEventListener('click', saveClient);

// It takes the values from the modal
function saveClient() {
    const table = document.querySelector('#mesa').value;
    const hour = document.querySelector('#hora').value;
    const emptyFields = [table, hour].some(value => value === '');
    if (emptyFields) {
        showAlert('All fields are required');
        return;
    }

    // It adds the table and hour from the form to object
    objClient = { ...objClient, table, hour };

    const modalForm = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
    modalBootstrap.hide();

    // Show the perk and meals section
    showSections();

    // Get the meals from the API
    getMeals();

}

function showAlert(message) {
    const alertExist = document.querySelector('.invalid-feedback');
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

// Object which helps to show the categories in the section of meals selected
const categories = {
    1: 'Food',
    2: 'Drink',
    3: 'Dessert'
}

// It prints in DOM each meal, with its name, price, category and an input for knowing the amount
function showMeals(meals) {
    const divMeals = document.querySelector('#platillos .contenido');

    meals.forEach(meal => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const name = document.createElement('DIV');
        name.classList.add('col-md-4');
        name.textContent = meal.nombre;

        const price = document.createElement('DIV');
        price.classList.add('col-md-3', 'fw-bold');
        price.textContent = `$${meal.precio}`;

        const category = document.createElement('DIV');
        category.classList.add('col-md-3');
        category.textContent = `${categories[meal.categoria]}`;

        const inputAmount = document.createElement('INPUT');
        inputAmount.type = 'number';
        inputAmount.min = 0;
        inputAmount.value = 0;
        // Id is given for help to delete the meal when the button is clicked
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

// Function that validated if the meal is already in the array of the object objClient or it is going to be appended
function addMeal(product) {

    let { order } = objClient;

    //  If the amount is greater than 0, adds it, else it means that it is 0 and is deleted
    if (product.amount > 0) {
        // If the article already is on the array its amount increase, else, the product is added
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

    // If the array has elements, show them in DOM, else, show a meesage
    if (objClient.order.length) {
        updateSummary();
    } else {
        showEmptySummary();
    }
}

// It shows the array of orders in DOM and data about the order as hour, table and a list of name, amount, price, subtotal and a button for delete it
function updateSummary() {

    const summary = document.createElement('DIV');
    summary.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

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

    summary.appendChild(heading);
    summary.appendChild(table);
    summary.appendChild(hour);
    summary.appendChild(group);

    content.appendChild(summary);

    showFormPerk();
}

function cleanHTML(spaceToClean) {
    while (spaceToClean.firstChild) {
        spaceToClean.removeChild(spaceToClean.firstChild);
    }
}

function calculateSubtotal(price, amount) {
    return price * amount;
}

// It removes a meal of DOM and array when the button is clicked, besides, it updates the meals selected section
function removeMeal(id) {
    const { order } = objClient;

    const result = order.filter(article => article.id !== id);

    objClient.order = [...result];

    cleanHTML(content);

    if (objClient.order.length) {
        updateSummary();
    } else {
        showEmptySummary();
    }

    const removedProduct = document.querySelector(`#product-${id}`);
    removedProduct.value = 0;
}

// It shows a message if the meals selected section is empty again
function showEmptySummary() {
    const messageEmpty = document.createElement('P');
    messageEmpty.classList.add('text-center');
    messageEmpty.textContent = 'Añade los elementos del pedido';

    content.appendChild(messageEmpty);
}

// It shows in DOM the form to compute the total based on the perk selected
function showFormPerk() {
    const formPerk = document.createElement('DIV');
    formPerk.classList.add('col-md-6', 'form');

    const divForm = document.createElement('DIV');
    divForm.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Perk';

    const rad10 = document.createElement('INPUT');
    rad10.type = 'radio';
    rad10.name = 'perk';
    rad10.value = 10;
    rad10.classList.add('form-check-input');

    rad10.onclick = () => {
        calculateFinal();
    }

    const lblRad10 = document.createElement('label');
    lblRad10.textContent = '10%';
    lblRad10.classList.add('form-check-label');

    const divRad10 = document.createElement('DIV');
    divRad10.classList.add('form-check');

    const rad25 = document.createElement('INPUT');
    rad25.type = 'radio';
    rad25.name = 'perk';
    rad25.value = 25;
    rad25.classList.add('form-check-input');

    rad25.onclick = () => {
        calculateFinal();
    }

    const lblRad25 = document.createElement('label');
    lblRad25.textContent = '25%';
    lblRad25.classList.add('form-check-label');

    const divRad25 = document.createElement('DIV');
    divRad25.classList.add('form-check');

    const rad50 = document.createElement('INPUT');
    rad50.type = 'radio';
    rad50.name = 'perk';
    rad50.value = 50;
    rad50.classList.add('form-check-input');

    rad50.onclick = () => {
        calculateFinal();
    }

    const lblRad50 = document.createElement('label');
    lblRad50.textContent = '50%';
    lblRad50.classList.add('form-check-label');

    const divRad50 = document.createElement('DIV');
    divRad50.classList.add('form-check');

    divRad10.appendChild(rad10);
    divRad10.appendChild(lblRad10);
    divRad25.appendChild(rad25);
    divRad25.appendChild(lblRad25);
    divRad50.appendChild(rad50);
    divRad50.appendChild(lblRad50);

    divForm.appendChild(heading);
    divForm.appendChild(divRad10);
    divForm.appendChild(divRad25);
    divForm.appendChild(divRad50);
    formPerk.appendChild(divForm);
    content.appendChild(formPerk);
}

// It calculates the total and perk that is selected in the form
function calculateFinal() {

    const { order } = objClient;

    let subtotal = 0;

    order.forEach(element => {
        subtotal = element.amount * element.precio;
    });

    const perkSelected = document.querySelector('[name="perk"]:checked').value;

    const perk = subtotal * perkSelected / 100;

    const total = subtotal + perk;

    showTotal(subtotal, total, perk);
}

// It shows in DOM the total, subtotal and perk
function showTotal(subtotal, total, perk) {

    const divTotals = document.createElement('DIV');
    divTotals.classList.add('total-pay');

    const subTotalParagraph = document.createElement('P');
    subTotalParagraph.classList.add('fs-4', 'fw-bold', 'mt-2');
    subTotalParagraph.textContent = 'Subtotal: $';

    const subTotalSpan = document.createElement('SPAN');
    subTotalSpan.classList.add('fw-normal');
    subTotalSpan.textContent = subtotal;

    subTotalParagraph.appendChild(subTotalSpan);

    const perkParagraph = document.createElement('P');
    perkParagraph.classList.add('fs-4', 'fw-bold', 'mt-2');
    perkParagraph.textContent = 'Perk: $';

    const perkSpan = document.createElement('SPAN');
    perkSpan.classList.add('fw-normal');
    perkSpan.textContent = perk;

    perkParagraph.appendChild(perkSpan);

    const totalParagraph = document.createElement('P');
    totalParagraph.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalParagraph.textContent = 'Total: $';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = total;

    totalParagraph.appendChild(totalSpan);

    const totalExist = document.querySelector('.total-pay');

    if (totalExist) {
        totalExist.remove();
    }

    divTotals.appendChild(subTotalParagraph);
    divTotals.appendChild(perkParagraph);
    divTotals.appendChild(totalParagraph);

    const form = document.querySelector('.form > div');

    form.appendChild(divTotals);
}
