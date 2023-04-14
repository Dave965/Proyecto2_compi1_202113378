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
  console.log(paginas_creadas)
  paginas_creadas[num_pagina_activa]["texto_editor"] = document.getElementById("entrada").value;
  paginas_creadas[num_pagina_activa]["texto_consola"] = document.getElementById("consola").value;
  num_pagina_activa = numero-1;
  archivo_actual = paginas_creadas[num_pagina_activa]["guardado"]
  document.getElementById("entrada").value = paginas_creadas[num_pagina_activa]["texto_editor"];
  document.getElementById("consola").value = paginas_creadas[num_pagina_activa]["texto_consola"];
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
  console.log(archivos_guardados);
}

function Cambiar(pagina){
  actual = document.getElementById(seccion_activa);
  actual.classList.toggle("hidden");
  siguiente = document.getElementById(pagina);
  siguiente.classList.toggle("hidden");
  seccion_activa = pagina;
}

function Analizar(){
  Guardar();
  let res = gramatica.parse(document.getElementById("entrada").value);
  let prog = new programa(res);
  prog.calcular_entorno(prog.ast);
  r = prog.calcular_tabla(prog.ast);
  if(r == null){
    reportes_guardados.push({"Nombre": archivos_guardados[archivo_actual]["Titulo"]+"_AST.svg","Tipo": "img", "File": prog.ast.graficar()});
    reportes_guardados.push({"Nombre": archivos_guardados[archivo_actual]["Titulo"]+"_Arbol_entornos.svg","Tipo": "img", "File": prog.ast.graficar2()});
    reportes_guardados.push({"Nombre": archivos_guardados[archivo_actual]["Titulo"]+"_tabla_simbolos.svg","Tipo": "img", "File": prog.graficar_tabla()});
    update_reportes();
  }
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
      .height("78vh")
      .renderDot(reporte["File"]);
  }
}