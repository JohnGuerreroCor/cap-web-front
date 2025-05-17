import { GrupoInvestigacion } from './grupo-investigacion';
import { Persona } from './persona';

export class DocenteGrupo {
  codigo!: number;
  persona!: Persona;
  grupoInvestigacion!: GrupoInvestigacion;
  estado!: number;
}
