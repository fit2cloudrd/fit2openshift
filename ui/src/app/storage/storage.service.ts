import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Storage} from './storage';

export const baseStorageUrl = '/api/v1/storage/clusters/';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) {
  }

  listStorages(): Observable<Storage[]> {
    return this.http.get<Storage[]>(baseStorageUrl);
  }

  getStorage(name: string): Observable<Storage> {
    return this.http.get<Storage>(baseStorageUrl + name);
  }

  createStorage(storage: Storage) {
    return this.http.post<Storage>(baseStorageUrl, storage);
  }

  deleteStorage(name: string) {
    return this.http.delete(baseStorageUrl + name);
  }
}
