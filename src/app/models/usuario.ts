export class Usuario {
  id!: number;
  username!: string;
  password!: string;
  personaCodigo!: number;
  personaNombre!: string;
  personaApellido!: string;
  personaIdentificacion!: string;
  personaEmailInterno!: string;
  uid!:number;
  roles: string[] = [];
  horaInicioSesion!: string;
}
