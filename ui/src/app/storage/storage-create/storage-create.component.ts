import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ClrWizard} from '@clr/angular';
import {Cluster} from '../../cluster/cluster';
import {StorageCluster} from '../storage-cluster';
import {NgForm} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {StorageService} from '../storage.service';
import {TipLevels} from '../../tip/tipLevels';
import {PackageService} from '../../package/package.service';
import {Package, Template} from '../../package/package';
import {TipService} from '../../tip/tip.service';

@Component({
  selector: 'app-storage-create',
  templateUrl: './storage-create.component.html',
  styleUrls: ['./storage-create.component.css']
})
export class StorageCreateComponent implements OnInit {
  @ViewChild('wizard') wizard: ClrWizard;
  createClusterOpened = false;
  isSubmitGoing = false;
  storageCluster: StorageCluster = new StorageCluster();
  @ViewChild('basicFrom')
  basicForm: NgForm;
  clusterNameChecker: Subject<string> = new Subject<string>();
  isNameValid = true;
  nameTooltipText = '';
  packageToolTipText = '';
  checkOnGoing = false;
  package: Package;
  packages: Package[] = [];
  templates: Template[] = [];
  resourceName = 'storage';
  template: Template = new Template();



  @Output() create = new EventEmitter<boolean>();


  constructor(private storageService: StorageService, private packageService: PackageService, private tipService: TipService) {
  }

  ngOnInit() {
    this.clusterNameChecker.pipe(debounceTime(3000)).subscribe(() => {
      const cluster_name = this.basicForm.controls['cluster_name'];
      if (cluster_name) {
        this.isNameValid = cluster_name.valid;
        if (this.isNameValid) {
          if (!this.checkOnGoing) {
            this.checkOnGoing = true;
            this.storageService.getStorage(this.storageCluster.name).subscribe(data => {
              this.checkOnGoing = false;
              this.nameTooltipText = '集群名称 ' + this.storageCluster.name + '已存在！';
              this.isNameValid = false;
            }, error1 => {
              this.checkOnGoing = false;
            });
          }
        }
      }
    });
  }
  public get isBasicFormValid(): boolean {
    return this.basicForm && this.basicForm.valid && this.isNameValid && !this.checkOnGoing;
  }
  listPackages() {
    this.packageService.listPackage().subscribe(data => {
      this.packages = data.filter((pacakge) => {
        return pacakge.meta.resource === this.resourceName;
      });
    }, error => {
      this.tipService.showTip('加载离线包错误!: \n' + error, TipLevels.ERROR);
    });
  }

  onPackageChange() {
    this.packages.forEach(pk => {
      if (pk.name === this.storageCluster.package) {
        this.package = pk;
        this.templates = this.package.meta.templates;
      }
    });
    this.templates = this.package.meta.templates;
  }


  newStorage() {
    this.createClusterOpened = true;
    this.listPackages();
  }

  handleValidation(): void {
    const cont = this.basicForm.controls['cluster_name'];
    if (cont) {
      this.clusterNameChecker.next(cont.value);
    }
  }

}
