'use strict';

const containers = document.querySelectorAll('.container');
const taskList = document.querySelector('.task__list');
const taskListUpcoming = document.querySelector('.task__list--upcoming');
const taskListCompleted = document.querySelector('.task__list--completed');
const overlay = document.querySelector('.overlay');
const addTaskModal = document.querySelector('.task__add--modal');
const addTaskForm = document.querySelector('.form__add--task');
const navBar = document.querySelector('.nav__menu');

const inputTaskName = document.querySelector('.input__task--name');
const inputTaskDate = document.querySelector('.input__task--date');

const addTaskBtn = document.querySelector('.input__task--add');
const resetTaskBtn = document.querySelector('.input__task--reset');
const closeBtn = document.querySelector('.close--btn');
const openModalBtn = document.querySelector('.btn--open--modal');

let taskValue = 1;
let editingTask = false;
let editingTaskNumber;
let oldEditingTaskName;
let oldEditingTaskDate;
let tasks = [];

class Task {
	constructor(name, date, id, completed = false) {
		this.name = name;
		this.date = date;
		this.id = id;
		this.completed = completed;
	}
	changeCompleted() {
		this.completed = !this.completed;
	}
	changeData(name, date) {
		this.name = name;
		this.date = date;
	}
}

const compare = (a, b) => {
	if (a.id < b.id) {
		return -1;
	}
	if (a.id > b.id) {
		return 1;
	}
	return 0;
};

const generateTaskID = () => {
	return (Date.now() + '').slice(-10);
};

const formatDate = (date) => {
	return new Intl.DateTimeFormat(navigator.language, {
		year: 'numeric',
		day: '2-digit',
		month: 'long',
	}).format(new Date(date));
};

const loadTasks = () => {
	if (localStorage.getItem('do-your-work-tasks')) {
		tasks = JSON.parse(localStorage.getItem('do-your-work-tasks')).map(
			(task) => new Task(task.name, task.date, task.id, task.completed)
		);
	}
	taskList.innerHTML =
		taskListCompleted.innerHTML =
		taskListUpcoming.innerHTML =
			'';
	tasks.forEach((task) => {
		renderTask(taskList, task);
		if (task.completed) {
			renderTask(taskListCompleted, task);
		} else {
			renderTask(taskListUpcoming, task);
		}
	});
	document.querySelectorAll('.checkbox').forEach((checkbox) => {
		if (checkbox.dataset.checked === 'false') return;
		checkbox.checked = true;
	});
};

const uploadTasks = () => {
	localStorage.setItem('do-your-work-tasks', JSON.stringify(tasks));
	loadTasks();
};

const renderTask = (list, task) => {
	list.insertAdjacentHTML(
		'afterbegin',
		`
        <li class="task task--${
			new Date(task.date) < Date.now() ? 'missing' : 'active'
		} ${task.completed ? 'task--completed' : ''}" data-id="${task.id}">
            <div class="checkbox__input">
                <label class="checkbox__label">
                    <input type="checkbox" class="checkbox" data-id="${
						task.id
					}" data-checked="${task.completed}">
                </label>
            </div>
            <div class="task__details">
                <input type="text" value="${
					task.name
				}" class="task__details--name not__editable" data-id="${
			task.id
		}" disabled="true">
                    <div class="task__details--datediv">
                        Due <input type="text" value="${
							task.date
						}" class="task__details--date not__editable" data-id="${
			task.id
		}" disabled="true">
                    </div>
            </div>
            <div class="task__buttons">
                <button class="task__button task__button--edit" data-id="${
					task.id
				}"><i class="fa fa-edit"></i></button>
                <button class="task__button task__button--delete" data-id="${
					task.id
				}"><i class="fa fa-trash"></i></button>
            </div>
        </li>
    `
	);
};

