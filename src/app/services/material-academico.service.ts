import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { TipoMaterial } from '../models/tipo-material';
import { TipoMaterialSubCategoria } from '../models/tipo-material-sub-categoria';
import { TipoImpacto } from '../models/tipo-impacto';
import { TipoAnexo } from '../models/tipo-anexo';
import { RevistaMinciencias } from '../models/revista-minciencias';
import { MaterialAcademico } from '../models/material-academico';

@Injectable({
  providedIn: 'root',
})
export class MaterialAcademicoService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/materialAcademico`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  obtenerListadoTipoMaterial(): Observable<TipoMaterial[]> {
    return this.http.get<TipoMaterial[]>(
      `${this.url}/obtener-listado-tipo-material`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerTipoMaterial(codigo: number): Observable<TipoMaterial> {
    return this.http.get<TipoMaterial>(
      `${this.url}/obtener-tipo-material/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerListadoTipoMaterialSubCategoria(): Observable<
    TipoMaterialSubCategoria[]
  > {
    return this.http.get<TipoMaterialSubCategoria[]>(
      `${this.url}/obtener-listado-tipo-material-sub-categoria`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerTipoMaterialSubCategoria(
    codigo: number
  ): Observable<TipoMaterialSubCategoria> {
    return this.http.get<TipoMaterialSubCategoria>(
      `${this.url}/obtener-tipo-material-sub-categoria/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerTipoMaterialSubCategoriaPorTipoMaterial(
    codigo: number
  ): Observable<TipoMaterialSubCategoria[]> {
    return this.http.get<TipoMaterialSubCategoria[]>(
      `${this.url}/obtener-listado-tipo-material-sub-categoria-por-tipo-material/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerTipoImpactoPorTipoMaterial(codigo: number): Observable<TipoImpacto[]> {
    return this.http.get<TipoImpacto[]>(
      `${this.url}/obtener-tipo-impacto-por-tipo-material/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerTipoAnexoPorTipoMaterial(codigo: number): Observable<TipoAnexo[]> {
    return this.http.get<TipoAnexo[]>(
      `${this.url}/obtener-tipo-anexo-por-tipo-material/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerListadoRevistaMinciencias(): Observable<RevistaMinciencias[]> {
    return this.http.get<RevistaMinciencias[]>(
      `${this.url}/obtener-listado-revista-minciencias`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  insertarMaterialAcademico(
    materialAcademico: MaterialAcademico
  ): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-material-academico`,
      materialAcademico,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarMaterialAcademico(
    materialAcademico: MaterialAcademico
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-material-academico`,
      materialAcademico,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  eliminarMaterialAcademico(
    materialAcademico: MaterialAcademico
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/eliminar-material-academico`,
      materialAcademico,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
