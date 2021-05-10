import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: Config;

  constructor(private http: HttpClient) { }

  async init(): Promise<void> {
    this.config = await this.http.get<Config>('./assets/appsettings.json').toPromise();
    return Promise.resolve();
  }

  get Config(): Config {
    return this.config;
  }
}
