import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Cluster} from '../../class/cluster';
import {OpenshiftClusterService} from '../../service/openshift-cluster.service';
import {Router} from '@angular/router';
import {TipService} from '../../../tip/tip.service';
import {TipLevels} from '../../../tip/tipLevels';
import {MessageService} from '../../../base/message.service';
import {MessageLevels} from '../../../base/message/message-level';
import {SettingService} from '../../../setting/setting.service';
import {OpenshiftCluster} from '../../class/openshift-cluster';

@Component({
  selector: 'app-cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.css']
})
export class ClusterListComponent implements OnInit {
  loading = true;
  clusters: OpenshiftCluster[] = [];
  deleteModal = false;
  selectedClusters: Cluster[] = [];

  @Output() addCluster = new EventEmitter<void>();

  constructor(private clusterService: OpenshiftClusterService, private router: Router,
              private tipService: TipService, private messageService: MessageService, private settingService: SettingService) {
  }

  ngOnInit() {
    this.listCluster();
    this.checkSetting();
  }

  checkSetting() {
    this.settingService.getSetting('local_hostname').subscribe(data => {
      if (!data.value || data.value === '127.0.0.1') {
        this.messageService.announceMessage('部署前请先设置主机IP,否则部署将造成失败！', MessageLevels.WARN);
      }
    });
  }

  listCluster() {
    this.clusterService.listOpenshiftCluster().subscribe(data => {
      this.clusters = data;
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
    this.selectedClusters.forEach(cluster => {
      promises.push(this.clusterService.deleteOpenshiftCluster(cluster.name).toPromise());
    });
    Promise.all(promises).then(() => {
      this.deleteModal = false;
      this.listCluster();
      this.tipService.showTip('删除集群成功！', TipLevels.SUCCESS);
    }, (error) => {
      this.tipService.showTip('删除集群失败:' + error, TipLevels.ERROR);
    });
  }


  addNewCluster() {
    this.addCluster.emit();
  }

  goToLink(clusterName: string) {
    const linkUrl = ['fit2openshift', 'cluster', clusterName, 'overview'];
    this.router.navigate(linkUrl);
  }

}
