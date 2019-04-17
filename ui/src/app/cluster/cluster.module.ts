import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClusterComponent} from './cluster.component';
import {ClusterListComponent} from './component/cluster-list/cluster-list.component';
import {CoreModule} from '../core/core.module';
import {ClusterDetailComponent} from './component/cluster-detail/cluster-detail.component';
import {ClusterCreateComponent} from './component/cluster-create/cluster-create.component';
import {TipModule} from '../tip/tip.module';
import {ClusterRoutingResolverService} from './service/cluster-routing-resolver.service';
import {HostsFilterPipe} from './pipe/hosts-filter.pipe';
import {DeviceCheckService} from './service/device-check.service';
import {ClusterService} from './service/cluster.service';

@NgModule({
  declarations: [ClusterComponent, ClusterListComponent, ClusterDetailComponent, ClusterCreateComponent],
  imports: [
    CommonModule,
    TipModule,
    CoreModule
  ],
  providers: [ClusterService, ClusterRoutingResolverService, DeviceCheckService]
})
export class ClusterModule {
}
