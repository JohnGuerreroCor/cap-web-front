import { DocenteGrupo } from './docente-grupo';
import { MaterialConfiguracion } from './material-configuracion';
import { SolicitudPuntaje } from './solicitud-puntaje';
import { TipoEnvioMaterial } from './tipo-envio-material';

export class MaterialAcademico {
  codigo!: number;
  solicitudPuntajeCodigo!: number;
  docenteGrupo!: DocenteGrupo;
  materialConfiguracion!: MaterialConfiguracion;
  tipoEnvioMaterial!: TipoEnvioMaterial;
  titulo!: string;
  traduccionTitulo!: string;
  cantidadAutores!: number;
  cambioCategoriaEscalafon!: number;
  nombreProyectoInvestigacion!: string;
  estado!: number;
}
