
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', loadChildren: () => import('./pages/tasks/tasks.module').then(m => m.TasksPageModule) },
  { path: 'categories', loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesPageModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
