import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {TipService} from '../../../tip/tip.service';
import {TipLevels} from '../../../tip/tipLevels';
import {MessageService} from '../../../base/message.service';
import {MessageLevels} from '../../../base/message/message-level';
import {SettingService} from '../../../setting/setting.service';
import {StorageService} from '../../service/storage.service';
import {Storage} from '../../class/storage';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css']
})
export class StorageListComponent implements OnInit {
  loading = true;
  storages: Storage[] = [];
  deleteModal = false;
  selectedStorages: Storage[] = [];

  @Output() addStorage = new EventEmitter<void>();

  constructor(private storageService: StorageService, private router: Router,
              private tipService: TipService, private messageService: MessageService, private settingService: SettingService) {
  }

  ngOnInit() {
    this.listStorage();
  }


  listStorage() {
    this.storageService.listStorages().subscribe(data => {
      this.storages = data;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }


  onDeleted() {
    this.deleteModal = true;
  }

  confirmDelete() {
    const promises: Promise<{}>[] = [];
    this.selectedStorages.forEach(storage => {
      promises.push(this.storageService.deleteStorage(storage.name).toPromise());
    });
    Promise.all(promises).then(() => {
      this.deleteModal = false;
      this.listStorage();
      this.tipService.showTip('删除集群成功！', TipLevels.SUCCESS);
    }, (error) => {
      this.tipService.showTip('删除集群失败:' + error, TipLevels.ERROR);
    });
  }


  addNewStorage() {
    this.addStorage.emit();
  }

  // goToLink(storageName: string) {
  //   const linkUrl = ['fit2openshift', 'storage', storageName, 'overview'];
  //   this.router.navigate(linkUrl);
  // }

}
