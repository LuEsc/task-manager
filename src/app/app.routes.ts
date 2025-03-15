import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'task',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'task'
    },
    {
        path: 'task',
        loadComponent: () => import('./features/public/task-manager/task-manager.component').then(m => m.TaskManagerComponent)
    }
];
