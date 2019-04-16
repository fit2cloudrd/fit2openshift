import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageComponent} from './storage.component';
import {TipModule} from '../tip/tip.module';
import {CoreModule} from '../core/core.module';
import {StorageListComponent} from './storage-list/storage-list.component';
import {StorageCreateComponent} from './storage-create/storage-create.component';
import {HostsFilterPipe} from '../cluster/hosts-filter.pipe';

@NgModule({
  declarations: [StorageComponent, StorageListComponent, StorageCreateComponent],
  imports: [
    CommonModule,
    TipModule,
    CoreModule]
})
export class StorageModule {
}
