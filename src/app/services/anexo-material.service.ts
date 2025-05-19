import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { AnexoMaterial } from '../models/anexo-material';

@Injectable({
  providedIn: 'root',
})
export class AnexoMaterialService {
  private httpHeaders = new HttpHeaders();

  private url: string = `${environment.URL_BACKEND}/anexoMaterial`;

  constructor(private http: HttpClient, private authservice: AuthService) {}
  private aggAutorizacionHeader(): HttpHeaders {
    const token = this.authservice.Token;
    if (!token) {
      return new HttpHeaders();
    }

    // Crea nuevos headers en cada llamada (evita mutar estado)
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      // No incluyas 'Content-Type': Angular lo manejará automáticamente para FormData
    });
  }

  obtenerListadoAnexoMaterial(): Observable<AnexoMaterial[]> {
    return this.http.get<AnexoMaterial[]>(
      `${this.url}/obtener-listado-anexo-material`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerAnexoMaterial(codigo: number): Observable<AnexoMaterial> {
    return this.http.get<AnexoMaterial>(
      `${this.url}/obtener-anexo-material/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerAnexoMaterialPorMaterialAcademico(
    codigo: number
  ): Observable<AnexoMaterial[]> {
    return this.http.get<AnexoMaterial[]>(
      `${this.url}/obtener-listado-anexo-material-por-material-academico/${codigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  insertarAnexoMaterial(archivo: File, json: AnexoMaterial): Observable<null> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('json', JSON.stringify(json));
    console.log(JSON.stringify(json));
    
    return this.http.post<null>(
      `${this.url}/registrar-anexo-material/${this.authservice.user.personaCodigo}/746`,
      formData,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  actualizarAnexoMaterial(anexoMaterial: AnexoMaterial): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-anexo-material`,
      anexoMaterial,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  eliminarAnexoMaterial(anexoMaterial: AnexoMaterial): Observable<number> {
    return this.http.put<number>(
      `${this.url}/eliminar-anexo-material`,
      anexoMaterial,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
