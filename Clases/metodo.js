class metodo{
	constructor(identificador, argumentos, entorno, instrucciones, fila, columna){
		this.identificador = identificador.toLowerCase();
		this.tipo = "void";
		this.entorno = entorno;
		this.argumentos = argumentos;
		this.instrucciones = instrucciones;
		this.fila = fila;
		this.columna = columna;
	} 
}