import { TipoEnvioMaterial } from './../../models/tipo-envio-material';
import { MaterialConfiguracion } from './../../models/material-configuracion';
import { MaterialConfiguracionService } from './../../services/material-configuracion.service';
import { SolicitudPuntajeService } from './../../services/solicitud-puntaje.service';
import { Persona } from './../../models/persona';
import { ActaService } from './../../services/acta.service';
import { TipoMaterialSubCategoria } from './../../models/tipo-material-sub-categoria';
import { MaterialAcademicoService } from './../../services/material-academico.service';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GrupoInvestigacion } from 'src/app/models/grupo-investigacion';
import { LineaInvestigacion } from 'src/app/models/linea-investigacion';
import { TipoMaterial } from 'src/app/models/tipo-material';
import { AuthService } from 'src/app/services/auth.service';
import { GrupoInvestigacionService } from 'src/app/services/grupo-investigacion.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoImpacto } from 'src/app/models/tipo-impacto';
import { TipoAnexo } from 'src/app/models/tipo-anexo';
import { RevistaMinciencias } from 'src/app/models/revista-minciencias';
import { Acta } from 'src/app/models/acta';
import { SolicitudPuntaje } from 'src/app/models/solicitud-puntaje';
import { map, Observable, startWith } from 'rxjs';
import { MaterialAcademico } from 'src/app/models/material-academico';
import { DocenteGrupo } from 'src/app/models/docente-grupo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
})
export class SolicitudComponent implements OnInit {
  listadoLineaInvestigacion: LineaInvestigacion[] = [];
  listadoGrupoInvestigacion: GrupoInvestigacion[] = [];
  listadoTipoMaterial: TipoMaterial[] = [];
  listadoTipoMaterialSubCategoria: TipoMaterialSubCategoria[] = [];
  listadoTipoImpacto: TipoImpacto[] = [];
  listadoTipoAnexo: TipoAnexo[] = [];
  listadoRevistaMinciencias: RevistaMinciencias[] = [];
  acta!: Acta;
  dialogRef!: MatDialogRef<any>;
  formularioSolicitudPuntaje!: FormGroup;
  formularioMaterialAcademico!: FormGroup;
  formularioRevista!: FormGroup;
  formularioLibro!: FormGroup;
  codigoTipoMaterial!: number;
  nombreArchivo = 'Archivo';
  file!: FileList;
  codigoActa!: number;
  editar: boolean = false;
  myControl = new FormControl<string | TipoMaterial>('');
  filteredOptions!: Observable<TipoMaterial[]>;
  toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  constructor(
    public solicitudPuntajeService: SolicitudPuntajeService,
    public grupoInvestigacionService: GrupoInvestigacionService,
    public materialAcademicoService: MaterialAcademicoService,
    public materialConfiguracionService: MaterialConfiguracionService,
    public actaService: ActaService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.codigoActa = params['id'];
      this.actaService.obtenerActa(this.codigoActa).subscribe((data) => {
        this.acta = data;
      });
    });
  }
  ngOnInit(): void {
    this.obtenerLineasInvestigacion();
    this.crearFormularioMaterialAcademico();
    this.crearFormularioSolicitudPuntaje();
    this.obtenerListadoTipoMaterial();
    this.obtenerListadoRevistaMinciencias();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value?.nombre || '')),
      map((nombre) => this._filter(nombre))
    );
  }

  displayFn(material: TipoMaterial): string {
    return material && material.nombre ? material.nombre : '';
  }

  onInputFocus(): void {
    const currentValue = this.myControl.value;
    this.myControl.setValue(currentValue);
  }

  private _filter(nombre: string): TipoMaterial[] {
    const filterValue = nombre.toLowerCase();
    return this.listadoTipoMaterial.filter((option) =>
      option.nombre.toLowerCase().includes(filterValue)
    );
  }

  private crearFormularioSolicitudPuntaje(): void {
    this.formularioSolicitudPuntaje = this.formBuilder.group({
      codigo: new FormControl(),
      personaCodigo: new FormControl('', Validators.required),
      actaCodigo: new FormControl('', Validators.required),
      estado: new FormControl(),
    });
  }

  generarDocenteGrupo(): void {
    let docenteGrupo: DocenteGrupo = new DocenteGrupo();
    let persona: Persona = new Persona();
    persona.codigo = this.authService.user.personaCodigo;
    docenteGrupo.persona = persona;
    let grupoInvestigacion: GrupoInvestigacion = new GrupoInvestigacion();
    grupoInvestigacion.codigo =
      this.formularioMaterialAcademico.get('grupoInvestigacion')!.value;
    docenteGrupo.grupoInvestigacion = grupoInvestigacion;
    if (!this.editar) {
      this.registrarDocenteGrupo(docenteGrupo);
    } else {
      this.mensajeError();
    }
  }

  registrarDocenteGrupo(docenteGrupo: DocenteGrupo) {
    this.grupoInvestigacionService.insertarDocenteGrupo(docenteGrupo).subscribe(
      (data) => {
        console.log('|||||||:', data);
        if (data > 0) {
          this.toast.fire({
            icon: 'success',
            title: 'Registro Grupo Investigación.',
          });
          this.formularioMaterialAcademico.get('docenteGrupo')!.setValue(data);
          this.generarMaterialAcademico();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  ///// SECCIÓN MATERIAL ACADÉMICO
  private crearFormularioMaterialAcademico(): void {
    this.formularioMaterialAcademico = this.formBuilder.group({
      //PARA LA FUNCIONALIDAD DEL FORMULARIO
      lineaInvestigacion: new FormControl(''),
      grupoInvestigacion: new FormControl(''),
      perteneceGrupoInvestigacion: new FormControl('', Validators.required),
      tipoMaterial: new FormControl('', Validators.required),
      tipoMaterialSubCategoria: new FormControl('', Validators.required),
      tipoImpacto: new FormControl('', Validators.required),
      autores: this.formBuilder.array([
        this.formBuilder.control(
          this.authService.user.personaNombre +
            ' ' +
            this.authService.user.personaApellido,
          Validators.required
        ),
      ]),
      revista: new FormControl('', Validators.required),
      issn: new FormControl('', Validators.required),
      categoria: new FormControl('', Validators.required),
      //PARA ENVIAR EL OBJETO EN BACKEND
      codigo: new FormControl(),
      solicitudPuntaje: new FormControl(''),
      docenteGrupo: new FormControl(''),
      materialConfiguracion: new FormControl(''),
      tipoEnvioMaterial: new FormControl(''),
      titulo: new FormControl('', Validators.required),
      traduccionTitulo: new FormControl(''),
      cantidadAutores: new FormControl('', Validators.required),
      cambioCategoriaEscalafon: new FormControl('', Validators.required),
      estado: new FormControl(),
    });
  }

  generarMaterialAcademico(): void {
    this.formularioMaterialAcademico.get('tipoEnvioMaterial')!.setValue(1);

    let materialAcademico: MaterialAcademico = new MaterialAcademico();
    materialAcademico.codigo =
      this.formularioMaterialAcademico.get('codigo')!.value;
    let solicitudPuntaje: SolicitudPuntaje = new SolicitudPuntaje();
    solicitudPuntaje.codigo =
      this.formularioMaterialAcademico.get('solicitudPuntaje')!.value;
    materialAcademico.solicitud = solicitudPuntaje;
    let docenteGrupo: DocenteGrupo = new DocenteGrupo();
    docenteGrupo.codigo =
      this.formularioMaterialAcademico.get('docenteGrupo')!.value;
    materialAcademico.docenteGrupo = docenteGrupo;
    let materialConfiguracion: MaterialConfiguracion =
      new MaterialConfiguracion();
    materialConfiguracion.codigo = this.formularioMaterialAcademico.get(
      'materialConfiguracion'
    )!.value;
    materialAcademico.materialConfiguracion = materialConfiguracion;
    let tipoEnvioMaterial: TipoEnvioMaterial = new TipoEnvioMaterial();
    tipoEnvioMaterial.codigo =
      this.formularioMaterialAcademico.get('tipoEnvioMaterial')!.value;
    materialAcademico.tipoEnvioMaterial = tipoEnvioMaterial;
    materialAcademico.titulo =
      this.formularioMaterialAcademico.get('titulo')!.value;
    materialAcademico.traduccionTitulo =
      this.formularioMaterialAcademico.get('traduccionTitulo')!.value;
    materialAcademico.cantidadAutores = this.autores.length;
    materialAcademico.cambioCategoriaEscalafon =
      this.formularioMaterialAcademico.get('cambioCategoriaEscalafon')!.value;
    materialAcademico.estado =
      this.formularioSolicitudPuntaje.get('estado')!.value;
    console.log(materialAcademico);

    if (!this.editar) {
      this.registrarMaterialAcademico(materialAcademico);
    } else {
      this.actualizarMaterialAcademico(materialAcademico);
    }
  }

  registrarMaterialAcademico(materialAcademico: MaterialAcademico) {
    this.materialAcademicoService
      .insertarMaterialAcademico(materialAcademico)
      .subscribe(
        (data) => {
          console.log('|||||||:', data);
          if (data > 0) {
            this.toast.fire({
              icon: 'success',
              title: 'Registro Material Académico.',
            });
            this.crearFormularioMaterialAcademico();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarMaterialAcademico(materialAcademico: MaterialAcademico) {
    this.materialAcademicoService
      .actualizarMaterialAcademico(materialAcademico)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: '¡Operación exitosa!',
              showConfirmButton: false,
            });
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  private crearFormularioRevista(): void {
    this.formularioRevista = this.formBuilder.group({
      codigo: new FormControl(),
      estado: new FormControl(),
    });
  }

  private crearFormularioLibro(): void {
    this.formularioLibro = this.formBuilder.group({
      codigo: new FormControl(),
      estado: new FormControl(),
    });
  }

  get autores(): FormArray {
    return this.formularioMaterialAcademico.get('autores') as FormArray;
  }

  getAutor(index: number): FormControl {
    return this.autores.at(index) as FormControl;
  }

  agregarAutor(): void {
    this.autores.push(this.formBuilder.control('', Validators.required));
  }

  eliminarAutor(index: number): void {
    if (index > 0) {
      this.autores.removeAt(index);
    }
  }

  guardarAutores(): void {
    console.log(this.formularioMaterialAcademico.value.autores); // Array con los nombres de los autores
  }

  generarSolicitudPuntaje(): void {
    let solicitudPuntaje: SolicitudPuntaje = new SolicitudPuntaje();
    solicitudPuntaje.codigo =
      this.formularioSolicitudPuntaje.get('codigo')!.value;
    let persona: Persona = new Persona();
    persona.codigo = this.authService.user.personaCodigo;
    solicitudPuntaje.persona = persona;
    let acta: Acta = new Acta();
    acta.codigo = this.codigoActa;
    solicitudPuntaje.acta = acta;
    solicitudPuntaje.estado =
      this.formularioSolicitudPuntaje.get('estado')!.value;
    if (!this.editar) {
      this.registrarSolicitudPuntaje(solicitudPuntaje);
    } else {
      this.actualizarSolicitudPuntaje(solicitudPuntaje);
    }
  }

  registrarSolicitudPuntaje(solicitudPuntaje: SolicitudPuntaje) {
    this.solicitudPuntajeService
      .insertarSolicitudPuntaje(solicitudPuntaje)
      .subscribe(
        (data) => {
          console.log('|||||||:', data);
          if (data > 0) {
            this.toast.fire({
              icon: 'success',
              title: 'Registro Grupo Investigación.',
            });
            this.formularioMaterialAcademico
              .get('solicitudPuntaje')!
              .setValue(data);
            this.generarDocenteGrupo();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarSolicitudPuntaje(solicitudPuntaje: SolicitudPuntaje) {
    this.solicitudPuntajeService
      .actualizarSolicitudPuntaje(solicitudPuntaje)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: '¡Operación exitosa!',
              showConfirmButton: false,
            });
            this.dialogRef.close();
            this.cancelar();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  notificacionCorreo(): void {
    this.dialogRef = this.dialog.open(ModalNotificacionCorreo, {
      width: '50%',
      disableClose: true,
    });
  }

  obtenerLineasInvestigacion() {
    this.grupoInvestigacionService
      .obtenerListadoLineasInvestigacion()
      .subscribe((data) => {
        this.listadoLineaInvestigacion = data;
      });
  }

  obtenerListadoRevistaMinciencias() {
    this.materialAcademicoService
      .obtenerListadoRevistaMinciencias()
      .subscribe((data) => {
        this.listadoRevistaMinciencias = data;
      });
  }

  obtenerGrupoInvestigacion(codigo: number) {
    this.grupoInvestigacionService
      .obtenerListadoGrupoInvestigacionPorLinea(codigo)
      .subscribe((data) => {
        this.listadoGrupoInvestigacion = data;
      });
  }

  obtenerListadoTipoMaterial() {
    this.materialAcademicoService
      .obtenerListadoTipoMaterial()
      .subscribe((data) => {
        this.listadoTipoMaterial = data;
      });
  }

  obtenerTipoMaterialSubCategoriaPorTipoMaterial(codigo: number) {
    this.formularioMaterialAcademico.get('tipoMaterial')!.setValue(codigo);
    this.materialAcademicoService
      .obtenerTipoMaterialSubCategoriaPorTipoMaterial(codigo)
      .subscribe((data) => {
        this.listadoTipoMaterialSubCategoria = data;
      });
  }

  obtenerTipoImpactoPorTipoMaterial(codigo: number) {
    this.materialAcademicoService
      .obtenerTipoImpactoPorTipoMaterial(codigo)
      .subscribe((data) => {
        this.listadoTipoImpacto = data;
      });
  }

  obtenerMaterialConfiguracion() {
    console.log(
      +this.formularioMaterialAcademico.get('tipoMaterial')!.value,
      +this.formularioMaterialAcademico.get('tipoMaterialSubCategoria')!.value,
      +this.formularioMaterialAcademico.get('tipoImpacto')!.value
    );

    this.materialConfiguracionService
      .obtenerMaterialConfiguracionlPorParametros(
        +this.formularioMaterialAcademico.get('tipoMaterial')!.value,
        +this.formularioMaterialAcademico.get('tipoMaterialSubCategoria')!
          .value,
        +this.formularioMaterialAcademico.get('tipoImpacto')!.value
      )
      .subscribe((data) => {
        this.formularioMaterialAcademico
          .get('materialConfiguracion')!
          .setValue(data.codigo);
      });
  }

  obtenerTipoAnexoPorTipoMaterial(codigo: number) {
    this.materialAcademicoService
      .obtenerTipoAnexoPorTipoMaterial(codigo)
      .subscribe((data) => {
        this.listadoTipoAnexo = data;
      });
  }

  change(file: any): void {
    this.nombreArchivo = file.target.files[0].name.replace(/\s/g, '');
    //this.formDatosExpedicion.get('archivo')!.setValue(this.nombreArchivo);
    if (file.target.files[0].size > 8100000) {
      Swal.fire({
        title: 'El archivo supera el limite de tamaño que es de 8mb',
        confirmButtonText: 'Entiendo',
        confirmButtonColor: '#8f141b',
        showConfirmButton: true,
      });
    } else {
      this.file = file.target.files[0];
      Swal.fire({
        icon: 'success',
        title: 'Documento cargado de manera exitosa.',
        showConfirmButton: true,
        confirmButtonText: 'Listo',
        confirmButtonColor: '#8f141b',
      });
    }
  }

  cargarValoresRevista(element: RevistaMinciencias) {
    this.formularioMaterialAcademico.get('issn')!.setValue(element.issn);
    this.formularioMaterialAcademico
      .get('categoria')!
      .setValue(element.categoriaMincienciasNombre);
  }

  capturarCodigoTipoMaterial(codigo: number) {
    this.codigoTipoMaterial = codigo;
  }

  cancelar() {
    this.formularioSolicitudPuntaje.reset();
    this.crearFormularioSolicitudPuntaje();
    this.editar = false;
  }

  mensajeSuccses() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso realizado',
      text: '¡Operación exitosa!',
      showConfirmButton: false,
      timer: 2500,
    });
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar el proceso.',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
    });
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.authService.logout();
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }
}

//// MODAL

@Component({
  selector: 'modal-notificacion-correo',
  templateUrl: 'modal-notificacion-correo.html',
  styleUrls: ['./solicitud.component.css'],
})
export class ModalNotificacionCorreo {
  constructor(
    public dialogRef: MatDialogRef<ModalNotificacionCorreo>,
    public dialog: MatDialog,
    public auth: AuthService
  ) {}
}
