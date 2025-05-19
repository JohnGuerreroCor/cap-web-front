import { TipoAnexo } from './tipo-anexo';

export class AnexoMaterial {
  codigo!: number;
  materialAcademicoCodigo!: number;
  tipoAnexo!: TipoAnexo;
  nombre!: string;
  ruta!: string;
  estado!: number;
}
