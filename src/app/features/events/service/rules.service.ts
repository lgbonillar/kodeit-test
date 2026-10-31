import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GuardarReglaRequest, Rule } from '../models/rule'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  private readonly http = inject(HttpClient)
  private readonly url = `${ environment.apiUrl }/reglas`

  getRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>(this.url)
  }

  createRule(payload: GuardarReglaRequest): Observable<Rule> {
    return this.http.post<Rule>(this.url, payload)
  }

  updateRule(
    id: string,
    payload: GuardarReglaRequest,
  ): Observable<Rule> {
    return this.http.put<Rule>(`${this.url}/${id}`, payload)
  }

  deleteRule(id: string): Observable<void> {
    return this.http.delete<void>(`${ this.url }/${ id }`)
  }

}
