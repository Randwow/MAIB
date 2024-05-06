import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
    selector: 'app-edit-task-dialog',
    templateUrl: './edit-task-dialog.component.html',
    styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {
    taskForm!: FormGroup;
    updatedTask!: Task; // Локальная переменная для хранения обновленной задачи
    isDataChanged: boolean = false; // Флаг, указывающий на изменение данных

    constructor(
        public dialogRef: MatDialogRef<EditTaskDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { task: Task },
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        // Создаем форму и заполняем данными из переданного объекта task
        this.taskForm = this.fb.group({
            title: [this.data.task.title, Validators.required],
            description: [this.data.task.description, Validators.required],
            priority: [this.data.task.priority, Validators.required],
            status: [this.data.task.status, Validators.required]
        });

        // Подписываемся на изменения значений в форме
        this.taskForm.valueChanges.subscribe(() => {
            // Устанавливаем флаг, что данные были изменены
            this.isDataChanged = true;
        });
    }

    onSaveClick(): void {
        // Если данные были изменены, выполняем обновление
        if (this.isDataChanged) {
            // Получаем обновленные данные из формы
            const updatedData = this.taskForm.value;
            // Создаем копию задачи с обновленными данными
            const updatedTask: Task = { ...this.data.task, ...updatedData };
            // Передаем обновленные данные в метод закрытия диалога
            this.dialogRef.close(updatedTask);
        } else {
            // Если данные не были изменены, закрываем диалог без обновления
            this.dialogRef.close();
        }
    }

    onCancelClick(): void {
        // Закрываем диалог без обновления данных
        this.dialogRef.close();
    }
}
