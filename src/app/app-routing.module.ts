import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'room-monitor', pathMatch: 'full' },
  { path: 'battery-status', loadChildren: './pages/battery-status/battery-status.module#BatteryStatusPageModule' },
  { path: 'stats', loadChildren: './pages/stats/stats.module#StatsPageModule' },
  { path: 'room-monitor', loadChildren: './pages/room-monitor/room-monitor.module#RoomMonitorPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
