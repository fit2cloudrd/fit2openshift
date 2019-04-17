import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShellComponent} from './base/shell/shell.component';
import {NotFoundComponent} from './shared/not-found/not-found.component';
import {SignInComponent} from './account/sign-in/sign-in.component';
import {AuthUserActiveService} from './shared/route/auth-user-active.service';
import {PackageComponent} from './package/package.component';
import {UserComponent} from './user/user.component';
import {ClusterComponent} from './cluster/cluster.component';
import {ClusterDetailComponent} from './cluster/component/cluster-detail/cluster-detail.component';
import {OverviewComponent} from './overview/overview.component';
import {NodeComponent} from './node/node.component';
import {LogComponent} from './log/log.component';
import {ClusterRoutingResolverService} from './cluster/service/cluster-routing-resolver.service';
import {HostComponent} from './host/host.component';
import {DeployComponent} from './deploy/deploy.component';
import {SettingComponent} from './setting/setting.component';
import {StorageComponent} from './storage/storage.component';
import {StorageDetailComponent} from './storage/component/storage-detail/storage-detail.component';
import {StorageRoutingResolverService} from './storage/storage-routing-resolver.service';

const routes: Routes = [
  {path: '', redirectTo: 'fit2openshift', pathMatch: 'full'},
  {path: 'sign-in', component: SignInComponent},
  {
    path: 'fit2openshift',
    component: ShellComponent,
    canActivate: [AuthUserActiveService],
    canActivateChild: [AuthUserActiveService],
    children: [
      {path: '', redirectTo: 'cluster', pathMatch: 'full'},
      {path: 'cluster', component: ClusterComponent},
      {path: 'offline', component: PackageComponent},
      {path: 'user', component: UserComponent},
      {path: 'host', component: HostComponent},
      {path: 'setting', component: SettingComponent},
      {path: 'storage', component: StorageComponent},
      {
        path: 'cluster/:name',
        component: ClusterDetailComponent,
        resolve: {cluster: ClusterRoutingResolverService},
        children: [
          {path: '', redirectTo: 'overview', pathMatch: 'full'},
          {path: 'overview', component: OverviewComponent},
          {path: 'node', component: NodeComponent},
          {path: 'deploy', component: DeployComponent},
          {path: 'log', component: LogComponent},
        ]
      }, {
        path: 'storage/:name',
        component: StorageDetailComponent,
        resolve: {cluster: StorageRoutingResolverService},
        children: [
          {path: '', redirectTo: 'overview', pathMatch: 'full'},
          {path: 'overview', component: OverviewComponent},
          {path: 'node', component: NodeComponent},
          {path: 'deploy', component: DeployComponent},
          {path: 'log', component: LogComponent},
        ]
      }
    ]
  },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
