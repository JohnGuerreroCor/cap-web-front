import { SolicitudPuntajeService } from './../../services/solicitud-puntaje.service';
import { ActaService } from './../../services/acta.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Acta } from 'src/app/models/acta';
import { AuthService } from 'src/app/services/auth.service';
import { SolicitudPuntaje } from 'src/app/models/solicitud-puntaje';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  dataSource = new MatTableDataSource<SolicitudPuntaje>([]);
  displayedColumns: string[] = [
    'index',
    'material',
    'fecha',
    'estado',
    'opciones',
  ];
  listadoActas: Acta[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  constructor(
    public auth: AuthService,
    public actaService: ActaService,
    public solicitudPuntajeService: SolicitudPuntajeService
  ) {}

  ngOnInit(): void {
    this.obtenerAutorizacion();
    this.obtenerSolicitudes();
  }

  obtenerSolicitudes() {
    this.solicitudPuntajeService
      .obtenerListadoSolicitudPuntajePorPersona()
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource<SolicitudPuntaje>(data);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      });
  }

  obtenerAutorizacion() {
    this.actaService.obtenerListadoActas().subscribe((data) => {
      this.listadoActas = data;
    });
  }
}
