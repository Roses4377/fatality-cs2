FATALITY — strona CS2 z galerią Medal.tv sterowaną WYŁĄCZNIE przez właściciela

WAŻNE — OGRANICZENIE DODAWANIA:
- Tylko jedno konto Discord wskazane w ADMIN_DISCORD_USER_ID może dodawać klipy.
- Wiadomości innych osób są ignorowane, nawet jeśli wkleją link na kanale #klipy-cs2.
- Nie ma publicznego formularza dodawania klipów na stronie.
- Bot nie używa bazy danych. Lista klipów jest przechowywana w lokalnym pliku clips.json.
- Każdy odwiedzający stronę może oglądać klipy, ale nie może ich dodawać.

JAK DODAĆ KLIP:
1. Kanał jest już ustawiony w konfiguracji na ID: 1569517814199353526.
2. Zaloguj się na swoje konto Discord.
3. Na kanale o ID 1569517814199353526 wklej publiczny link Medal.tv.
4. Bot doda klip do galerii i zareaguje ✅.
5. Odświeżenie galerii na stronie następuje automatycznie co 30 sekund.
6. Aby usunąć klip, usuń swoją wiadomość z linkiem na kanale.

KONFIGURACJA — WYMAGANA:
1. Wejdź na https://discord.com/developers/applications i utwórz aplikację oraz bota.
2. Skopiuj token bota. W ustawieniach Bot włącz MESSAGE CONTENT INTENT.
3. Dodaj bota na serwer FATALITY z uprawnieniami:
   View Channels, Read Message History, Send Messages, Add Reactions.
4. W Discordzie włącz Ustawienia użytkownika -> Zaawansowane -> Tryb dewelopera.
5. Kliknij prawym na swój profil Discord -> Kopiuj identyfikator użytkownika.
6. Skopiuj ID kanału #klipy-cs2 (prawy klik na kanale -> Kopiuj identyfikator).
7. Zmień nazwę .env.example na .env i wpisz:
   DISCORD_TOKEN=token_bota
   CLIP_CHANNEL_ID=1569517814199353526  (już ustawione w .env.example)
   ADMIN_DISCORD_USER_ID=twoje_id_uzytkownika
8. Zainstaluj Node.js 18+.
9. W terminalu w folderze projektu uruchom:
   npm install
   npm start
10. Strona działa lokalnie pod adresem http://localhost:3000.

BEZ BAZY DANYCH:
Klipy są zapisywane w pliku clips.json (zwykły plik JSON, nie baza danych).
Na hostingu musi być trwały dysk/volume, aby clips.json nie znikał po restarcie lub ponownym wdrożeniu.
Do działania publicznej strony i bota potrzebny jest serwer Node.js. Sam hosting statyczny nie wystarczy.

BEZPIECZEŃSTWO:
- Nie wysyłaj nikomu tokenu bota ani nie commituj pliku .env do publicznego repozytorium.
- Nie wpisuj tokenu w index.html ani script.js.
- Uprawnienia do dodawania wynikają z dokładnego Discord User ID, a nie nazwy użytkownika.
- Administrator serwera nie może zmienić tego ograniczenia bez dostępu do konfiguracji serwera/bota.

OBSŁUGIWANE FORMATY LINKÓW:
- https://medal.tv/clip/ID
- https://medal.tv/clips/ID
- https://medal.tv/games/counter-strike-2/clips/ID?invite=...

Pliki:
index.html — strona
style.css — wygląd
script.js — publiczna galeria
server.js — serwer i bot z kontrolą właściciela
clips.json — lokalny plik z klipami
.env.example — wzór konfiguracji

Discord FATALITY: https://discord.gg/Ux3jCAQJMT
