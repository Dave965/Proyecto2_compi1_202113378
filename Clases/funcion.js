class funcion{
	constructor(identificador, argumentos, tipo, entorno, instrucciones, fila, columna){
		this.identificador = identificador.toLowerCase();
		this.tipo = tipo.toLowerCase();
		this.entorno = entorno;
		this.argumentos = argumentos;
		this.instrucciones = instrucciones;
		this.fila = fila;
		this.columna = columna;
	} 
}