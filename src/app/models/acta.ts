import { EstadoActa } from './estado-acta';

export class Acta {
  codigo!: number;
  nombre!: string;
  descripcion!: string;
  inicio!: Date;
  fin!: Date;
  estadoActa!: EstadoActa;
  estado!: number;
}
