import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Acta } from '../models/acta';
import { EstadoActa } from '../models/estado-acta';

@Injectable({
  providedIn: 'root',
})
export class ActaService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/actas`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  obtenerListadoActas(): Observable<Acta[]> {
    return this.http.get<Acta[]>(`${this.url}/obtener-listado-actas`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  obtenerActa(codigo: number): Observable<Acta> {
    return this.http.get<Acta>(`${this.url}/obtener-acta/${codigo}`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  obtenerListadoEstadosActa(): Observable<EstadoActa[]> {
    return this.http.get<EstadoActa[]>(
      `${this.url}/obtener-listado-estados-acta`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }
}
