import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ExtraConfig} from '../class/cluster';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {HostService} from '../../host/host.service';
import {OpenshiftCluster} from '../class/openshift-cluster';


const baseOpenshiftClusterUrl = '/api/v1/openshift/';
const baseOpenshiftClusterConfigUrl = '/api/v1/openshift/{openshift_name}/configs/';

@Injectable({
  providedIn: 'root'
})
export class OpenshiftClusterService {

  constructor(private http: HttpClient, private hostService: HostService) {
  }

  listOpenshiftCluster(): Observable<OpenshiftCluster[]> {
    return this.http.get<OpenshiftCluster[]>(baseOpenshiftClusterUrl).pipe(
      catchError(error => throwError(error)));
  }

  getOpenshiftCluster(clusterName): Observable<OpenshiftCluster> {
    return this.http.get<OpenshiftCluster>(`${baseOpenshiftClusterUrl}${clusterName}`).pipe(
      catchError(error => throwError(error))
    );
  }

  createOpenshiftCluster(cluster: OpenshiftCluster): Observable<OpenshiftCluster> {
    return this.http.post<OpenshiftCluster>(baseOpenshiftClusterUrl, cluster).pipe(
      catchError(error => throwError(error))
    );
  }

  deleteOpenshiftCluster(clusterName): Observable<any> {
    return this.http.delete(`${baseOpenshiftClusterUrl}${clusterName}`).pipe(
      catchError(error => throwError(error))
    );
  }

  configOpenshiftCluster(clusterName: string, extraConfig: ExtraConfig): Observable<ExtraConfig> {
    return this.http.post<ExtraConfig>(`${baseOpenshiftClusterConfigUrl.replace('{openshift_name}', clusterName)}`, extraConfig).pipe(
      catchError(error => throwError(error))
    );
  }
}
