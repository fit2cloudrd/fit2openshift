import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-storage-detail',
  templateUrl: './storage-detail.component.html',
  styleUrls: ['./storage-detail.component.css']
})
export class StorageDetailComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  backToStorage() {
    this.router.navigate(['fit2openshift', 'storage']);
  }

}
