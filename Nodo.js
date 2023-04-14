class Nodo{
	constructor(token, fila,columna, valor = ""){
		this.token = token;
		this.dato = valor;
		this.hijos = [];
		this.clave = Math.floor((Math.random() * 100000000000000));
		this.entorno = [];
		this.fila
	}

	graficar(){
		var codigo_dot = "digraph{\nlabel=\" AST \";\n";
		codigo_dot += this.imprimir();
		codigo_dot += "}";
		return codigo_dot
	}

	imprimir(){
		let s="";
		for(const hijo of this.hijos){
			s+="N_"+this.clave+"->"+"N_"+hijo.clave+";\n";
			s+=hijo.imprimir();
		} 
		s= "N_"+this.clave+"[label=\""+this.token+"\"];\n" +s;
		return s;
	}

	graficar2(){
		var codigo_dot = "digraph {\nlabel=\" Arbol de entornos \";\n";
		codigo_dot += this.imprimir2();
		codigo_dot += "}";
		return codigo_dot
	}

	imprimir2(){
		let s="";
		for(const hijo of this.hijos){
			s+="N_"+this.clave+"->"+"N_"+hijo.clave+";\n";
			s+=hijo.imprimir2();
		} 
		s= "N_"+this.clave+"[label=\""+this.entorno+"\"];\n" +s;
		return s;
	}

	ejecutar(tabla_simbolos){
		let resultado;
		let salida = document.getElementById("consola");
		if(this.token == "Parametros"){
			resultado = [];
			for(const hijo of this.hijos){
				if(hijo.token == "Parametros"){
					resultado = hijo.ejecutar(tabla_simbolos);
				}else if(hijo.token == "ID"){
					resultado.push({ "identificador": hijo.dato, "entorno": hijo.entorno});
				}
			}
			return resultado;
		}else if(this.token== "Expression"){
			resultado = hijo.ejecutar(tabla_simbolos);
			return resultado;
		}else if(this.token == "aritmetico"){
			if(this.hijos[0].token == "MENOS"){
				let r1 = this.hijos[1].ejecutar(tabla_simbolos);
				if(r1.tipo == "int" || r1.tipo == "double"){
					return {tipo:r1.tipo,valor:-r1.valor};
				}else{
					salida.value += "Error semantico de ejecucion";
					throw true;
				}
			}else if(this.hijos[1].token == "POTENCIA"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				if(r1.tipo == "int" && r2.tipo == "int"){
					return {tipo:"int",valor: r1.valor ** r2.valor};
				}else if(r1.tipo == "double" && r2.tipo == "int" || r1.tipo == "int" && r2.tipo == "double" || r1.tipo == "double" && r2.tipo == "double"){
					return {tipo:"double",valor: r1.valor ** r2.valor};
				}else{
					salida.value += "Error semantico de ejecucion";
					throw true;
				}
			}else if(this.hijos[1].token == ""){

			}else if(this.hijos[1].token == ""){

			}else if(this.hijos[1].token == ""){

			}else if(this.hijos[1].token == ""){

			}else if(this.hijos[1].token == ""){

			}
		}
	}

}