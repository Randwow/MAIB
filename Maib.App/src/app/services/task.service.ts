import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5150/api/Tasks';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
    });
  }

  getTaskById(id: number): Observable<Task> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Task>(url, {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        });
  }

  createTask(task: Task): Observable<Task> {
    console.log(task);
    return this.http.post<Task>(this.apiUrl, task, {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        });
  }

  updateTask(task: Task): Observable<Task> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.put<Task>(url, task, {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        });
  }

  deleteTask(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url,{
        headers: new HttpHeaders({
            "Content-Type": "application/json"
          })
        });
  }
}
