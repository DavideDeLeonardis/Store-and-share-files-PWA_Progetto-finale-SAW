# Store & Share Files PWA

Store & Share Files è un'applicazione web progressiva per l'archiviazione di file. Previa autenticazione, l'app supporta il caricamento di molti tipi di documenti e la visualizzazione di essi (anteprima disponibile solo su PDF); disponibile pagina offline, installazione e notifiche all'upload di un documento.

## URL di Destinazione

[Accedi all'app](https://store-and-share-files-pwa.web.app)
<br>

## Installazione

### Clona il repository

```sh
$ git clone https://github.com/DavideDeLeonardis/Store-and-share-files-PWA_Progetto-SAW.git
$ cd Store-and-share-files-PWA_Progetto-SAW
```

### Configura Firebase

Crea un file `.env` nella root del progetto e aggiungi le credenziali Firebase:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Installa le dipendenze

```sh
$ npm install
```

### Avvia il server di sviluppo

```sh
$ npm start
```

<br>

## Deploy

```sh
$ npm run build
```

```sh
$ firebase deploy
```

<br>

## Credenziali di Test

Email: test@progettosaw.com
<br>
Password: progettosaw
