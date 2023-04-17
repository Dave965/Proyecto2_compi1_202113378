var num_pagina_activa = 0;
let paginas_creadas = [{"texto_editor": "", "texto_consola": "","guardado": null}];
var archivo_actual = null;
let archivos_guardados = [];
var seccion_activa = "Editor";
let reportes_guardados = [];

function keyup(event){
  var numberOfLines = event.value.split("\n").length
  event.parentElement.getElementsByClassName("line-numbers")[0].innerHTML = Array(numberOfLines)
          .fill('<span></span>')
          .join('');

  event.style.height = numberOfLines*21 + "px";
}

function keydown(event){
  if (event.key === 'Tab') {
          const start = event.target.selectionStart;
          const end = event.target.selectionEnd;

          event.target.value = event.target.value.substring(0, start) + '\t' + event.target.value.substring(end);

          event.preventDefault();
        }
}

function cambiar_pestana_activa(pestana,numero){
  paginas_creadas[num_pagina_activa]["texto_editor"] = document.getElementById("entrada").value;
  paginas_creadas[num_pagina_activa]["texto_consola"] = document.getElementById("consola").value;
  num_pagina_activa = numero-1;
  archivo_actual = paginas_creadas[num_pagina_activa]["guardado"]
  document.getElementById("entrada").value = paginas_creadas[num_pagina_activa]["texto_editor"];
  document.getElementById("consola").value = paginas_creadas[num_pagina_activa]["texto_consola"];
  keyup(document.getElementById("entrada"));
  keyup(document.getElementById("consola"));
  activa = document.getElementsByClassName("pestana_activa")[0];
  activa.classList.remove("pestana_activa");
  pestana.classList.add("pestana_activa");
}

function agregar_pagina(){
  if(paginas_creadas.length === 10){
    alert("se ha alcanzado el numero maximo de paginas");
    return;
  }
  doc = ""
  paginas_creadas.push({"texto_editor": "", "texto_consola": "","guardado": null})
  for(i=0;i<paginas_creadas.length;i++){
    if(i === num_pagina_activa){
      doc += '<div class="numero_pestana pestana_activa" id="pagina_'+i+'" onclick="cambiar_pestana_activa(this,'+(i+1)+')">\n'
      doc +=   i+1
      doc +=  '\n</div>\n'
    } else{
      doc += '<div class="numero_pestana" id="pagina_'+i+'" onclick="cambiar_pestana_activa(this,'+(i+1)+')">\n'
      doc +=   i+1
      doc +=  '\n</div>\n'
    }
  }

  paginas = document.getElementById("paginas");
  paginas.innerHTML = doc;
}

async function borrar_pagina(){
  pagina_cerrada = document.getElementById("pagina_"+num_pagina_activa);
  if(paginas_creadas.length === 1){
    alert("solo hay una pestaña abierta");
    return;
  }else if(paginas_creadas.length-1>num_pagina_activa){
    cambiar_pestana_activa(document.getElementById("pagina_"+(num_pagina_activa+1)),num_pagina_activa+2)
    num_pagina_activa-=1;
    paginas_creadas.splice(num_pagina_activa, 1);   
    pagina_cerrada.classList.add("removed");
    pagina_cerrada.addEventListener("transitionend",() => {
      pagina_cerrada.remove();
    })
  }else if(paginas_creadas.length-1 === num_pagina_activa){
    cambiar_pestana_activa(document.getElementById("pagina_"+(num_pagina_activa-1)),num_pagina_activa)
    paginas_creadas.splice(num_pagina_activa+1, 1);
    pagina_cerrada.classList.add("removed");
    pagina_cerrada.addEventListener("transitionend",() => {
      pagina_cerrada.remove();
    })
  }

  await new Promise(r => setTimeout(r, 350));
  doc = ""
  for(i=0;i<paginas_creadas.length;i++){
    if(i === num_pagina_activa){
      doc += '<div class="numero_pestana pestana_activa" id="pagina_'+i+'" onclick="cambiar_pestana_activa(this,'+(i+1)+')">\n'
      doc +=   i+1
      doc +=  '\n</div>\n'
    } else{
      doc += '<div class="numero_pestana" id="pagina_'+i+'" onclick="cambiar_pestana_activa(this,'+(i+1)+')">\n'
      doc +=   i+1
      doc +=  '\n</div>\n'
    }
  }
  paginas = document.getElementById("paginas");
  paginas.innerHTML = doc;

}

function Abrir(){
  var input = document.createElement('input');
  input.type = 'file';
  input.click();
  input.onchange = e => { 
    var file = e.target.files[0];
    var fr=new FileReader();
    fr.onload=function(){
      document.getElementById('entrada').value=fr.result.trim();
      paginas_creadas[num_pagina_activa]["texto_editor"] = document.getElementById("entrada").value;
      keyup(document.getElementById("entrada"));
    }
    fr.readAsText(file); 
  }
  
}

function Guardar(){
  if(archivo_actual === null){
    var n =prompt("Nombre del archivo", "Archivo_guardado_"+archivos_guardados.length);
    archivos_guardados.push({"Titulo": n, "contenido": document.getElementById("entrada").value});
    paginas_creadas[num_pagina_activa]["guardado"] = archivos_guardados.length-1;
    archivo_actual = paginas_creadas[num_pagina_activa]["guardado"];

  }else{
    archivos_guardados[archivo_actual]["contenido"] = document.getElementById('entrada').value;
  }
  update_documentos();
}

function Cambiar(pagina){
  actual = document.getElementById(seccion_activa);
  actual.classList.toggle("hidden");
  siguiente = document.getElementById(pagina);
  siguiente.classList.toggle("hidden");
  seccion_activa = pagina;
}

