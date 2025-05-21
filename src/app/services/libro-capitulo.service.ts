import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { LibroCapitulo } from '../models/libro-capitulo';

@Injectable({
  providedIn: 'root',
})
export class LibroCapituloService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/libroCapitulo`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  obtenerListadoLibroCapitulo(): Observable<LibroCapitulo[]> {
    return this.http.get<LibroCapitulo[]>(
      `${this.url}/obtener-listado-libro-capitulo`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerLibroCapitulo(codigo: number): Observable<LibroCapitulo> {
    return this.http.get<LibroCapitulo>(
      `${this.url}/obtener-libro-capitulo/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerLibroCapituloPorMaterialAcademico(
    codigo: number
  ): Observable<LibroCapitulo> {
    return this.http.get<LibroCapitulo>(
      `${this.url}/obtener-listado-libro-capitulo-por-material-academico/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  insertarLibroCapitulo(libroCapitulo: LibroCapitulo): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-libro-capitulo`,
      libroCapitulo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarLibroCapitulo(libroCapitulo: LibroCapitulo): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-libro-capitulo`,
      libroCapitulo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  eliminarLibroCapitulo(libroCapitulo: LibroCapitulo): Observable<number> {
    return this.http.put<number>(
      `${this.url}/eliminar-libro-capitulo`,
      libroCapitulo,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
