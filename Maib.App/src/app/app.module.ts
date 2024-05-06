import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Импортируем FormsModule и ReactiveFormsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button'; // Примерно добавьте другие модули, если вы их используете

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskTableComponent } from './components/task-table/task-table.component'; // Подключаем ваш компонент

@NgModule({
  declarations: [
    AppComponent,
    TaskTableComponent // Добавляем ваш компонент
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Добавляем FormsModule
    ReactiveFormsModule, // Добавляем ReactiveFormsModule
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSortModule,
    MatButtonModule // Примерно добавьте другие модули, если вы их используете
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
