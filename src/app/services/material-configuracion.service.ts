import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { SolicitudPuntaje } from '../models/solicitud-puntaje';

@Injectable({
  providedIn: 'root',
})
export class MaterialConfiguracionService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/materialConfiguracion`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  obtenerListadoMaterialConfiguracion(): Observable<SolicitudPuntaje[]> {
    return this.http.get<SolicitudPuntaje[]>(
      `${this.url}/obtener-listado-solicitud-puntaje-por-persona/${this.authservice.user.personaCodigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerMaterialConfiguracionlPorParametros(
    tipoMaterialCodigo: number,
    tipoMaterialSubCategoriaCodigo: number,
    tipoImpactoCodigo: number
  ): Observable<SolicitudPuntaje> {
    return this.http.get<SolicitudPuntaje>(
      `${this.url}/obtener-material-configuracion-por-parametros/${tipoMaterialCodigo}/${tipoMaterialSubCategoriaCodigo}/${tipoImpactoCodigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }
}
