# Store & Share Files PWA

Store & Share Files è un'applicazione web progressiva per l'archiviazione e la condivisione fra dispositivi di file. L'app supporta l'autenticazione (login o signup), il caricamento di molti tipi di documenti e la visualizzazione (anteprima disponibile sono su PDF); disponibile pagina offline, notifiche all'upload di un documento e installazione.

## URL di Destinazione

[Accedi all'app](https://store-and-share-files-pwa.web.app)
<br>

## Installazione

### Clona il repository

```sh
$ git clone https://github.com/DavideDeLeonardis/Store-and-share-files-PWA_Progetto-SAW.git
$ cd store-and-share-files-pwa
```

### Installa le dipendenze

```sh
$ npm install
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

## TEST

Email: test@progettosaw.com

Password: progettosaw
