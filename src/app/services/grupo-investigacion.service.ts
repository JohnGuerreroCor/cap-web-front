import { LineaInvestigacion } from './../models/linea-investigacion';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { GrupoInvestigacion } from '../models/grupo-investigacion';
import { DocenteGrupo } from '../models/docente-grupo';

@Injectable({
  providedIn: 'root',
})
export class GrupoInvestigacionService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/grupoInvestigacion`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  obtenerListadoGrupoInvestigacion(): Observable<GrupoInvestigacion[]> {
    return this.http.get<GrupoInvestigacion[]>(
      `${this.url}/obtener-listado-grupo-investigacion`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerListadoGrupoInvestigacionPorLinea(
    codigo: number
  ): Observable<GrupoInvestigacion[]> {
    return this.http.get<GrupoInvestigacion[]>(
      `${this.url}/obtener-grupo-investigacion-por-linea-investigacion/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerGrupoInvestigacion(codigo: number): Observable<GrupoInvestigacion> {
    return this.http.get<GrupoInvestigacion>(
      `${this.url}/obtener-grupo-investigacion/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerListadoLineasInvestigacion(): Observable<LineaInvestigacion[]> {
    return this.http.get<LineaInvestigacion[]>(
      `${this.url}/obtener-listado-linea-investigacion`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerLineaInvestigacion(codigo: number): Observable<LineaInvestigacion> {
    return this.http.get<LineaInvestigacion>(
      `${this.url}/obtener-linea-investigacion/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  insertarDocenteGrupo(docenteGrupo: DocenteGrupo): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-docente-grupo`,
      docenteGrupo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarDocenteGrupo(docenteGrupo: DocenteGrupo): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-docente-grupo`,
      docenteGrupo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  eliminarDocenteGrupo(docenteGrupo: DocenteGrupo): Observable<number> {
    return this.http.put<number>(
      `${this.url}/eliminar-docente-grupo`,
      docenteGrupo,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
