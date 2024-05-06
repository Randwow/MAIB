import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css']
})
export class TaskTableComponent implements OnInit {
  newTaskForm!: FormGroup;
  tasks: MatTableDataSource<Task> = new MatTableDataSource<Task>([]); // Используем MatTableDataSource для хранения данных задач
  displayedColumns: string[] = ['id', 'title', 'description', 'priority', 'status', 'created', 'modified', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Используем ! для утверждения компилятору TypeScript

  constructor(private taskService: TaskService, private formBuilder: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTasks();
    this.initializeForm();
    
  }

  ngAfterViewInit(): void {
    this.tasks.paginator = this.paginator; // Устанавливаем paginator после отображения представления
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (data: Task[]) => {
        this.tasks.data = data; // Устанавливаем данные задач для MatTableDataSource
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe(
      () => {
        // После удаления задачи перезагружаем данные, чтобы обновить таблицу и пейджинг
        this.loadTasks();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editTask(task: Task): void {
    const updatedTask: Task = { ...task }; // Создаем копию объекта задачи для редактирования
    // Здесь вы можете добавить логику для отображения формы редактирования задачи или использовать диалоговое окно
    // После того, как пользователь внес изменения, обновляем задачу на сервере
    console.log(updatedTask);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    updatedTask.modifiedOn = formattedDate;
    this.taskService.updateTask(updatedTask).subscribe(
      () => {
        // Если редактирование прошло успешно, обновляем список задач
        this.loadTasks();
      },
      (error) => {
        console.log(error);
      }
    );
  }



  createTask(): void {
    if (this.newTaskForm.valid) {
      const newTask: Task = this.newTaskForm.value;
    
      // Получаем текущую дату и преобразуем ее в строку формата ISO
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
    
      // Устанавливаем даты создания и изменения в формате ISO и обрамляем ковычками
      newTask.createdOn = formattedDate;
      newTask.modifiedOn = formattedDate;
    
      this.taskService.createTask(newTask).subscribe(
        (task: Task) => {
          // Получаем текущие данные из MatTableDataSource
          const currentData = this.tasks.data;
          // Добавляем новую задачу к текущим данным
          currentData.push(task);
          // Устанавливаем обновленные данные в MatTableDataSource
          this.tasks.data = currentData;
          // Очищаем форму после добавления задачи
          this.newTaskForm.reset();
          // После добавления задачи, перезагружаем список задач
          this.loadTasks();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  
  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '750px',
      data: { task: task }
    });

    dialogRef.afterClosed().subscribe(updatedTask => {
      if (updatedTask) {
        console.log(updatedTask);
        this.editTask(updatedTask);
      }
    });
    
  }
  
  initializeForm(): void {
    this.newTaskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required]
    });
  }
}