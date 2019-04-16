import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageListComponent} from './storage-list/storage-list.component';
import {TipModule} from '../tip/tip.module';
import {CoreModule} from '../core/core.module';
import {StorageComponent} from './storage.component';
import { StorageCreateComponent } from './storage-create/storage-create.component';

@NgModule({
  declarations: [StorageListComponent, StorageComponent, StorageCreateComponent],
  imports: [
    CommonModule,
    TipModule,
    CoreModule
  ]
})
export class StorageModule {
}
