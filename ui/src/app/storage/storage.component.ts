import {Component, OnInit, ViewChild} from '@angular/core';
import {ClusterCreateComponent} from '../cluster/cluster-create/cluster-create.component';
import {ClusterListComponent} from '../cluster/cluster-list/cluster-list.component';
import {StorageCreateComponent} from './storage-create/storage-create.component';
import {StorageListComponent} from './storage-list/storage-list.component';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {
  @ViewChild(StorageCreateComponent)
  creationStorage: StorageCreateComponent;

  @ViewChild(StorageListComponent)
  listStorage: StorageListComponent;

  constructor() {
  }

  ngOnInit() {
  }

  openModal(): void {
    this.creationStorage.newStorage();
  }

  createCluster(created: boolean) {
    if (created) {
      this.listStorage.listStorage();
    }
  }

}
