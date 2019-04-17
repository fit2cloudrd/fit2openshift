import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageComponent} from './storage.component';
import {TipModule} from '../tip/tip.module';
import {CoreModule} from '../core/core.module';
import {StorageListComponent} from './component/storage-list/storage-list.component';
import {StorageCreateComponent} from './component/storage-create/storage-create.component';
import {StorageDetailComponent} from './component/storage-detail/storage-detail.component';
import {StorageRoutingResolverService} from './storage-routing-resolver.service';

@NgModule({
  declarations: [StorageComponent, StorageListComponent, StorageCreateComponent, StorageDetailComponent],
  imports: [
    CommonModule,
    TipModule,
    CoreModule],
  providers: [StorageRoutingResolverService]
})
export class StorageModule {
}
