import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Cluster} from '../../class/cluster';

@Component({
  selector: 'app-cluster-detail',
  templateUrl: './cluster-detail.component.html',
  styleUrls: ['./cluster-detail.component.css']
})
export class ClusterDetailComponent implements OnInit {


  constructor(private router: Router) {
  }

  ngOnInit() {

  }

  backToCluster() {
    this.router.navigate(['fit2openshift', 'cluster']);
  }

}
