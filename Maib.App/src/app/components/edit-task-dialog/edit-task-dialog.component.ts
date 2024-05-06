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
    updatedTask!: Task; 
    isDataChanged: boolean = false; 

    constructor(
        public dialogRef: MatDialogRef<EditTaskDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { task: Task },
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.taskForm = this.fb.group({
            title: [this.data.task.title, Validators.required],
            description: [this.data.task.description, Validators.required],
            priority: [this.data.task.priority, Validators.required],
            status: [this.data.task.status, Validators.required]
        });

        this.taskForm.valueChanges.subscribe(() => {
            this.isDataChanged = true;
        });
    }

    onSaveClick(): void {
        if (this.isDataChanged) {
            const updatedData = this.taskForm.value;
            const updatedTask: Task = { ...this.data.task, ...updatedData };
            this.dialogRef.close(updatedTask);
        } else {
            this.dialogRef.close();
        }
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }
}
