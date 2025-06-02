const persons = [];
const personId = document.getElementById('personId');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const age = document.getElementById('age');
const addPerson = document.getElementById('addPerson');
const personList = document.getElementById('personList');
const stats = document.getElementById('stats');

function checkInputs() {
    if (isNaN(personId.value) || personId.value === "") {
        customAlert('Please enter a valid ID (Only numbers)')
        // alert('Please enter a valid ID (Only numbers)');
        personId.focus();
        return false;
    }
    if (!isNaN(firstName.value) || firstName.value === "") {
        customAlert('Please enter a valid first name');
        firstName.focus();
        return false;
    }
    if (!isNaN(lastName.value) || lastName.value === "") {
        customAlert('Please enter a valid last name');
        lastName.focus();
        return false
    }
    if (isNaN(personId.value) || age.value === "" || age.value > 150 || age.value < 0) {
        customAlert('Please enter a valid age');
        age.focus();
        return false;
    }
    return true;
}

function newElement(element, parent, text = "", className = "") {
    const elem = document.createElement(element);
    if (text) elem.innerText = text;
    parent.appendChild(elem);
    if (className) elem.classList.add(className);
    return elem;
}

function createPerson() {
    if (!checkInputs()) return;
    if (persons.findIndex(person => person.id === personId.value) === -1) {
        let newPerson = new Person(personId.value, firstName.value, lastName.value, age.value);
        persons.push(newPerson);
        printList();
        statsUpdate();
        clearInputs();
    } else customAlert('Person with this ID already added')
    personId.focus()
}

function clearInputs() {
    personId.value = '';
    firstName.value = '';
    lastName.value = '';
    age.value = '';
    personId.focus();
}

function printList() {
    personList.innerText = '';
    persons.forEach((person) => {
        const personRow = newElement('div', personList, '', 'personRow')
        personInDiv(personRow, person)
        personList.appendChild(personRow);
        const divButton = newElement('div', personRow, '', 'cell');
        buttonEdit(person, personRow, divButton);
        buttonDelete(person, personRow, divButton);
    })
}

function personInDiv(personRow, person) {
    newElement('div', personRow, `${person.firstName}`, 'cell');
    newElement('div', personRow, `${person.lastName}`, 'cell');
    newElement('div', personRow, `${person.age}`, 'cell');
    newElement('div', personRow, `${person.id}`, 'cell');
}

function buttonDelete(currentPerson, divPerson, divButton) {
    const trash = newElement('img', divButton, '', 'imgTrash');
    trash.onclick = () => {
        if (confirm('Are you sure you want to delete this person?')) {
            let indexCurrentPerson = persons.findIndex(person => person.id === currentPerson.id);
            persons.splice(indexCurrentPerson, 1);
            divPerson.remove();
            statsUpdate();
        }
    }
}

function buttonEdit(currentPerson, personRow, divButton) {
    const edit = newElement('img', divButton, '', 'imgEdit');
    edit.onclick = () => {
        //TODO...
    }
}

function statsUpdate() {
    stats.innerText = '';
    if (persons.length > 0) {
        // total persons
        newElement("p", stats, `Total persons in company: ${persons.length}`);
        // min age
        const minAge = Math.min(...persons.map(person => person.age))
        newElement("p", stats, `Minimum age: ${minAge}`);
        // max age
        const maxAge = Math.max(...persons.map(person => person.age));
        newElement("p", stats, `Maximum age: ${maxAge}`);
        // average age
        const ageSum = persons.reduce((sum, person) => sum + person.age, 0);
        const averageSum = ageSum / persons.length;
        newElement("p", stats, `Average age: ${Math.round(averageSum)}`);
    } else newElement('p', stats, 'Add person to get statistics');
}

function customAlert(text) {
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.textContent = text;
    document.body.appendChild(alert);

    requestAnimationFrame(() => {
        alert.style.opacity = '1';
    });
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }, 3000);
}

function Person(id, firstName, lastName, age) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = Number(age);
}

// listeners

addPerson.onclick = function () {
    createPerson();
}
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        createPerson();
    }
})
window.onload = () => {
    personId.focus();
}