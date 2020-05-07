import { UpdateProjectsTabComponent } from './components/administrator/update-projects-tab/update-projects-tab.component';
import { TableComponent } from './components/table/table.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { MetricsTableComponent } from './components/metrics-table/metrics-table.component';
import { CompMetricsTableComponent } from './components/comp-metrics-table/comp-metrics-table.component';
import { ProjTableEditionComponent } from './components/administrator/proj-table-edition/proj-table-edition.component';


import { AuthGuard } from './guard/auth-guard.guard';


const routes: Routes = [
  {
    path: 'projects',
    component: TableComponent
  },
  
  {
    path: 'projects/metrics',
    component: MetricsTableComponent
  },
  {
    path: 'projects/components/metrics',
    component: CompMetricsTableComponent
  },
  {
    path: 'projects/edit',
    component: ProjTableEditionComponent,
    canActivate: [AuthGuard]
  
  },
  {
    path: 'projects/update',
    component: UpdateProjectsTabComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/projects',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
