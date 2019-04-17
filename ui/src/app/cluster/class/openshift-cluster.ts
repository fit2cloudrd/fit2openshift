import {Cluster} from './cluster';

export class OpenshiftCluster extends Cluster {
  resource = 'okd';
}
