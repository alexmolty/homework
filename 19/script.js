// global variables

const persons = [];
const personId = document.getElementById('personId');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const birthdate = document.getElementById('birthdate');
const addPerson = document.getElementById('addPerson');
const personList = document.getElementById('personList');
const stats = document.getElementById('stats');
const customConfirm = document.getElementById('customConfirm');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const today = new Date();

// constructors

function newDOMElement(element, parent, text = "", className = "") {
    const elem = document.createElement(element);
    if (text) elem.innerText = text;
    parent.appendChild(elem);
    if (className) elem.classList.add(className);
    return elem;
}

function Person(id, firstName, lastName, birthdate) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = new Date(birthdate);
    this.age = () => {
        const yearToday = today.getFullYear();
        const monthToday = today.getMonth();
        const dayToday = today.getDate();

        const yearBirth = this.birthdate.getFullYear();
        const monthBirth = this.birthdate.getMonth();
        const dayBirth = this.birthdate.getDate();

        const age = yearToday - yearBirth;

        if (monthBirth < monthToday) {
            return age;
        }
        if (monthBirth === monthToday) {
            if (dayBirth <= dayToday) {
                return age;
            } else return age - 1;
        }
        if (monthBirth > monthToday) {
            return age - 1;
        }
        return age;
    }
}

// input operations


const maxDate = new Date(today); // копируем, чтобы не трогать оригинальный today
birthdate.max = maxDate.toISOString().split('T')[0]; // Устанавливаем границы


function birthdateInputNotCorrect(birthdateValue) {
    const enteredDate = new Date(birthdateValue);
    const minDate = new Date('1900-01-01');
    return (birthdateValue === "" ||
        isNaN(enteredDate.getTime()) ||
        enteredDate > today ||
        enteredDate < minDate);
}

function checkInputs() {
    if (isNaN(personId.value) || personId.value === "" || personId.value < 0) {
        customAlert('Please enter a valid ID (Numbers from 0)')
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
    if (birthdateInputNotCorrect(birthdate.value)) {
        customAlert('Please enter a valid birthdate');
        birthdate.focus();
        return false;
    }
    return true;
}

function clearInputs() {
    personId.value = '';
    firstName.value = '';
    lastName.value = '';
    birthdate.value = '';
    personId.focus();
}

// main logic

function createPerson() {
    if (!checkInputs()) return;
    if (persons.findIndex(person => person.id === personId.value) === -1) {
        let newPerson = new Person(personId.value, firstName.value, lastName.value, birthdate.value);
        persons.push(newPerson);
        printList();
        statsUpdate();
        clearInputs();
    } else customAlert('Person with this ID already added')
    personId.focus()
}

function printList() {
    personList.innerText = '';
    persons.forEach((person) => {
        const personRow = newDOMElement('div', personList, '', 'personRow')
        personInDiv(personRow, person)
        const divButton = newDOMElement('div', personRow, '', 'cell');
        buttonEdit(person, personRow, divButton);
        buttonDelete(person, personRow, divButton);
    })
}

function statsUpdate() {
    stats.innerText = '';
    if (persons.length > 0) {
        // total persons
        newDOMElement("p", stats, `Total persons in company: ${persons.length}`);
        // min age
        const minAge = Math.min(...persons.map(person => person.age()))
        newDOMElement("p", stats, `Minimum age: ${minAge}`);
        // max age
        const maxAge = Math.max(...persons.map(person => person.age()));
        newDOMElement("p", stats, `Maximum age: ${maxAge}`);
        // average age
        const ageSum = persons.reduce((sum, person) => sum + person.age(), 0);
        const averageSum = ageSum / persons.length;
        newDOMElement("p", stats, `Average age: ${Math.round(averageSum)}`);
    } else newDOMElement('p', stats, 'Add person to get statistics');
}

function personInDiv(parent, {firstName, lastName, age, id}) {
    newDOMElement('div', parent, `${firstName}`, 'cell');
    newDOMElement('div', parent, `${lastName}`, 'cell');
    newDOMElement('div', parent, `${age()}`, 'cell');
    newDOMElement('div', parent, `${id}`, 'cell');
}

// buttons

function buttonEdit(currentPerson, personRow, divButton) {
    const edit = newDOMElement('img', divButton, '', 'imgEdit');
    edit.onclick = () => {
        //TODO...
    }
}

function buttonDelete(currentPerson, personRow, divButton) {
    const trash = newDOMElement('img', divButton, '', 'imgTrash');
    trash.onclick = () => {
        customConfirm.classList.remove('hidden');
        confirmNo.onclick = () => {
            customConfirm.classList.add('hidden');
        }
        confirmYes.onclick = () => {
            let indexCurrentPerson = persons.findIndex(person => person.id === currentPerson.id);
            persons.splice(indexCurrentPerson, 1);
            personRow.remove();
            statsUpdate();
            customConfirm.classList.add('hidden');
        }
    }
}

// alerts

function customAlert(text) {
    const alert = newDOMElement('div', document.body, text, 'alert')
    requestAnimationFrame(() => {
        alert.style.opacity = '1';
    });
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }, 3000);
}

// event listeners

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
