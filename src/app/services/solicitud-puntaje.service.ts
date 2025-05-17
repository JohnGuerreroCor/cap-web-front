import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { SolicitudPuntaje } from '../models/solicitud-puntaje';
import { EstadoSolicitud } from '../models/estado-solicitud';

@Injectable({
  providedIn: 'root',
})
export class SolicitudPuntajeService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/solicitudPuntaje`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  obtenerListadoSolicitudPuntajePorPersona(): Observable<SolicitudPuntaje[]> {
    return this.http.get<SolicitudPuntaje[]>(
      `${this.url}/obtener-listado-solicitud-puntaje-por-persona/${this.authservice.user.personaCodigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerSolicitudPuntaje(codigo: number): Observable<SolicitudPuntaje> {
    return this.http.get<SolicitudPuntaje>(
      `${this.url}/obtener-solicitud-puntaje/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerListadoSolicitudesPorActa(
    codigo: number
  ): Observable<SolicitudPuntaje> {
    return this.http.get<SolicitudPuntaje>(
      `${this.url}/obtener-listado-solicitudes-por-acta/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerListadoEstadosSolicitud(): Observable<EstadoSolicitud[]> {
    return this.http.get<EstadoSolicitud[]>(
      `${this.url}/obtener-listado-estado-solicitud`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  insertarSolicitudPuntaje(
    solicitudPuntaje: SolicitudPuntaje
  ): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-solicitud-puntaje`,
      solicitudPuntaje,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarSolicitudPuntaje(
    solicitudPuntaje: SolicitudPuntaje
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-solicitud-puntaje`,
      solicitudPuntaje,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  eliminarSolicitudPuntaje(
    solicitudPuntaje: SolicitudPuntaje
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/eliminar-solicitud-puntaje`,
      solicitudPuntaje,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
