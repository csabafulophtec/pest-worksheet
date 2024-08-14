import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentFileService {
  http = inject(HttpClient);

  API_URL = 'http://localhost:3000/';

  getFileByFileName(name: string) {
    return this.http.get(this.API_URL + `files/${name}`, {
      responseType: 'blob',
    });
  }
}
