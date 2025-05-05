import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'index',
    'titulo',
    'normativa',
    'version',
    'fecha',
    'anexo',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
}
