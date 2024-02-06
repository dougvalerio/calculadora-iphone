import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrl: './calculadora.component.scss'
})
export class CalculadoraComponent implements OnInit {

  operacaoAnterior:any = '';
  operacaoAtual:any = '';
  primeiraOperacao = true;
  horaAtual: string | undefined;

  ngOnInit() {
    this.atualizarHora();
    setInterval(() => this.atualizarHora(), 1000);
  }

  atualizarHora() {
    const dataAtual = new Date();
    const horas = this.adicionarZero(dataAtual.getHours());
    const minutos = this.adicionarZero(dataAtual.getMinutes());
    this.horaAtual = `${horas}:${minutos}`;
  }

  adicionarZero(valor: number): string {
    return valor < 10 ? `0${valor}` : valor.toString();
  }

  adicionarAoVisor(value:any) {
    if(this.primeiraOperacao) {
      if(+value >= 0 || value === '.' ) {
        this.adicionarDigito(value)
      } else {
        this.processaOperacao(value)
      }
    }
    else {
      this.operacaoAnterior = "";
      this.operacaoAtual = "";
      this.primeiraOperacao = true;
      if(+value >= 0 || value === '.' ) {
        this.adicionarDigito(value)
      } else {
        this.processaOperacao(value)
      }
    }
  }

  adicionarDigito(digito:any) {
    if(digito === "." && this.operacaoAtual.includes(".")) {
      return
    }
    this.operacaoAtual += digito;
    this.atualizarVisor(null,null,null,null)
  }

  processaOperacao(operacao:any) {
    if(this.operacaoAtual === "" && operacao !== "AC") {

      if(this.operacaoAnterior !== "") {
        this.alterarOperacao(operacao)
      }
      return
    }

    let valorOperacao:any;
    let anterior = +this.operacaoAnterior.split(" ")[0];
    let atual = +this.operacaoAtual;

    switch(operacao) {
      case"AC":
        this.processarOperacaoAC()
        break
      case"+":
        valorOperacao = anterior + atual;
        this.atualizarVisor(valorOperacao, operacao, atual, anterior)
        break
      case"-":
        valorOperacao = anterior - atual;
        this.atualizarVisor(valorOperacao, operacao, atual, anterior)
        break
      case"*":
        valorOperacao = anterior * atual;
        this.atualizarVisor(valorOperacao, operacao, atual, anterior)
        break
      case"/":
        valorOperacao = anterior / atual;
        this.atualizarVisor(valorOperacao, operacao, atual, anterior)
        break
      case '%':
        valorOperacao = anterior - (anterior * (atual / 100));
        this.atualizarVisor(valorOperacao, operacao, atual, anterior);
        break;
      case '+/-':
        this.operacaoAtual = (atual * -1).toString();
        this.atualizarVisor(null, null, this.operacaoAtual, null);
        break;
      case"=":
        this.processarOperacaoIgual()
        break
    }
  }

  alterarOperacao(operacao:any) {
    const operacoesMat = [ "+", "-", "/", "*", "%", "+/-" ]
    if(!operacao.includes(operacao)) {
      return
    }
    this.operacaoAnterior = this.operacaoAnterior.trim().slice(0, -1) + operacao;
  }

  atualizarVisor(
    valorOperacao = null,
    operacao = null,
    atual: any,
    anterior: any
  ) {
    if(valorOperacao !== null) {
      if(anterior === 0) {
        valorOperacao = atual;
      }
      this.operacaoAnterior = `${atual} ${operacao}`
      if(anterior > 0) {
        this.operacaoAnterior = `${anterior} ${operacao} ${atual} = `
        this.operacaoAtual = valorOperacao;
      } else {
        this.operacaoAtual = "";
      }
    }
  }

  processarOperacaoAC() {
    this.operacaoAtual = "";
    this.operacaoAnterior = "" ;
  }

  processarOperacaoIgual() {
    let operacao = this.operacaoAnterior.split(" ")[1];
    this.primeiraOperacao = false;
    this.processaOperacao(operacao);
  }
}
