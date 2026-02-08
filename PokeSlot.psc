Algoritmo PokeSlotDeluxe
    Definir nombres Como Caracter
    Definir dinero, progreso, pokemonElegido Como Entero
    Definir ganador Como Logico
    Definir turno, i, azarSlot, pokemonSalio Como Entero
    
    Dimension nombres[3]
    Dimension dinero[3]
    Dimension progreso[3]
    Dimension pokemonElegido[3] 
    
    
    Para i <- 1 Hasta 3 Hacer
        Escribir "Ingrese nombre Jugador ", i, ":"
        Leer nombres[i]
        dinero[i] <- 500
        progreso[i] <- 0
        
        Escribir "Elija compañero: 1.Pikachu 2.Charmander 3.Squirtle 4.Bulbasaur"
        Leer pokemonElegido[i]
    FinPara
    
    ganador <- Falso
    
    Repetir
        Limpiar Pantalla
        Escribir "=== ESTADO DEL TORNEO ==="
       
        Para i <- 1 Hasta 3 Hacer
            Escribir "Jugador: ", nombres[i], " | $: ", dinero[i], " | Meta: ", progreso[i], "/10"
        FinPara
        Escribir "========================"
        Escribir "¿Quién gira la ruleta? (1, 2, 3) o 0 para salir:"
        Leer turno
        
        Si turno > 0 y turno <= 3 Entonces
           
            GirarSlot(turno, nombres, dinero, progreso, pokemonElegido, ganador)
        FinSi
        
    Hasta Que ganador O turno = 0
    
    Si ganador Entonces
        Escribir "¡JUEGO TERMINADO!"
    FinSi
FinAlgoritmo

SubProceso GirarSlot(id, nombres, dinero, progreso, pokemonElegido, ganador Por Referencia)
    Definir costo, azarSlot, pokemonSalio Como Entero
    Definir nombrePoke Como Caracter
    costo <- 10
    
    Si dinero[id] < costo Entonces
        Escribir "¡", nombres[id], " no tiene suficiente dinero!"
        Esperar Tecla
    SiNo
        dinero[id] <- dinero[id] - costo
        Escribir nombres[id], " está girando... (-$10)"
        Esperar 1 Segundos 
        
        azarSlot <- Azar(22) + 1 
        
        Si azarSlot = 1 Entonces
            Escribir " Resultado: [POCIÓN] ¡BONUS! (+2 PT)"
            progreso[id] <- progreso[id] + 2
        SiNo
            Si azarSlot = 2 Entonces
                Escribir " Resultado: [TRAMPA] ¡ATRAPADO! (-1 PT)"
                progreso[id] <- progreso[id] - 1
            SiNo
                pokemonSalio <- Azar(4) + 1 
                
                Segun pokemonSalio Hacer
                    1: nombrePoke <- "Pikachu"
                    2: nombrePoke <- "Charmander"
                    3: nombrePoke <- "Squirtle"
                    4: nombrePoke <- "Bulbasaur"
                FinSegun
                
                Escribir " Resultado: [", nombrePoke, "]"
                
                Si pokemonSalio = pokemonElegido[id] Entonces
                    Escribir " ¡COINCIDENCIA! (+1 PT)"
                    progreso[id] <- progreso[id] + 1
                SiNo
                    Escribir " Fallaste..."
                FinSi
            FinSi 
        FinSi 
        
        Si progreso[id] < 0 Entonces
            progreso[id] <- 0
        FinSi
        
        Si progreso[id] >= 10 Entonces
            progreso[id] <- 10
            ganador <- Verdadero
            Limpiar Pantalla
            Escribir "*********************************"
            Escribir "   ¡FELICIDADES ", nombres[id], "!   "
            Escribir "   HAS GANADO EL TORNEO      "
            Escribir "*********************************"
        FinSi
        
        Esperar 2 Segundos
    FinSi
FinSubProceso
