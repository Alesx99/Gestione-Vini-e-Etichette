
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

## Deploy Automatico su GitHub Pages

Questo repository è configurato per il **deploy automatico** tramite GitHub Actions. Ogni volta che effettui un `push` sul branch `main`, il processo di build e deploy viene eseguito automaticamente.

### Configurazione Iniziale (da fare una sola volta)

Prima che il deploy automatico possa funzionare, devi configurare le impostazioni del tuo repository su GitHub:

1.  **Vai nelle "Settings"** del tuo repository GitHub.
2.  **Naviga nella sezione "Pages"** sulla sinistra.
3.  Sotto "Build and deployment", alla voce "Source", seleziona **"Deploy from a branch"**.
4.  Sotto "Branch", seleziona il branch **`gh-pages`** e la cartella **`/(root)`**.
    *   **Nota**: Il branch `gh-pages` verrà creato automaticamente dal nostro workflow al primo `push` sul `main`. Se non lo vedi subito, effettua una piccola modifica, committala e pushala per attivare il processo.
5.  **Salva le modifiche**.

Dopo aver salvato, il tuo sito sarà pubblicato. Ogni `push` successivo sul branch `main` aggiornerà automaticamente il sito live in pochi minuti. L'applicazione sarà disponibile all'indirizzo `https://<TUO_USERNAME>.github.io/<NOME_REPOSITORY>/`.
