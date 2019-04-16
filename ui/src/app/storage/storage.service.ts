import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export const baseUrl = '/api/v1/storage/clusters/';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) {
  }

  listStorage(): Observable<Storage[]> {
    return this.http.get<Storage[]>(baseUrl);
  }

  addStorage(storage: Storage): Observable<Storage> {
    return this.http.post<Storage>(baseUrl, storage);
  }

  getStorage(name: string): Observable<Storage> {
    return this.http.get<Storage>(baseUrl + name);
  }
}
