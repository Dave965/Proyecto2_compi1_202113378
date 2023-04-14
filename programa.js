class programa{
	constructor(ast){
		this.ast = ast;
		this.tabla_simbolos = [];
		this.tokens_entorno = ["Sentencia if", "Caso", "Default",
			"Sentencia while","Sentencia do while", "Sentencia for", 
			"Declaracion metodo", "Declaracion funcion"];

		this.tokens_hijos = ["instrucciones","Declaracion variable","Asignacion variable",
			"Actualizacion","Parametros"];
	}

	areEqual(array1, array2) {
	  if (array1.length === array2.length) {
	    return array1.every((element, index) => {
	      if (element === array2[index]) {
	        return true;
	      }

	      return false;
	    });
	  }

	  return false;
	}
	
	calcular_tabla(actual){
		if(actual.token == "Declaracion variable"){
			let identificador, tipo;
			identificador = actual.hijos[1].dato;
			tipo = actual.hijos[0].hijos[0].dato;
			for(const simbolo of this.tabla_simbolos){
				if(this.areEqual(simbolo.entorno,actual.entorno) && simbolo.identificador == identificador){
					document.getElementById("consola").value += "la variable "+identificador+" ya fue declarada en el mismo entorno\n";
					return "error";
				}
			}
			this.tabla_simbolos.push(new variable(identificador, tipo, actual.entorno));
		}else if (actual.token == "Parametros"){
			let identificador, tipo;
			for(const hijo of actual.hijos){
				if(hijo.token == "Tipo"){
					tipo = hijo.hijos[0].dato;
				}else if(hijo.token == "ID"){
					identificador = hijo.dato;
				}
			}

			for(const simbolo of this.tabla_simbolos){
				if(this.areEqual(simbolo.entorno,actual.entorno) && simbolo.identificador == identificador){
					document.getElementById("consola").value += "la variable "+identificador+" ya fue declarada en el mismo entorno\n";
					return "error";
				}
			}
			this.tabla_simbolos.push(new variable(identificador, tipo, actual.entorno));
		}else if (actual.token == "Declaracion vector"){
			let identificador, tipo;
			for(const hijo of actual.hijos){
				if(hijo.token == "Tipo"){
					tipo = hijo.hijos[0].dato;
				}else if(hijo.token == "ID"){
					identificador = hijo.dato;
				}
			}

			for(const simbolo of this.tabla_simbolos){
				if(this.areEqual(simbolo.entorno,actual.entorno) && simbolo.identificador == identificador){
					document.getElementById("consola").value += "la variable "+identificador+" ya fue declarada en el mismo entorno\n";
					return "error";
				}
			}
			this.tabla_simbolos.push(new vector(identificador, tipo, actual.entorno));
		}else if (actual.token == "Declaracion lista"){
			let identificador, tipo;
			for(const hijo of actual.hijos){
				if(hijo.token == "Tipo"){
					tipo = hijo.hijos[0].dato;
				}else if(hijo.token == "ID"){
					identificador = hijo.dato;
				}
			}

			for(const simbolo of this.tabla_simbolos){
				if(this.areEqual(simbolo.entorno,actual.entorno) && simbolo.identificador == identificador){
					document.getElementById("consola").value += "la variable "+identificador+" ya fue declarada en el mismo entorno\n";
					return "error";
				}
			}
			this.tabla_simbolos.push(new lista(identificador, tipo, actual.entorno));
		}else if (actual.token == "Declaracion funcion"){
			let identificador, tipo, argumentos, instrucciones;
			argumentos = [];
			for(const hijo of actual.hijos){
				if(hijo.token == "Tipo"){
					tipo = hijo.hijos[0].dato;
				}else if(hijo.token == "ID"){
					identificador = hijo.dato;
				}else if(hijo.token == "Parametros"){
					argumentos = hijo.ejecutar();
				}else if(hijo.token == "instrucciones"){
					instrucciones = hijo;
				}

			}

			for(const simbolo of this.tabla_simbolos){
				if(this.areEqual(simbolo.entorno,actual.entorno) && simbolo.identificador == identificador){
					document.getElementById("consola").value += "la variable "+identificador+" ya fue declarada en el mismo entorno\n";
					return "error";
				}
			}
			this.tabla_simbolos.push(new funcion(identificador, argumentos, tipo, actual.entorno, instrucciones));
		}else if (actual.token == "Declaracion metodo"){
			let identificador, argumentos, instrucciones;
			for(const hijo of actual.hijos){
				if(hijo.token == "ID"){
					identificador = hijo.dato;
				}else if(hijo.token == "Parametros"){
					argumentos = hijo.ejecutar();
				}else if(hijo.token == "instrucciones"){
					instrucciones = hijo;
				}

			}

			for(const simbolo of this.tabla_simbolos){
				if(this.areEqual(simbolo.entorno,actual.entorno) && simbolo.identificador == identificador){
					document.getElementById("consola").value += "la variable "+identificador+" ya fue declarada en el mismo entorno\n";
					return "error";
				}
			}
			this.tabla_simbolos.push(new metodo(identificador, argumentos, actual.entorno, instrucciones));
		}

		for(const hijo of actual.hijos){
			let r = this.calcular_tabla(hijo);
			if(r != null){
				return "error";
			}
		}
	}

	calcular_entorno(actual){
		if(actual.token == "Programa"){
			actual.entorno.push(actual.clave);
			for(const hijo of actual.hijos){
				hijo.entorno = actual.entorno;
			}
		}else if(this.tokens_entorno.includes(actual.token)){
			for(const hijo of actual.hijos){
				if(this.tokens_hijos.includes(hijo.token)){
					hijo.entorno = hijo.entorno.concat(actual.entorno);
					hijo.entorno.push(actual.clave);
				}else{
					hijo.entorno = actual.entorno;
				}
			}
		}else{
			for(const hijo of actual.hijos){
				hijo.entorno = actual.entorno;
			}
		}

		for(const hijo of actual.hijos){
			this.calcular_entorno(hijo);
		}
	}

	graficar_tabla(){
        let dot = "digraph {\nlabel=\" Tabla de simbolos \";\nN_1[shape=none label = <\n"
                + " <TABLE border=\"0\" cellspacing=\"0\" cellpadding=\"10\" style=\"collapse\">\n"
                + "  <TR >\n"
                + "  <TD border=\"1\" bgcolor=\"#04AA6D\"><b><font color=\"White\">Identificador</font></b></TD>\n"
                + "  <TD border=\"1\" bgcolor=\"#04AA6D\"><b><font color=\"White\">Objeto</font></b></TD>\n"
                + "  <TD border=\"1\" bgcolor=\"#04AA6D\"><b><font color=\"White\">Tipo</font></b></TD>\n"
                + "  <TD border=\"1\" bgcolor=\"#04AA6D\"><b><font color=\"White\">Entorno</font></b></TD>\n";
        dot += "  </TR>\n";

        for (const s of this.tabla_simbolos) {
            dot += "  <TR>\n"
                    + "  <TD border=\"1\">"+s.identificador+"</TD>\n"
                    + "  <TD border=\"1\">"+s.constructor.name+"</TD>\n"
                    + "  <TD border=\"1\">"+s.tipo+"</TD>\n";
            if(s.entorno.length == 1){
            	dot+= "  <TD border=\"1\">global</TD>\n";
            }else{
            	dot+= "  <TD border=\"1\">local</TD>\n";
            }
            dot += "  </TR>\n";
        }
        
            dot += "</TABLE>>];\n}";
        console.log(dot);
      	console.log(this.tabla_simbolos);
        return dot;
	}
}