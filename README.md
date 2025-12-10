# Privilege Cafè & Wine - Gestione Cantina

Questa è un'applicazione Angular per la gestione della cantina di vini del "Privilege Cafè & Wine". Permette di cercare vini, visualizzare i prezzi in base al ruolo dell'utente, gestire l'inventario e stampare etichette.

## Stack Tecnologico

- **Framework**: Angular (v20+) Standalone
- **Styling**: Tailwind CSS
- **Features**:
    - Autenticazione a ruoli (master, operator, guest)
    - Scansione e ricerca di codici a barre
    - Gestione CRUD (Create, Read, Update, Delete) dei vini
    - Importazione massiva da file Excel (.xlsx)
    - Generazione e stampa di etichette con codice a barre

## Prerequisiti per il Deploy

Per poter compilare e distribuire l'applicazione, è necessario avere installato [Node.js](https://nodejs.org/) (che include npm) e l'interfaccia a riga di comando di Angular (Angular CLI).

Se non hai Angular CLI, installalo globalmente:
```bash
npm install -g @angular/cli
```

## Build per la Produzione

L'ambiente di sviluppo in cui è stata creata l'app utilizza un sistema di importazione dei moduli (`importmap`) che non è adatto per un ambiente di produzione. È necessario "compilare" il progetto. Questo processo converte il codice TypeScript e Angular in file JavaScript ottimizzati che i browser possono eseguire in modo efficiente.

1.  **Installa le dipendenze**: Naviga nella cartella principale del progetto ed esegui:
    ```bash
    npm install
    ```

2.  **Compila il progetto**: Esegui il comando di build di Angular. È **fondamentale** specificare il `base-href` corretto per GitHub Pages.
    ```bash
    # Sostituisci <NOME_REPOSITORY> con il nome del tuo repository GitHub
    ng build --configuration production --base-href /<NOME_REPOSITORY>/
    ```
    Questo comando creerà una cartella `dist/<nome-progetto>/browser` con tutti i file statici pronti per essere distribuiti.

## Deploy su GitHub Pages

Il modo più semplice per distribuire un'applicazione Angular su GitHub Pages è utilizzare la cartella `docs` sul branch principale (`main`).

1.  **Rinomina la cartella di output**: Dopo il processo di build, rinomina la cartella di output (es. `dist/<nome-progetto>/browser`) in `docs`.

2.  **Crea un file `.nojekyll`**: All'interno della nuova cartella `docs`, crea un file vuoto chiamato `.nojekyll`. Questo previene che GitHub Pages ignori file che iniziano con un underscore.

3.  **Commit e Push**: Aggiungi la cartella `docs` al tuo repository, effettua il commit e il push su GitHub.
    ```bash
    git add docs .nojekyll
    git commit -m "Deploy to GitHub Pages"
    git push
    ```

4.  **Configura GitHub Pages**:
    - Vai nelle "Settings" del tuo repository GitHub.
    - Naviga nella sezione "Pages" sulla sinistra.
    - Sotto "Build and deployment", seleziona "Deploy from a branch".
    - Scegli il branch `main` e la cartella `/docs` come sorgente.
    - Salva le modifiche.

Dopo qualche minuto, la tua applicazione sarà disponibile all'indirizzo `https://<TUO_USERNAME>.github.io/<NOME_REPOSITORY>/`.

### Nota sulla Configurazione del Router

Questo progetto è già configurato con la strategia di routing `withHashLocation()`. Questo assicura che la navigazione all'interno dell'applicazione funzioni correttamente su GitHub Pages senza che si verifichino errori 404 quando si ricarica la pagina.
