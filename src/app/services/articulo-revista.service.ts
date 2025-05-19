import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { ArticuloRevista } from '../models/articulo-revista';

@Injectable({
  providedIn: 'root',
})
export class ArticuloRevistaService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/articuloRevista`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  obtenerListadoArticuloRevista(): Observable<ArticuloRevista[]> {
    return this.http.get<ArticuloRevista[]>(
      `${this.url}/obtener-listado-articulo-revista`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerArticuloRevista(codigo: number): Observable<ArticuloRevista> {
    return this.http.get<ArticuloRevista>(
      `${this.url}/obtener-articulo-revista/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerArticuloRevistaPorMaterialAcademico(
    codigo: number
  ): Observable<ArticuloRevista[]> {
    return this.http.get<ArticuloRevista[]>(
      `${this.url}/obtener-listado-articulo-revista-por-material-academico/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  insertarArticuloRevista(
    materialAcademico: ArticuloRevista
  ): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-articulo-revista`,
      materialAcademico,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarArticuloRevista(
    materialAcademico: ArticuloRevista
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-articulo-revista`,
      materialAcademico,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  eliminarArticuloRevista(
    materialAcademico: ArticuloRevista
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/eliminar-articulo-revista`,
      materialAcademico,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
