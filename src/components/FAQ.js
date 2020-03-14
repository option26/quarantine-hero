import {Link} from 'react-router-dom';
import React from 'react';
import Footer from './Footer';

export default function FAQ() {

    return (<div className="mb-10">
            <h1 className="text-2xl font-main mt-8">Hier werden deine wichtigsten Fragen beantwortet!</h1>

            <h2 className="text-xl font-teaser mt-8">Wie funktioniert quarantänehelden.org?</h2>

            <p className="font-open-sans">Auf der Plattform quarantänehelden.org kommen Menschen zusammen, die sich gegenseitig unterstützen. Hier
                findest du Anfragen von Personen, die etwas benötigen, aber selbst ihr Zuhause oder ihren Quarantäne-Ort
                nicht verlassen können. Du kannst dir Anfragen in deiner Nähe anzeigen lassen und diese beantworten. Wir
                leiten deine Nachricht an den/die Anfragensteller*in weiter, die dann zu dir Kontakt aufnehmen. Dann könnt ihr
                alle weiteren Details zur Anfrage (was wird benötigt, wann und wo?) klären.</p>

            <h2 className="text-xl font-teaser mt-8">Welche Art von Anfragen kann ich stellen?</h2>

            <p className="font-open-sans">Prinzipiell können alle Anfragen gestellt werden, bei denen Hilfe von außen benötigt wird. Das kann ein
                Einkauf der nötigsten Lebensmittel, ein Botengang, eine Erledigung oder das Gassigehen mit dem Hund
                sein.</p>

        <h2 className="text-xl font-teaser mt-8">Wie wird für den Einkauf bezahlt?</h2>

        <p className="font-open-sans">Handelt es sich bei der Anfrage um einen Einkauf, könnt ihr selbst ausmachen, wie ihr die Bezahlung des
          Einkaufs handhabt. Eine Möglichkeit wäre, das Geld über Paypal zu senden.</p>

          <h2 className="text-xl font-teaser mt-8">Wie stelle ich sicher, dass ich für einen Einkauf auch das Geld bekomme? Wie kann ich sicher sein, dass ich für mein Geld auch die angefragten Einkäufe bekomme?</h2>

          <p className="font-open-sans">Diese Plattform funktioniert auf Vertrauensbasis. Quarantänehelden kann für die eingestellten Anfragen keine Haftung übernehmen. Bitte sprecht euch vorher gut ab und entscheidet selbst, ob ihr eine Anfrage bearbeiten wollt. Ihr könnt zum Beispiel eure Telefonnummern tauschen. Telefonisch können Absprachen besser getroffen werden. Um Missbrauch zu verhindern, appellieren wir an euren Menschenverstand und eure Ehrlichkeit.</p>




            <h2 className="text-xl font-teaser mt-8">Wer kann meine Hilfeanfrage sehen?</h2>

            <p className="font-open-sans">Deine Anfrage und ein ungefährer Ort sind öffentlich einsehbar. Dein Name und deine Emailadresse sind
                nicht
                einsehbar.</p>

            <h2 className="text-xl font-teaser mt-8">Wie nehmen Helfende Kontakt zu mir auf?</h2>

            <p className="font-open-sans">Helfende können www.quarantaenehelden.org nach Anfragen in ihrer Nähe suchen. Die ausgewählte Anfrage
                wird
                angeklickt. Über ein Formular geht eine Email an die Person in Quarantäne. Sie erhält so eine Nachricht
                von
                dir und ihr könnt alles weitere verabreden.</p>

            <h2 className="text-xl font-teaser mt-8">Was ist bei einer Übergabe z.B. von Einkäufen zu beachten?</h2>

            <p className="font-open-sans">Bitte achtet bei einer Übergabe darauf, dass es keinen Kontakt zwischen einer Person in Quarantäne und
                der
                helfenden Person gibt. Ihr könnt zum Beispiel etwas vor die Tür legen und dann anrufen, dass es da
                ist.</p>

            <h2 className="text-xl font-teaser mt-8">Werde ich dafür bezahlt?</h2>

            <p className="font-open-sans">Nein. Das Helfen findet auf freiwilliger Basis statt.</p>

            <h2 className="text-xl font-teaser mt-8">Was ist mit meiner Sicherheit?</h2>

            <p className="font-open-sans">Bitte stelle stets deine eigene Sicherheit an erste Stelle und vermeide direkten Kontakt zu Menschen in
                der
                Quarantäne.</p>

            <h2 className="text-xl font-teaser mt-8">Wieso soll ich das tun?</h2>

            <p className="font-open-sans">Wir sind eine Gemeinschaft. Besonders in schwierigen Zeiten müssen wir zusammenhalten. Hilf deiner
                Nachbarschaft in ihrer schwierigen Quarantäne-Situation. Du trägst so auch dazu bei, die Verbreitung
                des
                Virus‘ einzuschränken.</p>

            <h2 className="text-xl font-teaser mt-8">Wie weiß ich, dass die Person wirklich in Quarantäne ist?</h2>

            <p className="font-open-sans">Unsere Plattform funktioniert nur über die Ehrlichkeit der Nutzenden. Wenn du dir unsicher
                bist, kannst du
                das dem Anfragesteller mitteilen und zum Beispiel ein Attest erfragen.</p>

            <h2 className="text-xl font-teaser mt-8">Wie kann ich Quarantänehelden unterstützen?</h2>

            <p className="font-open-sans">Schau einfach mal, ob eine Person in deinem Umfeld Hilfe benötigt!</p>

            <h2 className="text-xl font-teaser mt-8">Wer seid ihr?</h2>

            <p className="font-open-sans">Wir sind Andy, Florian, Henrike, Jakob, Julia, Keno, Nicolai und Philipp, eine Gruppe von Freunden, die mit diesem
                Projekt ihren kleinen Beitrag
                leisten und Menschen helfen möchten.</p>

            <h2 className="text-xl font-teaser mt-8">Wie werden Daten verwendet?</h2>

            <p className="font-open-sans">Wenn du eine Anfrage stellt, wird diese Öffentlich (ohne deine E-Mail) an alle Nutzer gezeigt.
              Wenn Du eine Anfrage beantwortest, wird deine Antwort und deine E-Mail Adresse an den Anfragensteller geschickt.</p>
        <Footer />
      </div>
    );
}
