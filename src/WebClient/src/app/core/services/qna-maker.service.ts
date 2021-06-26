import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from 'src/app/core/core.module';
import { AppConfig } from 'src/app/core/models';

@Injectable({
  providedIn: 'root'
})
export class QnAMakerService {
  private readonly route: string = `${this.config.apiBaseUrl}/query-answer`;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) { }

  public queryAnswer(question: string): void {
    const headers = new HttpHeaders().append('question', question);
    var result = this.http.get<string>(this.route, {headers}).subscribe(data => { console.log(data)}); 
    console.log(result);
  }
}
