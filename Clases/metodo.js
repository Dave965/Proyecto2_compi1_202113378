class metodo{
	constructor(identificador, argumentos, entorno, instrucciones){
		this.identificador = identificador.toLowerCase();
		this.tipo = "void";
		this.entorno = entorno;
		this.argumentos = argumentos;
		this.instrucciones = instrucciones;
	} 
}