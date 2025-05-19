import { RevistaMinciencias } from './revista-minciencias';

export class ArticuloRevista {
  codigo!: number;
  materialAcademicoCodigo!: number;
  nombre!: string;
  revistaMinciencias!: RevistaMinciencias;
  url!: string;
  mesesRequeridosPublicacion!: number;
  fechaSumision!: Date;
  fechaAprobacion!: Date;
  recursosUniversidad!: number;
  estado!: number;
}
