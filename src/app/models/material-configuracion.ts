import { TipoImpacto } from './tipo-impacto';
import { TipoMaterial } from './tipo-material';
import { TipoMaterialSubCategoria } from './tipo-material-sub-categoria';
import { TipoPunto } from './tipo-punto';
import { TopeAnualReconocimientoSolicitud } from './tope-anual-reconocimiento-solicitud';
import { TopeMaximoPuntos } from './tope-maximo-puntos';

export class MaterialConfiguracion {
  codigo!: number;
  tipoMaterial!: TipoMaterial;
  tipoMaterialSubCategoria!: TipoMaterialSubCategoria;
  topeMaximoPuntos!: TopeMaximoPuntos;
  topeAnualReconocimientoSolicitud!: TopeAnualReconocimientoSolicitud;
  tipoPunto!: TipoPunto;
  tipoImpacto!: TipoImpacto;
  estado!: number;
}
