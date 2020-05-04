var i = 0
var j = 0
var k = 0

function getRand(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var game_width = 845
var game_height = 507
var globo_width = 84
var globo_height = 217
var cielo_height = 390

var nubes = []
var nubes_cont1 = document.getElementById('nubes1-cont')
var nubes_cont2 = document.getElementById('nubes2-cont')
var globos_cont = document.getElementById('globos-cont')
var zonas_cont = document.getElementById('zonas-cont')
var globos = []
var zonas = []

function setGame(){
    for(i = 0;i<10;i++){
        createNube(1)
    }
    for(i = 0;i<5;i++){
        createNube(2)
    }

    comenzarJuego()
}

function createNube(t){
    var nube = document.createElement('div')
    nube.className = 'nube'+t
    var y_nube = getRand(0,100)
    var x_nube = getRand(0,game_width)
    if(t==1){
        nubes_cont1.appendChild(nube)
    }else{
        nubes_cont2.appendChild(nube)
    }
    nube.style.left = x_nube+'px'
    nube.style.top = y_nube+'%'
    var aceleracion = getRand(10,50)/100
    nubes.push({element:nube,p:t,x:x_nube,a:aceleracion})
}

function crearGlobo(){
    var globo = document.createElement('div')
    var tipo = getRand(1,2)
    var color = getRand(1,2)
    var x = 0
    if(!ismobile){
        x = getRand(40,(game_width-(globo_width+40)))
    }else{
        x = getRand(0,(game_width-globo_width))
    }
    
    var y = getRand(0,80)

    var html = ""
    if(tipo==1){
        //virus
        globo.className = 'globo-virus globo-virus-'+color
        html+='<div class="globo-cont"><div class="cuerda"></div><div class="globo"></div></div>'
        globo.innerHTML = html
        
    }else{
        //normal
        globo.className = 'globo-normal globo-normal-'+color
        html+='<div class="globo-cont"><div class="cuerda"></div><div class="globo"></div></div>'
        globo.innerHTML = html
    }

    globo.style.left = x+'px'
    globo.style.top = cielo_height+'px'
    //globo.style.top = y+'%'
    
    globos_cont.appendChild(globo)
    var idname = globos.length
    globo.id = 'globito_'+idname

    var zona = document.createElement('div')
    zona.style.left = x+'px'
    zona.style.top = cielo_height+'px'
    zona.setAttribute('onclick','clickGlobo(this,'+idname+')')
    zona.className = 'zona-globo'
    zonas_cont.appendChild(zona)
    

    globos.push({elemento:globo,y:cielo_height,estado:'normal',tipo:tipo,id:idname})
    zonas.push({elemento:zona})
}

var intervalo_globos = 2000
var intervalo_subida = 2
var segundos_transcurridos = 0
var animacion_globo_sale = null
var animacion_globos = null
var animacion_globos_sube = null
var animacion_nubes = null
var termino = false
var terminado = false

function comenzarJuego(){
    startTimer()
    animacion_globos = setInterval(animacionGlobos,intervalo_globos)
    animacion_globos_sube = setInterval(animacionGlobosSube, 25)
    if(!ismobile){
        animacion_nubes = setInterval(animacionNubes,40)
    }
        
    animacion_globo_sale = setInterval(function(){
        segundos_transcurridos++
        if(segundos_transcurridos%5==0){
            if(segundos_transcurridos<60){
                intervalo_globos-=150
                if(intervalo_globos<350){
                    intervalo_globos = 350
                }
                //intervalo_subida+=0.2
    
                clearInterval(animacion_globos)
                animacion_globos = setInterval(animacionGlobos,intervalo_globos)
                console.log("subee")
                //clearInterval(animacion_globos_sube)
                //animacion_globos = setInterval(animacionGlobosSube,intervalo_globos)
            }
            else{
                terminado = true
            }
        }
        if(segundos_transcurridos>=65){
            clearInterval(animacion_globo_sale)
            animacion_globo_sale = null

            clearInterval(animacion_globos)
            clearInterval(animacion_globos_sube)
            //clearInterval(animacion_nubes)
            termino = true
            ganoJuego()
        }
    },1000)
}

function animacionGlobos(){
    if(!terminado){
        crearGlobo()
    }
}

var correctos = 0
var puntos = 0
var puntaje_txt = document.getElementById('puntaje_txt')
function animacionGlobosSube(){
    for(j = 0;j<globos.length;j++){
        if(globos[j]!=null){
            var y_globo = globos[j].y
            var new_y_globo = y_globo-intervalo_subida
            globos[j].y = new_y_globo
            globos[j].elemento.style.top = new_y_globo+'px'
            zonas[j].elemento.style.top = new_y_globo+'px'

            if(new_y_globo<(0-globo_height)){
                /*if(globos[j].estado=='explotado'){
                    if(globos[j].tipo==1){
                        puntos+=2
                    }
                }else if(globos[j].estado=='normal'){
                    if(globos[j].tipo==2){
                        puntos+=1
                    }
                }
                puntaje_txt.innerHTML = puntos*/
                //console.log("quita 1")
                globos_cont.removeChild(globos[j].elemento)
                zonas_cont.removeChild(zonas[j].elemento)
                globos[j] = null
                zonas[j] = null
            }
        }
    }
}

function animacionNubes(){
    for(k = 0;k<nubes.length;k++){
        var nuevo_x = nubes[k].x+nubes[k].a
        if(nuevo_x>game_width){
            nuevo_x = -200
        }
        nubes[k].element.style.left = nuevo_x+'px'
        nubes[k].x = nuevo_x
    }
}

function clickGlobo(zona,idname){
    if(!termino){
        var explota_audio = new Audio('public/assets/sonidos/explotar.mp3')
        explota_audio.play()
        var globo_clickeado = document.getElementById('globito_'+idname)
        var cuerda = globo_clickeado.getElementsByClassName('cuerda')[0]
        var cabeza = globo_clickeado.getElementsByClassName('globo')[0]
        cuerda.classList.add('cuerda-baja')
        cabeza.classList.add('globo-explota')
        zona.style.visibility = 'hidden'

        //encontrar objeto
        var ind = -1
        for(var o = 0;o<globos.length;o++){
            if(globos[o]!=null){
                if(idname==globos[o].id){
                    ind = o
                }
            }            
        }

        if(ind!=-1){
            if(globos[ind].tipo==1){
                puntos+=2
            }else{
                puntos--
            }
            puntaje_txt.innerHTML = puntos
            globos[ind].estado = 'explotado'
        }
    }
    
    
}

var animacion_instrucciones = null
var instrucciones = document.getElementById('instrucciones')
function setInstrucciones(){
    instrucciones.className = 'instrucciones-on'
    /*startTimer()
    animacion_instrucciones = setTimeout(function(){
        clearTimeout(animacion_instrucciones)
        animacion_instrucciones = null
        instrucciones.className = 'instrucciones-off'
    },4000)*/
}
function unsetInstrucciones(){
    animacion_instrucciones = setTimeout(function(){
        clearTimeout(animacion_instrucciones)
        animacion_instrucciones = null
        instrucciones.className = 'instrucciones-off'
    },4000)
}

function clickInstrucciones(btn){
    btn.disabled = true
    instrucciones.className = 'instrucciones-on'
    
    animacion_instrucciones = setTimeout(function(){
        clearTimeout(animacion_instrucciones)
        animacion_instrucciones = null
        instrucciones.className = 'instrucciones-off'
        btn.disabled = false
    },4000)
}

var juego_cont = document.getElementById('juego-cont')
var fondo_cont = document.getElementById('fondo-cont')

var gano_juego = false
function ganoJuego(){
    guardarScorm(true)
    
    gano_juego = true
    ganar2_mp3.currentTime = 0
    ganar2_mp3.play()
    stopTimer()
    
    clearTimeout(animacion_instrucciones)
    animacion_instrucciones = null
    juego_cont.className = 'juego-escena2'
    fondo_cont.className = 'fondo-escena2'

    setMensaje()
    /*instrucciones.className = 'instrucciones-off'

    animacion_instrucciones = setTimeout(function(){
        clearTimeout(animacion_instrucciones)
        animacion_instrucciones = null
        
        instrucciones.innerHTML = '<p>Muy Bien! Tu tiempo es de '+renderTime()+'</p>'
        instrucciones.className = 'instrucciones-on'
    },500)*/
}

var animacion_mensaje = null
function setMensaje(fina){
    var txt = 'El juego ha terminado!<br />Tu puntaje final fué de <span>'+puntos+'</span>'
        
    if(animacion_mensaje!=null){
        clearTimeout(animacion_mensaje)
        animacion_mensaje = null
    }
    var mensaje = document.getElementById('mensaje')
    mensaje.innerHTML = '<p>'+txt+'</p>'
    mensaje.className = 'mensaje-on'

    /*animacion_mensaje = setTimeout(function(){
        clearTimeout(animacion_mensaje)
        animacion_mensaje = null
        mensaje.className = 'mensaje-off'
        
    },4000)*/
    
}