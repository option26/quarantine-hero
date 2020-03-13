import { Link } from 'react-router-dom';
import React from 'react';

export default function FAQ () {

  return (<div>
      <div className="mt-4">
          <p className="text-2xl font-semibold">Hier werden deine wichtigsten Fragen beantwortet!</p>
          <p className="text-xl font-semibold mt-2">Wie läuft das ganze ab?</p>
          <p className="mt-1">Auf quarantänehelden.de findest du Anfragen von Personen, die etwas benötigen. Du kannst dir Anfrangen in deiner Nähe anzeigen lassen und Diese beantworten. Wir leiten deine Nachricht dann an den Anfragensteller weiter der dann zu dir Kontakt aufnimmt. Dann könnt ihr alles weitere wie Details zur Anfrage und Übergabe Zeit und Ort klären.</p>
          <p className="text-xl font-semibold mt-2">Welche Art von Anfragen kann ich stellen?</p>
          <p className="mt-1">Prinzipiell kann man alle Anfragen stellen, bei der Hilfe von außen benötigt wird. Das kann ein Einkauf der nötigsten Lebensmittel oder ein Botengang oder irgendetwas anderes sein.</p>
          <p className="text-xl font-semibold mt-2">Wie bezahlt man für einen Einkauf?</p>
          <p className="mt-1">Handelt es sich bei der Anfrage um einen Einkauf könnt ihr selbst ausmachen wir ihr die Bezahlung des Einkaufs handhabt. Eine Möglichkeit wäre, das Geld über Paypal zu senden.</p>
          <p className="text-xl font-semibold mt-2">Wer kann meine Hilfeanfrage sehen?</p>
          <p className="mt-1">Deine Anfrage und eine ungefährer Ort ist öffentlich einsehbar. Dein Name und deine Emailadresse ist nicht einsehbar.</p>
          <p className="text-xl font-semibold mt-2">Wie nehmen Helfer Kontakt zu mir auf?</p>
          <p className="mt-1">Helfer können auf unser Webseite <Link to="/">hier</Link> nach Anfragen in ihrer Nähe suchen. Dann kann man auf die ausgewählte Anfrage klicken und im Formular ein Email an die Person in Quarantäne schicken.</p>
          <p className="text-xl font-semibold mt-2">Was muss man bei einer Übergabe beachten?</p>
          <p className="mt-1">Bitte achtet bei einer Übergabe, dass es keine Kontakt zwischen einer Person in Quarantäne und der Helfenden Person gibt. Ihr könnt zum Beispiel etwas vor die Tür legen und dann anrufen, dass es da ist.</p>
          <p className="text-xl font-semibold mt-2">Werde ich dafür bezahlt?</p>
          <p className="mt-1">Nein. Das Helfen findet auf freiwilliger Basis statt.</p>
          <p className="text-xl font-semibold mt-2">Was ist mit meiner Sicherheit?</p>
          <p className="mt-1">Bitte stelle stets deine eigene Sicherheit an erste Stelle und vermeide direkten Kontakt.</p>
          <p className="text-xl font-semibold mt-2">Wieso soll ich das tun?</p>
          <p className="mt-1">Wir sind alle Menschen. Besonders in schwierigen Zeiten müssen wir zusammen halten. Helfe deinen Nachbarn in Quarantäne und ermögliche so eine best mögliche Einschränkung des Viruses.</p>
          <p className="text-xl font-semibold mt-2">Wie weiß ich, dass die Person wirklich in Quarantäne ist?</p>
          <p className="mt-1">Unsere Plattform funktioniert nur über die Ehrlichkeit der Nutzer. Wenn du dir unsicher bist, kannst du das dem Anfragesteller mitteilen und zum Beispiel ein Attest erfragen.</p>
          <p className="text-xl font-semibold mt-2">Wie euch unterstützen?</p>
          <p className="mt-1">Schau einfach mal ob einer deiner Nachbarn Hilfe benötigt!</p>
          <p className="text-xl font-semibold mt-2">Wer seid ihr?</p>
          <p className="mt-1">Wir sind eine Florian, Henrike und Keno, eine Gruppe von Freunden, die mit diesem kleine Projekt Menschen helfen möchten.</p>

      </div>
    </div>
  );
}
