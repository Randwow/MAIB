import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskTableComponent } from '../app/components/task-table/task-table.component';

const routes: Routes = [
  { path: '', component: TaskTableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
