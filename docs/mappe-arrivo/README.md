# Le mappe di «Come arrivare»

Due mappe animate che disegnavano il percorso fino al parco di via Leopardi:
una larga, una verticale per il telefono, e un modulo condiviso con le icone e
la linea del tempo GSAP. Sono state in produzione fino a settembre 2026.

Non sono più nel sito: la sezione racconta il percorso a parole e con due card
fotografiche. Sono qui perché Caterina ha voluto tenerle, non perché servano.

## Perché fuori da `src/`

Stavano in `src/components/` senza che nessuno le importasse. Non costavano
niente a chi apriva il sito: Next le teneva già fuori dal bundle servito, e
nelle richieste misurate in produzione non se ne trovava traccia.

Costavano a chi legge il codice. Ottocentocinquanta righe in mezzo ai componenti
vivi, che TypeScript controllava, ESLint analizzava, e chiunque doveva leggere
per scoprire che non servivano. Qui sono documentazione, e si vede: `docs` è
escluso da TypeScript e da ESLint.

## Cosa contengono

| file | cosa fa |
|---|---|
| `arrival-map.tsx` | la mappa larga: due percorsi che si specchiano e si incontrano al centro |
| `arrival-map-mobile.tsx` | lo stesso viaggio in verticale, guidato dallo scroll |
| `arrival-route.tsx` | icone Lucide dentro cerchi, e la linea del tempo che disegna il tracciato |

## Se un giorno tornassero

1. Rimettere i tre file in `src/components/`.
2. `npm i gsap` ha già MotionPath: basta importarlo di nuovo.
3. Nella sezione, sostituire le due card con `<ArrivalMap />` e
   `<ArrivalMapMobile />` come facevano prima del commit `99510fa`.

**Una cosa da correggere prima di riusarle.** Fino al commit `2efe05f` queste
mappe dicevano il falso: mandavano chi arriva in treno a cambiare a Lecco. Ma
Valmadrera ha una stazione sua, aperta dal 1888, sulla linea Como–Lecco, dove
fermano la S7 di Trenord da Milano e la R18 da Como. La correzione è nei file
che trovi qui; non reintrodurre la versione vecchia.

Resta **non verificato** il «5' a piedi» dal parcheggio al parco: è precedente
a chi scrive, può essere giusto, e va chiesto a qualcuno che conosce il paese.
