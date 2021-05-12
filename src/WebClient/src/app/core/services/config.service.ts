import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: AppConfig;

  constructor(private http: HttpClient) { }

  async init(): Promise<void> {
    this.config = await this.http.get<AppConfig>('./assets/appsettings.json').toPromise();
    return Promise.resolve();
  }

  get Config(): AppConfig {
    return this.config;
  }
}
