import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StorageService} from '../storage.service';
import {Cluster} from '../../cluster/cluster';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css']
})
export class StorageListComponent implements OnInit {
  loading = true;
  storages: Storage[] = [];
  deleteModal = false;
  selectedStorages: Cluster[] = [];
  @Output() addStorage = new EventEmitter<void>();

  constructor(private storageService: StorageService) {
  }

  ngOnInit() {
    this.listStorage();
  }


  listStorage() {
    this.storageService.listStorage().subscribe(data => {
      this.storages = data;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  addNewStorage() {
    this.addStorage.emit();
  }

  onDeleted() {
    this.deleteModal = true;
  }

}