const openModal = () => {
	addTaskModal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = () => {
	addTaskModal.classList.add('hidden');
	overlay.classList.add('hidden');
};

const changeEditingMode = (taskNumber, listOfTasks, enable = false) => {
	const editName = listOfTasks.querySelector(
		`.task__details--name[data-id="${taskNumber}"]`
	);
	const editDate = listOfTasks.querySelector(
		`.task__details--date[data-id="${taskNumber}"]`
	);
	const editEditBtn = listOfTasks.querySelector(
		`.task__button--edit[data-id="${taskNumber}"]`
	);
	const editDeleteBtn = listOfTasks.querySelector(
		`.task__button--delete[data-id="${taskNumber}"]`
	);
	if (enable) {
		oldEditingTaskName = editName.value;
		oldEditingTaskDate = editDate.value;

		const dateValueNew = `${new Date(oldEditingTaskDate)
			.getFullYear()
			.toString()
			.padStart(4, 0)}-${(new Date(oldEditingTaskDate).getMonth() + 1)
			.toString()
			.padStart(2, 0)}-${new Date(oldEditingTaskDate)
			.getDate()
			.toString()
			.padStart(2, 0)}`;

		editDate.value = dateValueNew;
	}
	editDate.type = `${enable ? 'date' : 'text'}`;
	editName.classList.toggle('not__editable');
	editDate.classList.toggle('not__editable');
	editName.disabled = editDate.disabled = !enable;
	editEditBtn.style.backgroundColor = `${enable ? 'lime' : 'yellow'}`;
	editEditBtn.innerHTML = `<i class="fa fa-${
		enable ? 'check' : 'edit'
	}"></i>`;
	editDeleteBtn.innerHTML = `<i class="fa fa-${
		enable ? 'close' : 'trash'
	}"></i>`;
};

const startEditingTask = (taskNumber, listOfTasks) => {
	changeEditingMode(taskNumber, listOfTasks, true);
	editingTask = true;
};

const stopEditingTask = (taskNumber, listOfTasks, newValue = false) => {
	const editName = listOfTasks.querySelector(
		`.task__details--name[data-id="${taskNumber}"]`
	);
	const editDate = listOfTasks.querySelector(
		`.task__details--date[data-id="${taskNumber}"]`
	);
	if (newValue) {
		changeEditingMode(taskNumber, listOfTasks);
		editDate.value = formatDate(editDate.value);
	} else {
		editName.value = oldEditingTaskName;
		changeEditingMode(taskNumber, listOfTasks);
		editDate.value = formatDate(oldEditingTaskDate);
	}
	tasks.forEach((task) => {
		// console.log(task.id, +taskNumber);
		if (task.id != taskNumber) return;
		task.changeData(editName.value, editDate.value);
	});
	// console.log(tasks);
	uploadTasks();
	editingTask = false;
};

const controlListOfTasks = (e, listOfTasks) => {
	if (
		e.target
			.closest('.task__button--delete')
			?.classList.contains('task__button--delete') &&
		!editingTask
	) {
		const task = e.target.closest('.task');
		task.classList.add('task__remove');
		setTimeout(() => {
			task.remove();
		}, 400);
		tasks.forEach((taskLoop, index) => {
			if (taskLoop.id == +task.dataset.id) {
				tasks.splice(index, 1);
			}
		});
		uploadTasks();
	}

	if (
		e.target
			.closest('.task__button--edit')
			?.classList.contains('task__button--edit')
	) {
		const taskNumber = e.target.closest('.task').dataset.id;
		if (editingTask) {
			if (taskNumber !== editingTaskNumber)
				return alert(
					'You have not permission to edit two tasks at a time.'
				);

			stopEditingTask(taskNumber, listOfTasks, true);
		} else {
			editingTaskNumber = taskNumber;
			startEditingTask(editingTaskNumber, listOfTasks);
		}
	}

	if (
		e.target
			.closest('.task__button--delete')
			?.classList.contains('task__button--delete') &&
		editingTask
	) {
		const taskNumber = e.target.closest('.task').dataset.id;

		if (taskNumber !== editingTaskNumber)
			return alert(
				'You have not permission to delete task while editing another.'
			);

		stopEditingTask(taskNumber, listOfTasks);
	}

	if (e.target.closest('.checkbox')?.classList.contains('checkbox')) {
		const completeBtn = e.target.closest('.checkbox');
		const btnChecked = completeBtn.checked;
		// console.log(btnChecked);

		if (editingTask) {
			alert('Cannot perform action while editing');
			completeBtn.checked = !btnChecked;
			return;
		}

		completeBtn.closest('.task').classList.toggle('task--completed');
		const task = tasks.find((task) => task.id == completeBtn.dataset.id);
		task.changeCompleted();
		uploadTasks();
	}
};

openModalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

addTaskBtn.addEventListener('click', (e) => {
	e.preventDefault();

	if (editingTask)
		return alert('Adding task not allowed while editing other');

	const taskName = inputTaskName.value.trim();
	if (taskName === '') {
		alert('Empty task not allowed.');
		return;
	}
	if (inputTaskDate.value === '') {
		alert('Please enter a due date.');
		return;
	}
	const taskDate = formatDate(inputTaskDate.value);
	taskValue = generateTaskID();
	const task = new Task(taskName, taskDate, taskValue);
	tasks.push(task);
	tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
	uploadTasks();

	resetTaskBtn.click();
	taskValue++;
});

taskList.addEventListener('click', (e) => {
	controlListOfTasks(e, taskList);
});

taskListUpcoming.addEventListener('click', (e) => {
	controlListOfTasks(e, taskListUpcoming);
});

taskListCompleted.addEventListener('click', (e) => {
	controlListOfTasks(e, taskListCompleted);
});

navBar.addEventListener('click', (e) => {
	const el = e.target.closest('.nav__button');
	if (!el) return;

	const num = el.dataset.btn;
	containers.forEach((container) => {
		container.classList.remove('container--active');
	});
	navBar.querySelectorAll('.nav__button').forEach((button) => {
		button.classList.remove('nav__button--active');
	});
	el.classList.add('nav__button--active');
	document
		.querySelector(`.container--${num}`)
		.classList.add('container--active');
});

const init = () => {
	const demotask = new Task('Lorem, ipsum dolor.', 'December 19, 2021', 0);
	// tasks.push(demotask);
	tasks = localStorage.getItem('do-your-work-tasks');
	// localStorage.setItem('do-your-work-tasks', JSON.stringify(tasks));
	loadTasks();
};

init();
