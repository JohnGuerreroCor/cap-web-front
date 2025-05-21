import { AnexoMaterialService } from './../../services/anexo-material.service';
import { AutorMaterialService } from './../../services/autor-material.service';
import { LibroCapituloService } from './../../services/libro-capitulo.service';
import { ArticuloRevistaService } from './../../services/articulo-revista.service';
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
import { ArticuloRevista } from 'src/app/models/articulo-revista';
import { LibroCapitulo } from 'src/app/models/libro-capitulo';
import { AutorMaterial } from 'src/app/models/autor-material';
import { AnexoMaterial } from 'src/app/models/anexo-material';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.css'],
})
export class RevisionComponent implements OnInit {
  listadoLineaInvestigacion: LineaInvestigacion[] = [];
  listadoGrupoInvestigacion: GrupoInvestigacion[] = [];
  listadoTipoMaterial: TipoMaterial[] = [];
  listadoTipoMaterialSubCategoria: TipoMaterialSubCategoria[] = [];
  listadoTipoImpacto: TipoImpacto[] = [];
  listadoTipoAnexo: TipoAnexo[] = [];
  listadoRevistaMinciencias: RevistaMinciencias[] = [];
  acta!: Acta;
  solicitudPuntaje!: SolicitudPuntaje;
  anexoMaterial!: AnexoMaterial[];
  articuloRevista!: ArticuloRevista;
  autorMaterial!: AutorMaterial[];
  libroCapitulo!: LibroCapitulo;
  dialogRef!: MatDialogRef<any>;
  formularioSolicitudPuntaje!: FormGroup;
  formularioMaterialAcademico!: FormGroup;
  formularioRevista!: FormGroup;
  formularioLibro!: FormGroup;
  codigoTipoMaterial!: number;
  nombreArchivo = 'Archivo';
  file!: FileList;
  codigoActa!: number;
  codigoSolicitud!: number;
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
    public articuloRevistaService: ArticuloRevistaService,
    public libroCapituloService: LibroCapituloService,
    public actaService: ActaService,
    public autorMaterialService: AutorMaterialService,
    public anexoMaterialService: AnexoMaterialService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.codigoSolicitud = params['id'];
      this.solicitudPuntajeService
        .obtenerSolicitudPuntaje(this.codigoSolicitud)
        .subscribe((data) => {
          this.solicitudPuntaje = data;
          console.log(data);

          this.obtenerAnexoMaterialPorMaterialAcademico(
            this.solicitudPuntaje.materialAcademico.codigo
          );
          this.obtenerArticuloRevistaPorMaterialAcademico(
            this.solicitudPuntaje.materialAcademico.codigo
          );
          this.obtenerAutorMaterialPorMaterialAcademico(
            this.solicitudPuntaje.materialAcademico.codigo
          );
          this.obtenerLibroCapituloPorMaterialAcademico(
            this.solicitudPuntaje.materialAcademico.codigo
          );
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

  obtenerAnexoMaterialPorMaterialAcademico(codigo: number) {
    this.anexoMaterialService
      .obtenerAnexoMaterialPorMaterialAcademico(codigo)
      .subscribe((data) => {
        this.anexoMaterial = data;
      });
  }

  obtenerArticuloRevistaPorMaterialAcademico(codigo: number) {
    this.articuloRevistaService
      .obtenerArticuloRevistaPorMaterialAcademico(codigo)
      .subscribe((data) => {
        this.articuloRevista = data;
      });
  }

  obtenerAutorMaterialPorMaterialAcademico(codigo: number) {
    this.autorMaterialService
      .obtenerAutorMaterialPorMaterialAcademico(codigo)
      .subscribe((data) => {
        this.autorMaterial = data;
      });
  }

  obtenerLibroCapituloPorMaterialAcademico(codigo: number) {
    this.libroCapituloService
      .obtenerLibroCapituloPorMaterialAcademico(codigo)
      .subscribe((data) => {
        this.libroCapitulo = data;
      });
  }

  verAnexo(codigo: number) {
    this.anexoMaterialService.obtenerAnexo(codigo).subscribe((data) => {
      var blob = new Blob([data], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    });
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
      tipoMaterialSubCategoria: new FormControl(''),
      tipoImpacto: new FormControl(''),
      revista: new FormControl(''),
      issn: new FormControl(''),
      categoria: new FormControl(''),
      //PARA ENVIAR EL OBJETO AUTORES MATERIAL EN BACKEND
      autores: this.formBuilder.array([
        this.formBuilder.control(
          this.authService.user.personaNombre +
            ' ' +
            this.authService.user.personaApellido,
          Validators.required
        ),
      ]),
      //PARA ENVIAR EL OBJETO MATERIAL ACADÉMICO EN BACKEND
      materialAcademicoCodigo: new FormControl(''),
      solicitudPuntaje: new FormControl(''),
      docenteGrupo: new FormControl(''),
      materialConfiguracion: new FormControl(''),
      tipoEnvioMaterial: new FormControl(''),
      titulo: new FormControl('', Validators.required),
      traduccionTitulo: new FormControl(''),
      cantidadAutores: new FormControl(''),
      cambioCategoriaEscalafon: new FormControl('', Validators.required),
      nombreProyectoInvestigacion: new FormControl(''),
      estado: new FormControl(),
      //PARA ENVIAR EL OBJETO ARTÍCULO REVISTA EN BACKEND
      articuloRevistaNombre: new FormControl(''),
      articuloRevistaUrl: new FormControl(''),
      articuloRevistaMesesRequeridosPublicacion: new FormControl(''),
      articuloRevistaFechaSumision: new FormControl(''),
      articuloRevistaFechaAprobacion: new FormControl(''),
      articuloRevistaRecursosUniversidad: new FormControl(''),
      //PARA ENVIAR EL OBJETO LIBRO CAPÍTULO EN BACKEND
      libroCapituloIsbn: new FormControl(''),
      libroCapituloEditorial: new FormControl(''),
      libroCapituloUrl: new FormControl(''),
      libroCapituloEjemplares: new FormControl(''),
      //PARA ENVIAR EL OBJETO ANEXO MATERIAL EN BACKEND
      anexoMaterial: this.formBuilder.array([]),
    });
  }

  get anexos(): FormArray {
    return this.formularioMaterialAcademico.get('anexos') as FormArray;
  }

  crearFormularioAnexos(tipoAnexos: TipoAnexo[]) {
    const anexoFGs = tipoAnexos.map((tipo) =>
      this.formBuilder.group({
        tipoAnexo: [tipo],
        archivo: [null, Validators.required],
        nombreArchivo: [''], // Nuevo campo para mostrar el nombre del archivo
      })
    );
    const formArray = this.formBuilder.array(anexoFGs);
    this.formularioMaterialAcademico.setControl('anexos', formArray);
  }

  guardarAnexos(): void {
    const materialAcademicoCodigo = this.formularioMaterialAcademico.get(
      'materialAcademicoCodigo'
    )!.value;

    this.anexos.controls.forEach((control) => {
      const tipoAnexo: TipoAnexo = control.value.tipoAnexo;
      const archivo: File = control.value.archivo;
      const anexoMaterial: AnexoMaterial = {
        codigo: 0,
        materialAcademicoCodigo: materialAcademicoCodigo,
        tipoAnexo: { codigo: tipoAnexo.codigo, nombre: '', estado: 1 },
        nombre: archivo.name,
        ruta: '', // el backend lo resuelve
        estado: 1,
      };

      this.anexoMaterialService
        .insertarAnexoMaterial(archivo, anexoMaterial)
        .subscribe({
          next: () => console.log('Anexo guardado exitosamente'),
          error: (err) => console.error('Error al guardar anexo:', err),
        });
    });
  }

  generarMaterialAcademico(): void {
    this.formularioMaterialAcademico.get('tipoEnvioMaterial')!.setValue(1);

    let materialAcademico: MaterialAcademico = new MaterialAcademico();
    let solicitudPuntaje: SolicitudPuntaje = new SolicitudPuntaje();
    solicitudPuntaje.codigo = materialAcademico.solicitudPuntajeCodigo =
      this.formularioMaterialAcademico.get('solicitudPuntaje')!.value;
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
    materialAcademico.nombreProyectoInvestigacion =
      this.formularioMaterialAcademico.get(
        'nombreProyectoInvestigacion'
      )!.value;
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
            this.formularioMaterialAcademico
              .get('materialAcademicoCodigo')!
              .setValue(data);
            this.guardarAutores();
            this.guardarAnexos();
            if (
              this.formularioMaterialAcademico.get('tipoMaterial')!.value ===
                1 ||
              this.formularioMaterialAcademico.get('tipoMaterial')!.value ===
                2 ||
              this.formularioMaterialAcademico.get('tipoMaterial')!.value ===
                3 ||
              this.formularioMaterialAcademico.get('tipoMaterial')!.value === 4
            ) {
              this.generarArticuloRevista();
            }
            if (
              this.formularioMaterialAcademico.get('tipoMaterial')!.value ===
                5 ||
              this.formularioMaterialAcademico.get('tipoMaterial')!.value ===
                10 ||
              this.formularioMaterialAcademico.get('tipoMaterial')!.value === 11
            ) {
              this.generarLibroCapitulo();
            }
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

  generarArticuloRevista(): void {
    let articuloRevista: ArticuloRevista = new ArticuloRevista();
    articuloRevista.materialAcademicoCodigo =
      this.formularioMaterialAcademico.get('materialAcademicoCodigo')!.value;
    let revistaMinciencias: RevistaMinciencias = new RevistaMinciencias();
    revistaMinciencias.codigo =
      this.formularioMaterialAcademico.get('revista')!.value;
    articuloRevista.revistaMinciencias = revistaMinciencias;
    articuloRevista.nombre =
      this.formularioMaterialAcademico.get('titulo')!.value;
    articuloRevista.url =
      this.formularioMaterialAcademico.get('articuloRevistaUrl')!.value;
    articuloRevista.mesesRequeridosPublicacion =
      this.formularioMaterialAcademico.get(
        'articuloRevistaMesesRequeridosPublicacion'
      )!.value;
    articuloRevista.fechaSumision = this.formularioMaterialAcademico.get(
      'articuloRevistaFechaSumision'
    )!.value;
    articuloRevista.fechaAprobacion = this.formularioMaterialAcademico.get(
      'articuloRevistaFechaAprobacion'
    )!.value;
    articuloRevista.recursosUniversidad = this.formularioMaterialAcademico.get(
      'articuloRevistaRecursosUniversidad'
    )!.value;
    console.log(articuloRevista);

    if (!this.editar) {
      this.registrarArticuloRevista(articuloRevista);
    } else {
      this.mensajeError();
    }
  }

  registrarArticuloRevista(articuloRevista: ArticuloRevista) {
    this.articuloRevistaService
      .insertarArticuloRevista(articuloRevista)
      .subscribe(
        (data) => {
          console.log('|||||||:', data);
          if (data > 0) {
            this.toast.fire({
              icon: 'success',
              title: 'Registro Artículo Revista.',
            });
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarArticuloRevista(articuloRevista: ArticuloRevista) {}

  generarLibroCapitulo(): void {
    let libroCapitulo: LibroCapitulo = new LibroCapitulo();
    libroCapitulo.materialAcademicoCodigo =
      this.formularioMaterialAcademico.get('materialAcademicoCodigo')!.value;
    libroCapitulo.isbn =
      this.formularioMaterialAcademico.get('libroCapituloIsbn')!.value;
    libroCapitulo.editorial = this.formularioMaterialAcademico.get(
      'libroCapituloEditorial'
    )!.value;
    libroCapitulo.url =
      this.formularioMaterialAcademico.get('libroCapituloUrl')!.value;
    libroCapitulo.ejemplares = this.formularioMaterialAcademico.get(
      'libroCapituloEjemplares'
    )!.value;
    if (!this.editar) {
      this.registrarLibroCapitulo(libroCapitulo);
    } else {
      this.mensajeError();
    }
  }

  registrarLibroCapitulo(libroCapitulo: LibroCapitulo) {
    this.libroCapituloService.insertarLibroCapitulo(libroCapitulo).subscribe(
      (data) => {
        console.log('|||||||:', data);
        if (data > 0) {
          this.toast.fire({
            icon: 'success',
            title: 'Registro Libro Capítulo.',
          });
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarLibroCapitulo(libroCapitulo: LibroCapitulo) {}

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

  guardarAutores(): void {
    console.log('Entra a Autores');
    console.log(this.formularioMaterialAcademico.value.autores);

    const nombresAutores: string[] =
      this.formularioMaterialAcademico.value.autores;
    const materialAcademicoCodigo = this.formularioMaterialAcademico.get(
      'materialAcademicoCodigo'
    )!.value;

    nombresAutores.forEach((nombre) => {
      const autor: AutorMaterial = {
        codigo: 0, // o déjalo sin asignar si tu backend lo ignora
        materialAcademicoCodigo: materialAcademicoCodigo,
        nombre: nombre,
        estado: 1,
      };

      this.autorMaterialService.insertarAutorMaterial(autor).subscribe({
        next: (id) =>
          this.toast.fire({
            icon: 'success',
            title: 'Registro Autor Material.',
          }),
        error: (err) => this.mensajeError(),
      });
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
        console.log('MATERIAL CONFIG::', data.codigo);

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
        this.crearFormularioAnexos(data);
      });
  }

  onFileChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.anexos.at(index).patchValue({
        archivo: file,
        nombreArchivo: file.name, // Guardamos el nombre del archivo
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
