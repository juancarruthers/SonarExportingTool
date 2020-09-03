import { AnalyzeProjectsComponent } from './components/content/administrator/analyze-projects/analyze-projects.component';
import { UpdateProjectsTabComponent } from './components/content/administrator/update-projects-tab/update-projects-tab.component';
import { TableComponent } from './components/content/export/table/table.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetricsTableComponent } from './components/content/export/metrics-table/metrics-table.component';
import { CompMetricsTableComponent } from './components/content/export/comp-metrics-table/comp-metrics-table.component';
import { ProjTableEditionComponent } from './components/content/administrator/proj-table-edition/proj-table-edition.component';
import { StartPageComponent } from './components/content/start-page/start-page.component';
//import { AboutPageComponent } from './components/content/about-page/about-page.component';

import { AuthGuard } from './guard/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: StartPageComponent
  },

  /*{
    path: 'about',
    component: AboutPageComponent
  },*/

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
    path: 'projects/analyze',
    component: AnalyzeProjectsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
