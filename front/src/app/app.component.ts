import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Nível do Rio Acre Hoje';
  data: any;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getData().subscribe((data) => {
      this.data = data;
    });
  }

  formatarHorario(horario: string): string {
    if (!horario) return '';
    const data = new Date(horario);
    const dia = this.formatarZeroEsquerda(data.getDate());
    const mes = this.formatarZeroEsquerda(data.getMonth() + 1);
    const ano = data.getFullYear();
    const hora = this.formatarZeroEsquerda(data.getHours());
    const minutos = this.formatarZeroEsquerda(data.getMinutes());
    return `${dia}/${mes}/${ano} às ${hora}:${minutos}`;
  }

  formatarZeroEsquerda(valor: number): string {
    return valor < 10 ? '0' + valor : valor.toString();
  }

}
