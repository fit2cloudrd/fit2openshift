import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Cluster} from '../class/cluster';
import {Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {ClusterService} from './cluster.service';

@Injectable()
export class ClusterRoutingResolverService implements Resolve<Cluster> {
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
