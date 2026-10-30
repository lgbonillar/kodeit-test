import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Rule } from '../models/rule'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  private readonly http = inject(HttpClient)

  getRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>('/mock.json')
  }

}
