import { MaterialAcademico } from 'src/app/models/material-academico';
import { Acta } from './acta';
import { EstadoSolicitud } from './estado-solicitud';
import { Persona } from './persona';

export class SolicitudPuntaje {
  codigo!: number;
  persona!: Persona;
  fecha!: Date;
  acta!: Acta;
  observacion!: string;
  estadoSolicitud!: EstadoSolicitud;
  materialAcademico!: MaterialAcademico;
  estado!: number;
}
