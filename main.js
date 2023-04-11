var num_pagina_activa = 0;
let paginas_creadas = [{"texto_editor": "", "texto_consola": ""}];
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
  console.log(num_pagina_activa)
  document.getElementById("entrada").value = paginas_creadas[num_pagina_activa]["texto_editor"];
  document.getElementById("consola").value = paginas_creadas[num_pagina_activa]["texto_consola"];
  activa = document.getElementsByClassName("pestana_activa")[0];
  activa.classList.remove("pestana_activa");
  pestana.classList.add("pestana_activa");
}

function agregar_pagina(){
  doc = ""
  paginas_creadas.push({"texto_editor": "", "texto_consola": ""})
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