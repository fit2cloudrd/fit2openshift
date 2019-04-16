import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageCreateComponent} from '../storage/storage-create/storage-create.component';
import {StorageListComponent} from '../storage/storage-list/storage-list.component';

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

  createStorage(created: boolean) {
    if (created) {
      this.listStorage.listStorage();
    }
  }
}
