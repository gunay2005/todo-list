class TaskApp {
    constructor(elements) {
        const {
            addTaskBtnSelector,
            taskListSelector,
            inputWrapperSelector,
            taskInputSelector,
            toggleIcons
        } = elements;

        this.addTaskBtn = document.querySelector(addTaskBtnSelector);
        this.taskList = document.querySelector(taskListSelector);
        this.inputWrapper = document.querySelector(inputWrapperSelector);
        this.taskInput = document.querySelector(taskInputSelector);

        this.isInputVisible = true;
        this.isAscending = true;

        this.initializeUI();
        this.setupEventListeners(toggleIcons);
    }

    initializeUI() {
        this.taskList.style.display = 'none';
        this.inputWrapper.style.display = 'flex';
    }

    setupEventListeners(toggleIcons) {
        this.addTaskBtn.addEventListener('click', () => this.handleAddButtonClick());

        toggleIcons.forEach(({ visible, hidden }) => {
            this.setToggleIconVisibility(visible, hidden);
            visible.addEventListener('click', () => this.toggleSortOrder(visible, hidden));
            hidden.addEventListener('click', () => this.toggleSortOrder(hidden, visible));
        });
    }

    setToggleIconVisibility(visible, hidden) {
        visible.style.display = 'block';
        hidden.style.display = 'none';
    }

    handleAddButtonClick() {
        const inputValue = this.taskInput.value.trim();

        if (!this.isInputVisible) {
            this.showInputContainer();
            return;
        }

        if (inputValue) {
            this.addListItem(inputValue);
            this.taskInput.value = '';
            this.taskList.style.display = 'block';
            this.inputWrapper.style.display = 'none';
            this.isInputVisible = false;
        } else {
            alert('Нельзя добавить пустую задачу!');
        }
    }

    addListItem(text) {
        const listItem = document.createElement('li');
        listItem.classList.add('owerflow');
        listItem.textContent = text;
        listItem.setAttribute('draggable', 'true');  

        // Добавить слушатели для событий drag-and-drop
        listItem.addEventListener('dragstart', (e) => this.handleDragStart(e, listItem));
        listItem.addEventListener('dragover', (e) => this.handleDragOver(e));
        listItem.addEventListener('drop', (e) => this.handleDrop(e, listItem));
        listItem.addEventListener('dragend', () => this.handleDragEnd());

        // Создать и добавить иконки удаления
        const deleteIcon = this.createIcon('x', 'picture/Group 77.svg', () => this.removeListItem(listItem));
        const deleteIconHover = this.createIcon('xhover', 'picture/Group 70.svg', () => this.removeListItem(listItem));

        deleteIcon.addEventListener('mouseover', () => {
            deleteIcon.style.display = 'none';
            deleteIconHover.style.display = 'inline';
        });
        deleteIconHover.addEventListener('mouseout', () => {
            deleteIconHover.style.display = 'none';
            deleteIcon.style.display = 'inline';
        });

        listItem.append(deleteIcon, deleteIconHover);
        this.taskList.appendChild(listItem);
    }

    createIcon(className, src, onClick) {
        const icon = document.createElement('img');
        icon.classList.add(className);
        icon.src = src;
        icon.alt = className;
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', onClick);
        return icon;
    }

    handleDragStart(e, listItem) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', null); 
        this.draggedItem = listItem; 
    }

    handleDragOver(e) {
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e, listItem) {
        e.preventDefault();
        if (this.draggedItem !== listItem) {
            this.taskList.insertBefore(this.draggedItem, listItem);
        }
    }

    handleDragEnd() {
        this.draggedItem = null; 
    }

    removeListItem(listItem) {
        listItem.remove();
        if (!this.taskList.children.length) {
            this.taskList.style.display = 'none';
            this.showInputContainer();
        }
    }

    showInputContainer() {
        this.taskList.style.display = 'none';
        this.inputWrapper.style.display = 'flex';
        this.isInputVisible = true;
    }

    toggleSortOrder(visible, hidden) {
        [visible.style.display, hidden.style.display] = [hidden.style.display, visible.style.display];
        this.isAscending = !this.isAscending;
        this.sortListItems();
    }

    sortListItems() {
        const items = Array.from(this.taskList.children);
        
        items.sort((a, b) => {
        const textA = a.textContent;
        const textB = b.textContent;

        const numA = parseFloat(textA);
        const numB = parseFloat(textB);

        this.isAscending ? Number() - Number(b.textContent)
            : Number(b.textContent) - Number(a.textContent)
        );
    
        this.taskList.innerHTML = '';
        items.forEach(item => this.taskList.appendChild(item));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TaskApp({
        addTaskBtnSelector: '.add-button',
        taskListSelector: '#ol',
        inputWrapperSelector: '.input-container',
        taskInputSelector: '.input-container input',
        toggleIcons: [
            { visible: document.querySelector('.sort-all'), hidden: document.querySelector('.sort-all1') }
        ]
    });
});