function Analizar(){
  document.getElementById("consola").value ="";
  var parser = new gramatica.Parser();
  parser.yy = {er_l: [], er_s:[], arbol:[]};
  
  try{
    parser.parse(document.getElementById("entrada").value);
  }catch{
    
  }

  Guardar();

  if(parser.yy.er_l.length != 0 || parser.yy.er_s.length != 0){
    try{
      reportes_guardados.filter(s => (s.Nombre == archivos_guardados[archivo_actual]["Titulo"]+"_Errores.svg"))[0].File = graficar_errores(parser.yy.er_l,parser.yy.er_s);
    }catch{
      reportes_guardados.push({"Nombre": archivos_guardados[archivo_actual]["Titulo"]+"_Errores.svg","Tipo": "img", "File": graficar_errores(parser.yy.er_l,parser.yy.er_s)});
    }
    update_reportes();
    document.getElementById("consola").value += "errores encontrados en la entrada, escritos en el reporte: "+archivos_guardados[archivo_actual]["Titulo"]+"_Errores.svg";
    return;
  }
  
  let prog = new programa(parser.yy.arbol[0]);
  prog.calcular_entorno(prog.ast);
  r = prog.calcular_tabla(prog.ast);
  
  if(r == null){
    try{
      reportes_guardados.splice(reportes_guardados.indexOf(reportes_guardados.filter(s => (s.Nombre == archivos_guardados[archivo_actual]["Titulo"]+"_Errores.svg"))[0]),1);
    }catch{

    }
    try{
      reportes_guardados.filter(s => (s.Nombre == archivos_guardados[archivo_actual]["Titulo"]+"_AST.svg"))[0].File = prog.ast.graficar();
    }catch{
      reportes_guardados.push({"Nombre": archivos_guardados[archivo_actual]["Titulo"]+"_AST.svg","Tipo": "img", "File": prog.ast.graficar()});
    }
    try{
      reportes_guardados.filter(s => (s.Nombre == archivos_guardados[archivo_actual]["Titulo"]+"_tabla_simbolos.svg"))[0].File = prog.graficar_tabla();
    }catch{
      reportes_guardados.push({"Nombre": archivos_guardados[archivo_actual]["Titulo"]+"_tabla_simbolos.svg","Tipo": "img", "File": prog.graficar_tabla()});
    }
    
    update_reportes();
    prog.correr_programa();
    keyup(document.getElementById("consola"));
  }

}

function graficar_errores(lex,sin){
  let dot = "digraph {\nlabel=\" Tabla de errores \";\nN_1[shape=none label = <\n"
                + " <TABLE border=\"0\" cellspacing=\"0\" cellpadding=\"10\" style=\"collapse\">\n"
                + "  <TR >\n"
                + "  <TD border=\"1\" bgcolor=\"#04AA6D\"><b><font color=\"White\">Tipo de Error</font></b></TD>\n"
                + "  <TD border=\"1\" bgcolor=\"#04AA6D\"><b><font color=\"White\">Descripción</font></b></TD>\n"
                + "  <TD border=\"1\" bgcolor=\"#04AA6D\"><b><font color=\"White\">Linea</font></b></TD>\n"
                + "  <TD border=\"1\" bgcolor=\"#04AA6D\"><b><font color=\"White\">Columna</font></b></TD>\n";
        dot += "  </TR>\n";

        for (const s of lex) {
            dot += "  <TR>\n"
                    + "  <TD border=\"1\">"+s.tipo+"</TD>\n"
                    + "  <TD border=\"1\">"+s.desc+"</TD>\n"
                    + "  <TD border=\"1\">"+s.lin+"</TD>\n"
                    + "  <TD border=\"1\">"+s.col+"</TD>\n"
                    + "  </TR>\n";
        }
        for (const s of sin) {
            dot += "  <TR>\n"
                    + "  <TD border=\"1\">"+s.tipo+"</TD>\n"
                    + "  <TD border=\"1\">"+s.desc+"</TD>\n"
                    + "  <TD border=\"1\">"+s.lin+"</TD>\n"
                    + "  <TD border=\"1\">"+s.col+"</TD>\n"
                    + "  </TR>\n";
        }
        
        dot += "</TABLE>>];\n}";
        return dot;
}

function update_documentos(){
  html = ""
  for(let i= 0; i< archivos_guardados.length;i++){
    html += " <button class=\"card\" onclick=\"abrir_guardado("+i+")\" onmouseover=\"preview("+i+")\">"+archivos_guardados[i]["Titulo"]+"</button>"
  }
  document.getElementById("selector_documento").innerHTML = html;
}

function abrir_guardado(indice){
  if(paginas_creadas.length === 10){
    alert("se ha alcanzado el numero maximo de paginas");
    return;
  }

  agregar_pagina();
  paginas_creadas[paginas_creadas.length-1]["texto_editor"] = archivos_guardados[indice].contenido;
  paginas_creadas[paginas_creadas.length-1]["guardado"] = indice;
  cambiar_pestana_activa(document.getElementById("pagina_"+(paginas_creadas.length-1)),paginas_creadas.length);
  Cambiar('Editor');
}

function preview(indice){
  document.getElementById("preview").value = archivos_guardados[indice].contenido;
   keyup(document.getElementById("preview"));
}

function update_reportes(){
  html = ""
  for(let i= 0; i< reportes_guardados.length;i++){
    html += " <button class=\"card\" onclick=\"graficar("+i+")\">"+reportes_guardados[i]["Nombre"]+"</button>"
  }
  document.getElementById("selector_reporte").innerHTML = html;
}

function graficar(indice){
  reporte = reportes_guardados[indice];
  if(reporte["Tipo"] == "img"){
    d3.select("#lienzo").graphviz()
      .width("45vw") 
      .height("82vh")
      .renderDot(reporte["File"]);
  }
}