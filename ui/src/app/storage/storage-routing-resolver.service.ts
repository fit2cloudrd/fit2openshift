import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {Cluster} from '../cluster/class/cluster';
import {ClusterService} from '../cluster/service/cluster.service';

@Injectable()
export class StorageRoutingResolverService implements Resolve<Cluster> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cluster> {
    const clusterName = route.params['name'];
    return this.clusterService.getCluster(clusterName).pipe(
      take(1),
      map(cluster => {
        if (cluster) {
          return cluster;
        } else {
          return null;
        }
      })
    );
  }


  constructor(private clusterService: ClusterService) {
  }
}
