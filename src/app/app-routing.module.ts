import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './components/tabs/tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'tasks',
        loadChildren: () =>
          import('./pages/tasks/tasks.module').then((m) => m.TasksPageModule),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./pages/categories/categories.module').then(
            (m) => m.CategoriesPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
