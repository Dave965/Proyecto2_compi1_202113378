class funcion{
	constructor(identificador, argumentos, tipo, entorno, instrucciones){
		this.identificador = identificador.toLowerCase();
		this.tipo = tipo.toLowerCase();
		this.entorno = entorno;
		this.argumentos = argumentos;
		this.instrucciones = instrucciones;
	} 
}