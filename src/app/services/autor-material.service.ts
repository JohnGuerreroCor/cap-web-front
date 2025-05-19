import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { TipoMaterial } from '../models/tipo-material';
import { TipoMaterialSubCategoria } from '../models/tipo-material-sub-categoria';
import { MaterialAcademico } from '../models/material-academico';
import { AutorMaterial } from '../models/autor-material';

@Injectable({
  providedIn: 'root',
})
export class AutorMaterialService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/autorMaterial`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  obtenerListadoAutorMaterial(): Observable<AutorMaterial[]> {
    return this.http.get<AutorMaterial[]>(
      `${this.url}/obtener-listado-autor-material`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerAutorMaterial(codigo: number): Observable<AutorMaterial> {
    return this.http.get<AutorMaterial>(
      `${this.url}/obtener-autor-material/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerAutorMaterialPorMaterialAcademico(
    codigo: number
  ): Observable<AutorMaterial[]> {
    return this.http.get<AutorMaterial[]>(
      `${this.url}/obtener-listado-autor-material-por-material-academico/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  insertarAutorMaterial(autorMaterial: AutorMaterial): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-autor-material`,
      autorMaterial,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarAutorMaterial(autorMaterial: AutorMaterial): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-autor-material`,
      autorMaterial,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  eliminarAutorMaterial(autorMaterial: AutorMaterial): Observable<number> {
    return this.http.put<number>(
      `${this.url}/eliminar-autor-material`,
      autorMaterial,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
