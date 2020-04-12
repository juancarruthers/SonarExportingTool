import { TableComponent } from './components/table/table.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetricsTableComponent } from './components/metrics-table/metrics-table.component';
import { CompMetricsTableComponent } from './components/comp-metrics-table/comp-metrics-table.component';


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
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
