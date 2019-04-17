import {Component, OnInit, ViewChild} from '@angular/core';
import {ClusterCreateComponent} from './component/cluster-create/cluster-create.component';
import {ClusterListComponent} from './component/cluster-list/cluster-list.component';
import {Cluster} from './class/cluster';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {

  @ViewChild(ClusterCreateComponent)
  creationCluster: ClusterCreateComponent;

  @ViewChild(ClusterListComponent)
  listCluster: ClusterListComponent;


  constructor() {
  }

  ngOnInit() {
  }

  openModal(): void {
    this.creationCluster.newCluster();
  }

  createCluster(created: boolean) {
    if (created) {
      this.listCluster.listCluster();
    }
  }
}
