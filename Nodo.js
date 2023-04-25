class Nodo{
	constructor(token, fila,columna, valor = ""){
		this.token = token;
		this.dato = valor;
		this.hijos = [];
		this.clave = Math.floor((Math.random() * 100000000000000));
		this.entorno = [];
		this.fila = fila;
		this.columna = columna;
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

	ejecutar(tabla_simbolos, selected_case = null){
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
			resultado = this.hijos[0].ejecutar(tabla_simbolos);
			return resultado;
		}else if(this.token == "aritmetico"){
			if(this.hijos[0].token == "MENOS"){
				let r1 = this.hijos[1].ejecutar(tabla_simbolos);
				if(r1.tipo == "int" || r1.tipo == "double"){
					return {tipo:r1.tipo,valor:-r1.valor};
				}else{
					salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos";
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
					salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos";
					throw true;
				}
			}else if(this.hijos[1].token == "BARRA"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				if(r1.tipo == "int" && r2.tipo == "int" || r1.tipo == "double" && r2.tipo == "int" || r1.tipo == "int" && r2.tipo == "double" || r1.tipo == "double" && r2.tipo == "double"){
					return {tipo:"double",valor: r1.valor / r2.valor};
				}else if(r1.tipo == "int" && r2.tipo == "char" || r1.tipo == "double" && r2.tipo == "char"){
					return {tipo:"double",valor: r1.valor / r2.valor.charCodeAt(0)};
				}else if(r1.tipo == "char" && r2.tipo == "double" || r1.tipo == "char" && r2.tipo == "int"){
					return {tipo:"double",valor: r1.valor.charCodeAt(0) / r2.valor};
				}else{
					salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos";
					throw true;
				}
			}else if(this.hijos[1].token == "ASTERISCO"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				if(r1.tipo == "int" && r2.tipo == "int"){
					return {tipo:"int",valor: r1.valor * r2.valor};
				}else if(r1.tipo == "double" && r2.tipo == "int" || r1.tipo == "int" && r2.tipo == "double" || r1.tipo == "double" && r2.tipo == "double"){
					return {tipo:"double",valor: r1.valor * r2.valor};
				}else if(r1.tipo == "int" && r2.tipo == "char" ){
					return {tipo:"int",valor: r1.valor * r2.valor.charCodeAt(0)};
				}else if(r1.tipo == "double" && r2.tipo == "char"){
					return {tipo:"double",valor: r1.valor * r2.valor.charCodeAt(0)};
				}else if(r1.tipo == "char" && r2.tipo == "double"){
					return {tipo:"double",valor: r1.valor.charCodeAt(0) * r2.valor};
				}else if(r1.tipo == "char" && r2.tipo == "int"){
					return {tipo:"int",valor: r1.valor.charCodeAt(0) * r2.valor};
				}else{
					salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos";
					throw true;
				}
			}else if(this.hijos[1].token == "MENOS"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				if(r1.tipo == "int" && r2.tipo == "int"){
					return {tipo:"int",valor: r1.valor - r2.valor};
				}else if(r1.tipo == "double" && r2.tipo == "int" || r1.tipo == "int" && r2.tipo == "double" || r1.tipo == "double" && r2.tipo == "double"){
					return {tipo:"double",valor: r1.valor - r2.valor};
				}else if(r1.tipo == "int" && r2.tipo == "boolean"){
					return {tipo:"int",valor: r1.valor - (r2.valor ? 1 : 0)};
				}else if(r1.tipo == "boolean" && r2.tipo == "int"){
					return {tipo:"int",valor: (r1.valor ? 1 : 0) - r2.valor};
				}else if(r1.tipo == "double" && r2.tipo == "boolean"){
					return {tipo:"double",valor: r1.valor - (r2.valor ? 1 : 0)};
				}else if(r1.tipo == "boolean" && r2.tipo == "double"){
					return {tipo:"double",valor: (r1.valor ? 1 : 0) - r2.valor};
				}else if(r1.tipo == "int" && r2.tipo == "char" ){
					return {tipo:"int",valor: r1.valor - r2.valor.charCodeAt(0)};
				}else if(r1.tipo == "double" && r2.tipo == "char"){
					return {tipo:"double",valor: r1.valor - r2.valor.charCodeAt(0)};
				}else if(r1.tipo == "char" && r2.tipo == "double"){
					return {tipo:"double",valor: r1.valor.charCodeAt(0) - r2.valor};
				}else if(r1.tipo == "char" && r2.tipo == "int"){
					return {tipo:"int",valor: r1.valor.charCodeAt(0) - r2.valor};
				}else{
					salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos";
					throw true;
				}
			}else if(this.hijos[1].token == "MAS"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				if(r1.tipo == "int" && r2.tipo == "int"){
					return {tipo:"int",valor: r1.valor + r2.valor};
				}else if(r1.tipo == "double" && r2.tipo == "int" || r1.tipo == "int" && r2.tipo == "double" || r1.tipo == "double" && r2.tipo == "double"){
					return {tipo:"double",valor: r1.valor + r2.valor};
				}else if(r1.tipo == "int" && r2.tipo == "boolean"){
					return {tipo:"int",valor: r1.valor + (r2.valor ? 1 : 0)};
				}else if(r1.tipo == "boolean" && r2.tipo == "int"){
					return {tipo:"int",valor: (r1.valor ? 1 : 0) + r2.valor};
				}else if(r1.tipo == "double" && r2.tipo == "boolean"){
					return {tipo:"double",valor: r1.valor + (r2.valor ? 1 : 0)};
				}else if(r1.tipo == "boolean" && r2.tipo == "double"){
					return {tipo:"double",valor: (r1.valor ? 1 : 0) + r2.valor};
				}else if(r1.tipo == "int" && r2.tipo == "char" ){
					return {tipo:"int",valor: r1.valor + r2.valor.charCodeAt(0)};
				}else if(r1.tipo == "double" && r2.tipo == "char"){
					return {tipo:"double",valor: r1.valor + r2.valor.charCodeAt(0)};
				}else if(r1.tipo == "char" && r2.tipo == "double"){
					return {tipo:"double",valor: r1.valor.charCodeAt(0) + r2.valor};
				}else if(r1.tipo == "char" && r2.tipo == "int"){
					return {tipo:"int",valor: r1.valor.charCodeAt(0) + r2.valor};
				}else if(r1.tipo == "char" && r2.tipo == "char" || r1.tipo == "string" && r2.tipo == "char"
					|| r1.tipo == "string" && r2.tipo == "boolean"|| r1.tipo == "string" && r2.tipo == "int"
					|| r1.tipo == "string" && r2.tipo == "double"|| r1.tipo == "string" && r2.tipo == "string"
					|| r1.tipo == "char" && r2.tipo == "string"|| r1.tipo == "boolean" && r2.tipo == "string"
					|| r1.tipo == "int" && r2.tipo == "string"|| r1.tipo == "double" && r2.tipo == "string"){
					return {tipo:"string",valor: r1.valor + r2.valor};
				}else{
					salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos";
					throw true;
				}
			}else if(this.hijos[1].token == "PORCENTAJE"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				if(r1.tipo == "int" && r2.tipo == "int" || r1.tipo == "double" && r2.tipo == "int" || r1.tipo == "int" && r2.tipo == "double" || r1.tipo == "double" && r2.tipo == "double"){
					return {tipo:"double",valor: r1.valor % r2.valor};
				}else{
					salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos";
					throw true;
				}
			}
		}else if(this.token== "Condicional"){
			if(this.hijos[1].token == "IGUAL"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				return {tipo:"boolean",valor: r1.valor == r2.valor};
			}else if(this.hijos[1].token == "DESIGUAL"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				return {tipo:"boolean",valor: r1.valor != r2.valor};
			}else if(this.hijos[1].token == "MENORIGUAL"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				return {tipo:"boolean",valor: r1.valor <= r2.valor};
			}else if(this.hijos[1].token == "MENOR"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				return {tipo:"boolean",valor: r1.valor < r2.valor};
			}else if(this.hijos[1].token == "MAYORIGUAL"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				return {tipo:"boolean",valor: r1.valor >= r2.valor};
			}else if(this.hijos[1].token == "MAYOR"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				return {tipo:"boolean",valor: r1.valor > r2.valor};
			}
		}else if(this.token== "Ternario"){
			let r1 = this.hijos[0].ejecutar(tabla_simbolos);
			let r2 = this.hijos[2].ejecutar(tabla_simbolos);
			let r3 = this.hijos[4].ejecutar(tabla_simbolos);
			if(r1.valor){
				return r2;
			}
			return r3;
		}else if(this.token == "Logico"){
			if(this.hijos[0].token == "NOT"){
				let r1 = this.hijos[1].ejecutar(tabla_simbolos);
				return {tipo:"boolean",valor: !r1.valor};
			}else if(this.hijos[1].token == "AND"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				return {tipo:"boolean",valor: r1.valor && r2.valor};
			}else if(this.hijos[1].token == "OR"){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				let r2 = this.hijos[2].ejecutar(tabla_simbolos);
				return {tipo:"boolean",valor: r1.valor || r2.valor};
			}
		}else if(this.token == "Declaracion variable"){
			let variable = this.buscar_simbolo(this.hijos[1].dato.toLowerCase(),this.entorno,"variable",tabla_simbolos);
			for(const hijo of this.hijos){
				if(hijo.token == "Expression"){
					let r1 = hijo.ejecutar(tabla_simbolos);	
					if(variable.tipo == r1.tipo){
						variable.dato = r1.valor;
					}else{
						salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en la declaracion";
						throw true;
					}
				}
			}
		}else if(this.token == "Asignacion variable"){
			let variable = this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"variable",tabla_simbolos);
			if(variable == null){
				variable =  this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"lista",tabla_simbolos);
			}
			if(variable == null){
				variable =  this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"vector",tabla_simbolos);
			}
			if(variable == null){
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", el id: \""+this.dato+"\" no está declarado";
				throw true;
			}
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			if(variable.tipo == r1.tipo){
				variable.dato = r1.valor;
			}else{
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en la asignacion";
				throw true;
			}
		}else if(this.token == "Funcion print"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			salida.value += r1.valor+"\n";
		}else if(this.token == "Casteo"){
			let r1 = this.hijos[3].ejecutar(tabla_simbolos);
			let tipo = this.hijos[1].hijos[0].dato;
			if(tipo == "double" && r1.tipo == "int"){
				return {tipo:"double",valor: r1.valor};
			}else if(tipo == "int" && r1.tipo == "double"){
				return {tipo:"int",valor: r1.valor};
			}else if(tipo == "string" && r1.tipo == "int"){
				return {tipo:"string",valor: ""+r1.valor};
			}else if(tipo == "char" && r1.tipo == "int"){
				return {tipo:"char",valor: String.fromCharCode(r1.valor)};
			}else if(tipo == "string" && r1.tipo == "double"){
				return {tipo:"string",valor: ""+r1.valor};
			}else if(tipo == "int" && r1.tipo == "char"){
				return {tipo:"int",valor: r1.valor.charCodeAt(0)};
			}else if(tipo == "double" && r1.tipo == "char"){
				return {tipo:"double",valor: r1.valor.charCodeAt(0)};
			}else{
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en el casteo";
				throw true;
			}
		}else if(this.token == "Actualizacion"){
			let variable = this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"variable",tabla_simbolos);
			if(this.hijos[1].token == "MAS"){
				variable.dato = variable.dato + 1;
				return {tipo:variable.tipo,valor: variable.valor};
			}else if(this.hijos[1].token == "MENOS"){
				variable.dato = variable.dato - 1;
				return {tipo:variable.tipo,valor: variable.valor};
			}
		}else if(this.token == "Declaracion vector"){
			let variable = this.buscar_simbolo(this.hijos[3].dato.toLowerCase(),this.entorno,"vector",tabla_simbolos);
			if(this.hijos.length == 11){
				let cantidad = this.hijos[8].ejecutar(tabla_simbolos);
				if(cantidad.tipo == "int"){
					let valor_a_insertar = variable.dato;
					variable.dato = new Array(cantidad.valor).fill(variable.dato);
				}else{
					salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en la declaracion del vector";
					throw true;
				}
			}else{
				variable.dato = this.hijos[6].ejecutar(tabla_simbolos);
			}
		}else if(this.token == "Acceso vector"){
			let variable = this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"vector",tabla_simbolos);
			let indice = this.hijos[8].ejecutar(tabla_simbolos);
			if(indice.tipo == "int"){
				return {tipo:variable.tipo,valor: variable.dato[indice.valor]};
			}else{
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", el indice del vector debe ser un int";
				throw true;
			}
		}else if(this.token == "Modificacion vector"){
			let variable = this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"vector",tabla_simbolos);
			let indice = this.hijos[2].ejecutar(tabla_simbolos);
			let nuevo_valor = this.hijos[5].ejecutar(tabla_simbolos);
			if(indice.tipo != "int"){
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", el indice del vector debe ser un int";
				throw true;
			}
			if(nuevo_valor.tipo != variable.tipo){
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en la asignacion a vector";
				throw true;
			}

			variable.dato[indice.valor] = nuevo_valor.valor;
		}else if(this.token == "Declaracion lista"){
			return;
		}else if(this.token == "Agregar lista"){
			let variable = this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"lista",tabla_simbolos);
			let r1 = this.hijos[4].ejecutar(tabla_simbolos);
			if(r1.tipo != variable.tipo){
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en la asignacion a vector";
				throw true;
			}
			variable.dato.push(r1.valor);
		}else if(this.token == "Acceso lista"){
			let variable = this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"lista",tabla_simbolos);
			let indice = this.hijos[3].ejecutar(tabla_simbolos);
			if(indice.tipo == "int"){
				return {tipo:variable.tipo,valor: variable.dato[indice.valor]};
			}else{
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", el indice de la lista debe ser un int";
				throw true;
			}
		}else if(this.token == "Modificacion lista"){
			let variable = this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"lista",tabla_simbolos);
			let indice = this.hijos[3].ejecutar(tabla_simbolos);
			let nuevo_valor = this.hijos[7].ejecutar(tabla_simbolos);
			if(indice.tipo != "int"){
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", el indice del vector debe ser un int";
				throw true;
			}
			if(nuevo_valor.tipo != variable.tipo){
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en la asignacion a lista";
				throw true;
			}

			variable.dato[indice.valor] = nuevo_valor.valor;
		}else if(this.token == "Sentencia if"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);

			if(this.hijos.length == 7){
				if(r1.valor){
					let r2 = this.hijos[5].ejecutar(tabla_simbolos);
					return r2;
				}
			}else if(this.hijos.length == 11){
				if(r1.valor){
					let r2 = this.hijos[5].ejecutar(tabla_simbolos);
					return r2;
				}else{
					let r2 = this.hijos[9].ejecutar(tabla_simbolos);
					return r2;
				}
			}else{
				if(r1.valor){
					let r2 = this.hijos[5].ejecutar(tabla_simbolos);
					return r2;
				}else{
					let r2 = this.hijos[8].ejecutar(tabla_simbolos);
					return r2;
				}
			}
		}else if(this.token == "Sentencia switch"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			if(this.hijos.length == 8){
				let r2 = this.hijos[5].ejecutar(tabla_simbolos, r1.valor);
				if(r2 != null){
					if(r2.sentencia == "return"){
						return r2;
					}else if(r2.sentencia == "break"){
						return null;
					}
				}
				r2 = this.hijos[6].ejecutar(tabla_simbolos);
				if(r2 != null){
					if(r2.sentencia == "return"){
						return r2;
					}else if(r2.sentencia == "break"){
						return null;
					}
				}
			}else{
				let r2 = this.hijos[5].ejecutar(tabla_simbolos, r1.valor);
				if(r2 != null){
					if(r2.sentencia == "return"){
						return r2;
					}else if(r2.sentencia == "break"){
						return null;
					}
				}
			}
		}else if(this.token == "Lista casos"){
			if(this.hijos.length == 2){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos, selected_case);
				if(r1 == null){
					r1 = this.hijos[1].ejecutar(tabla_simbolos, selected_case);
					return r1;
				}
				return r1;
			}else{
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				return r1;
			}
		}else if(this.token == "Caso"){
			let r1 = this.hijos[1].ejecutar(tabla_simbolos);
			let r2;
			if(r1.valor == selected_case){
				r2 = this.hijos[3].ejecutar(tabla_simbolos);
				return r2;
			}
		}else if(this.token == "Default"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			return r1;
		}else if(this.token == "Sentencia while"){
			while(this.hijos[2].ejecutar(tabla_simbolos).valor){
				let r1 = this.hijos[5].ejecutar(tabla_simbolos);
				if(r1!=null){
					if(r1.sentencia == "break"){
						break;
					}else if(r1.sentencia == "continue"){

					}else if(r1.sentencia == "return"){
						return r1;
					}
				}
			}
		}else if(this.token == "Sentencia for"){
			this.hijos[2].ejecutar(tabla_simbolos);
			while(this.hijos[3].ejecutar(tabla_simbolos).valor){
				let r1 = this.hijos[8].ejecutar(tabla_simbolos);
				if(r1!=null){
					if(r1.sentencia == "break"){
						break;
					}else if(r1.sentencia == "continue"){
						
					}else if(r1.sentencia == "return"){
						return r1;
					}
				}
				this.hijos[5].ejecutar(tabla_simbolos);
			}
		}else if(this.token == "Sentencia do while"){
			do{
				let r1 = this.hijos[2].ejecutar(tabla_simbolos);
				if(r1 != null){
					if(r1.sentencia == "break"){
						break;
					}else if(r1.sentencia == "continue"){
						continue;
					}else if(r1.sentencia == "return"){
						return r1;
					}
				}
			} while(this.hijos[6].ejecutar(tabla_simbolos).valor);
		}else if(this.token == "Transferencia"){
			if(this.hijos[0].token == "R_BREAK"){
				return {sentencia: "break"};
			}else if (this.hijos[0].token == "R_CONTINUE"){
				return {sentencia: "continue"};
			}else if(this.hijos.length == 3){
				return {sentencia: "return", valor: this.hijos[1].ejecutar(tabla_simbolos)};
			}else{
				return {sentencia: "return", valor: null};
			}
		}else if (this.token == "Llamada"){
			let variable = this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"metodo",tabla_simbolos);
			if(variable == null){
				variable = this.buscar_simbolo(this.hijos[0].dato.toLowerCase(),this.entorno,"funcion",tabla_simbolos);
			}
			let clonada = tabla_simbolos;
			if(this.hijos.length == 4){
				let parametros = this.hijos[2].ejecutar(tabla_simbolos);
				let args = [];
				for(let i = 0; i < variable.argumentos.length; i++){
					args.push(variable.argumentos[i].identificador)
				}
				clonada=this.clonar(tabla_simbolos, args, variable.argumentos[0].entorno);
				for(let i = 0; i < variable.argumentos.length; i++){
					 let r1 = this.buscar_simbolo(variable.argumentos[i].identificador,variable.argumentos[i].entorno,"variable",clonada);
					 if(r1 == null){
					 	r1 = this.buscar_simbolo(variable.argumentos[i].identificador,variable.argumentos[i].entorno,"lista",clonada);
					 }
					 if(r1 == null){
					 	r1 = this.buscar_simbolo(variable.argumentos[i].identificador,variable.argumentos[i].entorno,"vector",clonada);
					 }
					 if(r1 == null){
					 	salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", el id: \""+variable.argumentos[i]+"\" no está declarado";
						throw true;
					 }
					 if(r1.tipo == parametros[i].tipo){
					 		r1.dato= parametros[i].valor;
					 }else{
					 	salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en la llamada";
						throw true;
					 }
				}
			}
			let r2 = variable.instrucciones.ejecutar(clonada);
			if(variable.constructor.name == "funcion"){
				if(r2.valor.tipo == variable.tipo){
					return r2.valor;
				}
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en el retorno de la funcion: "+variable.identificador;
				throw true;
			}
		}else if(this.token == "Parametros llamada"){
			let resultado = [];
			if(this.hijos.length == 3){
				resultado = this.hijos[0].ejecutar(tabla_simbolos);
				resultado.push(this.hijos[2].ejecutar(tabla_simbolos));
			}else{
				resultado.push(this.hijos[0].ejecutar(tabla_simbolos));
			}
			return resultado;
		}else if(this.token == "Funcion toLower"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			if(r1.tipo == "string"){
				return {tipo:"string", valor:r1.valor.toLowerCase()};
			}
		}else if(this.token == "Funcion toUpper"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			if(r1.tipo == "string"){
				return {tipo:"string", valor:r1.valor.toUpperCase()};
			}
		}else if(this.token == "Funcion length"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			return {tipo:"int", valor:r1.valor.length};
		}else if(this.token == "Funcion truncate"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			return {tipo:"int", valor:Math.trunc(r1.valor)};
		}else if(this.token == "Funcion round"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			return {tipo:"int", valor:Math.round(r1.valor)};
		}else if(this.token == "Funcion typeOf"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			return {tipo:"string", valor: r1.tipo};
		}else if(this.token == "Funcion toString"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			return {tipo:"string", valor: String(r1.valor)};
		}else if(this.token == "Funcion toCharArray"){
			let r1 = this.hijos[2].ejecutar(tabla_simbolos);
			if(r1.tipo == "string"){
				return {tipo:"char", valor: r1.valor.split("")};
			}else{
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", error de tipos en la funcion toCharArray";
				throw true;
			}
		}else if(this.token == "Datos"){
			if(this.hijos[0].token == "DOUBLE"){
				return {tipo:"double", valor: parseFloat(this.hijos[0].dato)};
			}else if(this.hijos[0].token == "CHAR"){
				return {tipo:"char", valor: this.hijos[0].dato};
			}else if(this.hijos[0].token == "STRING"){
				return {tipo:"string", valor: this.hijos[0].dato};
			}else if(this.hijos[0].token == "R_TRUE"){
				return {tipo:"boolean", valor: true};
			}else if(this.hijos[0].token == "R_FALSE"){
				return {tipo:"boolean", valor: false};
			}else if(this.hijos[0].token == "INT"){
				return {tipo:"int", valor: parseInt(this.hijos[0].dato)};
			}
		}else if(this.token == "ID"){
			let variable = this.buscar_simbolo(this.dato.toLowerCase(),this.entorno,"variable",tabla_simbolos);
			if(variable == null){
				variable =  this.buscar_simbolo(this.dato.toLowerCase(),this.entorno,"lista",tabla_simbolos);
			}
			if(variable == null){
				variable =  this.buscar_simbolo(this.dato.toLowerCase(),this.entorno,"vector",tabla_simbolos);
			}
			if(variable == null){
				salida.value += "Error semantico en linea: "+this.fila+", columna: "+this.columna+", el id: \""+this.dato+"\" no está declarado";
				throw true;
			}
			return {tipo: variable.tipo, valor: variable.dato};
		}else if(this.token == "instrucciones"){
			if(this.hijos.length == 2){
				let r1 = this.hijos[0].ejecutar(tabla_simbolos);
				if(r1 != null){
					return r1;
				}
				return this.hijos[1].ejecutar(tabla_simbolos);
			}
			return this.hijos[0].ejecutar(tabla_simbolos);
		}else if(this.token == "instruccion"){
			return this.hijos[0].ejecutar(tabla_simbolos);
		}
	}

	buscar_simbolo(id,entorno,tipo,tabla_simbolos){
		const simbolos_posibles = tabla_simbolos.filter(s => (s.constructor.name == tipo && s.identificador == id && s.entorno.every((n) => entorno.includes(n))));
		if(simbolos_posibles.length == 0){
			return null;
		}
		simbolos_posibles.sort((a,b) => (a.entorno.length > b.entorno.length) ? -1 : 1);
		return simbolos_posibles[0];
	}

	clonar(tabla_simbolos,parametros,contexto){
		let res = [];
		for(let s of tabla_simbolos){
			if(parametros.includes(s.identificador) && contexto == s.entorno){
				res.push(Object.assign(Object.create(Object.getPrototypeOf(s)), s));
			}else{
				res.push(s);
			}
		}
		return res;
	}
}