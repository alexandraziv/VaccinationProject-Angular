import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccinationsFormComponent } from './vaccinations/vaccinations-form/vaccinations-form.component';
import { VaccinationsListComponent } from './vaccinations/vaccinations-list/vaccinations-list.component';
import { AboutComponent } from './core/about/about.component';

const routes: Routes = [
  {path: 'vaccinations', component: VaccinationsListComponent},
  {path: 'vaccinations/add', component: VaccinationsFormComponent},
  {path: 'about', component: AboutComponent },
  {path: '', redirectTo: '/vaccinations', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
