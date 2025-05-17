import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';
import { Correo } from 'src/app/models/correo';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent implements OnInit {
  correo!: Correo;
  codigo!: String;
  codioCorrecto!: String;
  fechaActual = new Date();
  cargando: boolean = false;
  @Output() rolEvent = new EventEmitter<any>();
  formToken!: FormGroup;
  otpLength = 5;

  constructor(
    public auth: AuthService,
    private router: Router,
    public tokenService: TokenService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.crearFormularioToken();
    this.tokenService
      .gettokenUsco()
      .subscribe((correo) => (this.correo = correo));
  }

  // Método para crear el formulario de token
  private crearFormularioToken(): void {
    this.formToken = this.formBuilder.group({
      otp: this.formBuilder.array(
        Array(this.otpLength)
          .fill('')
          .map(() => new FormControl(''))
      ),
    });
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text')?.trim() ?? '';
    const characters = pasteData.split('');

    if (characters.length !== 5) return; // Asegúrate que sean 5 dígitos

    characters.forEach((char, index) => {
      const input = document.getElementById(`otp-${index}`) as HTMLInputElement;
      if (input) {
        input.value = char.toUpperCase();
        this.formToken.get('otp')!.value[index] = input.value;
      }
    });

    // Enfocar el último input
    const lastInput = document.getElementById('otp-4') as HTMLInputElement;
    lastInput?.focus();
  }

  onInput(event: any, i: number) {
    const input = event.target;
    const value = input.value;

    // Solo letras o números, y un solo carácter
    if (/^[a-zA-Z0-9]{1}$/.test(value)) {
      input.value = value.toUpperCase();
      this.formToken.get('otp')!.value[i] = input.value;

      // Mover al siguiente input si existe
      const nextInput = document.getElementById(`otp-${i + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      input.value = '';
    }
  }

  // Método para validar el token ingresado
  validarToken() {
    this.cargando = true;
    console.log(this.formToken.get('otp')!.value);
    const token = this.formToken.get('otp')!.value.join('');
    if (token) {
      this.tokenService.validartokenUsco(token).subscribe(
        (response) => {
          this.auth.guardarCodigoverificacion('true');
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión ',
            text: 'Código de verificación correcto.',
            confirmButtonText: 'Listo',
            confirmButtonColor: '#8f141b',
          });
          this.router.navigate(['/inicio']);
        },
        (err) => this.fError(err)
      );
    }
  }

  // Método para manejar errores durante la validación del token
  fError(er: any): void {
    this.cargando = false;
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.router.navigate(['login']);
      this.cargando = false;
    } else {
      this.cargando = false;
    }
  }
}
