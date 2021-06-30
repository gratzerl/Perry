import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { APP_CONFIG } from 'src/app/shared/shared.module';
import { AppConfig } from 'src/app/core/models';

@Injectable({
  providedIn: 'root'
})
export class IngredientsIdentificationService {
  private readonly route: string = `${this.config.apiBaseUrl}/ingredient-identification`;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) { }

  identifyIngredientsInImages(images: NzUploadFile[]): Observable<string[]> {
    const formData = new FormData();
    images.forEach((image: any) => formData.append(image.name, image));

    return this.http.post<string[]>(this.route, formData);
  }
}
