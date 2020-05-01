import { TableComponent } from './components/table/table.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetricsTableComponent } from './components/metrics-table/metrics-table.component';
import { CompMetricsTableComponent } from './components/comp-metrics-table/comp-metrics-table.component';
import { ProjTableEditionComponent } from './components/administrator/proj-table-edition/proj-table-edition.component';


import { AuthGuard } from './guard/auth-guard.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/projects',
    pathMatch: 'full'
  },
  
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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
