import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {TipService} from '../../tip/tip.service';
import {ClrWizard} from '@clr/angular';
import {Config, Package, Template} from '../../package/package';
import {PackageService} from '../../package/package.service';
import {TipLevels} from '../../tip/tipLevels';
import {NodeService} from '../../node/node.service';
import {Host} from '../../host/host';
import {Node} from '../../node/node';
import {HostService} from '../../host/host.service';
import {config, Subject} from 'rxjs';
import {NgForm} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Group} from '../../cluster/group';
import {CheckResult, DeviceCheckService} from '../../cluster/device-check.service';
import {RelationService} from '../../cluster/relation.service';
import {StorageService} from '../storage.service';
import {Storage} from '../storage';

export const CHECK_STATE_PENDING = 'pending';
export const CHECK_STATE_SUCCESS = 'success';
export const CHECK_STATE_FAIL = 'fail';

@Component({
  selector: 'app-storage-create',
  templateUrl: './storage-create.component.html',
  styleUrls: ['./storage-create.component.css']
})


export class StorageCreateComponent implements OnInit, OnDestroy {


  @ViewChild('wizard') wizard: ClrWizard;
  createStorageOpened: boolean;
  isSubmitGoing = false;
  storage: Storage = new Storage();
  template: Template = new Template();
  package: Package;
  packages: Package[] = [];
  templates: Template[] = [];
  nodes: Node[] = [];
  hosts: Host[] = [];
  groups: Group[] = [];
  checkCpuState = CHECK_STATE_PENDING;
  checkMemoryState = CHECK_STATE_PENDING;
  checkOsState = CHECK_STATE_PENDING;
  checkCpuResult: CheckResult = new CheckResult();
  checkMemoryResult: CheckResult = new CheckResult();
  checkOsResult: CheckResult = new CheckResult();
  suffix = '.f2o';
  @ViewChild('basicFrom')
  basicForm: NgForm;
  isNameValid = true;
  nameTooltipText = '';
  packageToolTipText = '';
  checkOnGoing = false;
  storageNameChecker: Subject<string> = new Subject<string>();

  @Output() create = new EventEmitter<boolean>();
  loadingFlag = false;

  constructor(private tipService: TipService, private nodeService: NodeService, private storageService: StorageService
    , private packageService: PackageService, private relationService: RelationService,
              private hostService: HostService, private deviceCheckService: DeviceCheckService) {
  }

