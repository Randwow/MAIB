import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css']
})
export class TaskTableComponent implements OnInit {
  newTaskForm!: FormGroup;
  tasks: Task[] = [];
  displayedColumns: string[] = ['ID', 'Название', 'Описание', 'Приоритет', 'Статус', 'Создан', 'Изменен', 'Actions'];

  constructor(private taskService: TaskService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loadTasks();
    this.initializeForm();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (data: Task[]) => {
        this.tasks = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe(
      () => {
        this.tasks = this.tasks.filter(t => t !== task);
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

    this.taskService.updateTask(updatedTask).subscribe(
      () => {
        // Если редактирование прошло успешно, обновляем список задач
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  createTask(): void {
    if (this.newTaskForm.valid) {
      const newTask: Task = this.newTaskForm.value;
      this.taskService.createTask(newTask).subscribe(
        (task: Task) => {
          this.tasks.push(task);
          this.newTaskForm.reset(); // Очищаем форму после добавления задачи
        },
        (error) => {
          console.log(error);
        }
      );
    }
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
