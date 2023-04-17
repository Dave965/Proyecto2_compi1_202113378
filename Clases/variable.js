class variable{
	constructor(identificador, tipo, entorno, fila, columna){
		this.identificador = identificador.toLowerCase();
		this.tipo = tipo.toLowerCase();
		this.entorno = entorno;
		switch(tipo){
			case "int":
				this.dato = 0;
				break;
			case "double":
				this.dato = 0.0;
				break;
			case "boolean":
				this.dato = true;
				break;
			case "char":
				this.dato = '0';
				break;
			case "string":
				this.dato = "";
				break;
		}
		this.fila = fila;
		this.columna = columna;
	} 
}