  ngOnInit() {
    this.storageNameChecker.pipe(debounceTime(3000)).subscribe(() => {
      const storage_name = this.basicForm.controls['storage_name'];
      if (storage_name) {
        this.isNameValid = storage_name.valid;
        if (this.isNameValid) {
          if (!this.checkOnGoing) {
            this.checkOnGoing = true;
            this.storageService.getStorage(this.storage.name).subscribe(data => {
              this.checkOnGoing = false;
              this.nameTooltipText = '集群名称 ' + this.storage.name + '已存在！';
              this.isNameValid = false;
            }, error1 => {
              this.checkOnGoing = false;
            });
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.storageNameChecker.unsubscribe();
  }

  public get isBasicFormValid(): boolean {
    return this.basicForm && this.basicForm.valid && this.isNameValid && !this.checkOnGoing;
  }

  handleValidation(): void {
    const cont = this.basicForm.controls['storage_name'];
    if (cont) {
      this.storageNameChecker.next(cont.value);
    }
  }

  onPackageChange() {
    this.packages.forEach(pk => {
      if (pk.name === this.storage.package) {
        this.package = pk;
        this.templates = this.package.meta.templates;
      }
    });
    this.templates = this.package.meta.templates;
  }


  newStorage() {
    this.reset();
    this.createStorageOpened = true;
    this.listPackages();
    this.getAllHost();
  }


  getAllHost() {
    this.hostService.listHosts().subscribe(data => {
      this.hosts = data;

    }, error => {
      console.log(error);
    });
  }

  reset() {
    this.wizard.reset();
    this.storage = new Storage();
    this.storage.template = '';
    this.template = null;
    this.templates = null;
    this.nodes = null;
    this.groups = null;
    this.resetCheckState();
  }


  listPackages() {
    this.packageService.listPackage().subscribe(data => {
      this.packages = data.filter(p => {
        return p.meta.resource === 'storage';
      });
    }, error => {
      this.tipService.showTip('加载离线包错误!: \n' + error, TipLevels.ERROR);
    });
  }

  templateOnChange() {
    this.templates.forEach(template => {
      if (template.name === this.storage.template) {
        this.template = template;
      }
    });
    this.nodes = [];
    this.groups = [];
    this.templates.forEach(tmp => {
      if (tmp.name === this.storage.template) {
        tmp.roles.forEach(role => {
          if (!role.meta.hidden) {
            const group: Group = new Group();
            group.node_vars = role.meta.node_vars;
            group.name = role.name;
            group.op = role.meta.requires.nodes_require[0];
            group.limit = role.meta.requires.nodes_require[1];
            for (let i = group.node_sum; i < group.limit; i++) {
              this.addNode(group, false);
            }
            this.groups.push(group);
          }
        });
      }
    });
  }

  onHostChange(node: Node) {
    if (node.host) {
      node.volumes = [];
      this.hosts.forEach(host => {
        if (host.id === node.host) {
          host.info.volumes.forEach(volume => {
            node.volumes.push(volume.name);
          });
        }
      });
    }

  }

  deleteNode(group: Group, node: Node) {
    let indexG;
    let indexN;
    for (let i = 0; i < group.nodes.length; i++) {
      if (node.name === group.nodes[i].name) {
        indexG = i;
      }
    }
    for (let i = 0; i < this.nodes.length; i++) {
      if (node.name === this.nodes[i].name) {
        indexN = i;
      }
    }
    group.nodes.splice(indexG, 1);
    this.nodes.splice(indexN, 1);
    group.node_sum--;

  }

  addNode(group: Group, canDelete?: boolean) {
    const node: Node = new Node();
    if (canDelete !== undefined && canDelete !== null) {
      node.delete = canDelete;
    }
    const no = group.node_sum + 1;
    node.name = group.name + '-' + no + '.' + this.storage.name + this.suffix;
    group.node_sum++;
    node.roles.push(group.name);
    group.nodes.push(node);
    this.nodes.push(node);
  }

  fullNode() {
    this.resetCheckState();
    this.deviceCheck();
    this.nodes.forEach(node => {
      this.hosts.forEach(host => {
        if (node.host === host.id) {
          node.ip = host.ip;
          node.host_memory = host.info.memory;
          node.host_cpu_core = host.info.cpu_core;
          node.host_os = host.info.os;
          node.host_os_version = host.info.os_version;
        }
      });
    });
  }

  onSubmit() {
    if (this.isSubmitGoing) {
      return;
    }
    this.isSubmitGoing = true;
    this.storageService.createStorage(this.storage).subscribe(data => {
      this.storage = data;
      this.createNodes();
    });
  }


  createNodes() {
    const promises: Promise<{}>[] = [];
    this.nodes.forEach(node => {
      promises.push(this.nodeService.createNode(this.storage.name, node).toPromise());
    });
  }

  canNodeNext(): boolean {
    let result = false;
    if (this.nodes) {
      this.nodes.some(node => {
        if (!node.host) {
          result = true;
          return true;
        }
      });
    }
    return result;
  }


  replaceNodeVarsKey(key: string): string {
    switch (key) {
      case 'docker_storage_device':
        return 'Docker 存储卷';
      case 'glusterfs_devices':
        return 'GlusterFS 卷';
      default:
        return key;
    }
  }


  getHostInfo(host: Host) {
    const template = '{N} [{C}核  {M}MB  {O}]';
    return template.replace('{C}', host.info.cpu_core.toString())
      .replace('{M}', host.info.memory.toString())
      .replace('{O}', host.info.os + host.info.os_version)
      .replace('{N}', host.name);
  }

  getHostById(hostId: string): Host {
    let h: Host;
    this.hosts.forEach(host => {
      if (host.id === hostId) {
        h = host;
      }
    });
    return h;
  }
  deviceCheck() {
    setTimeout(() => {
      this.checkCpu();
    }, 2000);
    setTimeout(() => {
      this.checkMemory();
    }, 4000);
    setTimeout(() => {
      this.checkOS();
    }, 6000);
  }

  checkCpu() {
    this.checkCpuResult = this.deviceCheckService.checkCpu(this.nodes, this.hosts, this.template);
    if (this.checkCpuResult.passed.length === this.nodes.length) {
      this.checkCpuState = CHECK_STATE_SUCCESS;
    } else {
      this.checkCpuState = CHECK_STATE_FAIL;
    }
  }

  checkMemory() {
    this.checkMemoryResult = this.deviceCheckService.checkMemory(this.nodes, this.hosts, this.template);
    if (this.checkMemoryResult.passed.length === this.nodes.length) {
      this.checkMemoryState = CHECK_STATE_SUCCESS;
    } else {
      this.checkMemoryState = CHECK_STATE_FAIL;
    }
  }

  checkOS() {
    this.checkOsResult = this.deviceCheckService.checkOs(this.nodes, this.hosts, this.template);
    if (this.checkOsResult.passed.length === this.nodes.length) {
      this.checkOsState = CHECK_STATE_SUCCESS;
    } else {
      this.checkOsState = CHECK_STATE_FAIL;
    }
  }

  resetCheckState() {
    this.checkCpuState = CHECK_STATE_PENDING;
    this.checkMemoryState = CHECK_STATE_PENDING;
    this.checkOsState = CHECK_STATE_PENDING;
  }

  canCheckNext() {
    if (this.checkOsState === CHECK_STATE_SUCCESS && this.checkMemoryState === CHECK_STATE_SUCCESS &&
      this.checkCpuState === CHECK_STATE_SUCCESS) {
      return true;
    }
    return false;
  }

  onCancel() {
    this.reset();
    this.createStorageOpened = false;
  }


}
