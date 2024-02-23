import { Injectable } from '@angular/core';
import { UserService } from '../../user/user.service';
import { HttpHeaders } from '@angular/common/http';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
  providedIn: 'root'
})
export class ApiSettingsService {
  constructor(private userService: UserService, private apiUrlService: ApiUrlService) {
    this.apiUrl = apiUrlService.apiUrl + "/api/"
  }

  apiUrl: string

  async getHttpHeaders(patch: boolean = false, auth: boolean = false) {
    var headers = new HttpHeaders()
    if(!patch) {
      headers = headers.append('Content-Type', 'application/json')
    }
    else {
      headers = headers.append('Content-Type', 'application/json-patch+json')
    }

    if(auth) {
      if(this.userService.accessTokenExpiration != null) {
        if(this.userService.accessTokenExpiration > new Date()) {
          headers = headers.append('Authorization', 'Bearer ' + this.userService.accessToken)
        }
        else {
          if(this.userService.refreshTokenExpiration != null) {
            if(this.userService.refreshTokenExpiration > new Date()) {
              await this.userService.refreshTokens()
              headers = headers.append('Authorization', 'Bearer ' + this.userService.accessToken)
            }
          }
        }
      }
    }

    return { headers: headers };
  }
}
