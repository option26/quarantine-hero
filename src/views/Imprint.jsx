import React from 'react';

export default function Imprint() {
  return (
    <div>
      <div className="mt-4 p-4">
        <div className="impressum">
          <strong>Impressum</strong>
          <p>Angaben gemäß § 5 TMG</p>
          <br />
          <p>
            Tom Graupner &amp; Keno Dreßel
            <br />
            Andreas-Schubert-Str. 23
            <br />
            A-Gebäude
            <br />
            01069 Dresden
          </p>
          <br />
          <p>
            <strong>Vertreten durch:</strong>
            <br />
            Keno Dreßel
            <br />
            Henrike von Zimmermann
            <br />
            Florian Schmidt
            <br />
          </p>
          <br />
          <p>
            <strong>Kontakt:</strong>
            <br />
            Telefon: 089-35627565
            <br />
            E-Mail:
            {' '}
            <a href="mailto:help@quarantaenehelden.org" className="text-secondary hover:underline">help@quarantaenehelden.org</a>
          </p>
          <br />
          <p>
            <strong>Haftung für Inhalte</strong>
            <br />
            <br />
            Als Diensteanbieter*innen sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
            allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter*innen jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
            forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            <br />
            <br />
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
            bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
            konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
            Inhalte umgehend entfernen.
            <br />
            <br />
            <strong>Haftung für Links</strong>
            <br />
            <br />
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
            Seiten sind stets die jeweilige Anbieter*innen oder Betreiber*innen der Seiten verantwortlich. Die
            verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
            Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            <br />
            <br />
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
            Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links
            umgehend entfernen.
            <br />
            <br />
            <strong>Urheberrecht</strong>
            <br />
            <br />
            Die durch die Seitenbetreiber*innen erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
            Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung der jeweiligen Autor*innen bzw.
            Ersteller*innen. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch
            gestattet.
            <br />
            <br />
            Als Betreiber*innen möchten wir darauf hinweisen, dass der Quellcode dieser Website als Open Source Projekt
            unter folgender Adresse veröffentlicht wurde:&nbsp;
            <a
              className="text-secondary hover:underline block"
              href="https://github.com/option26/quarantine-hero"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/option26/quarantine-hero
            </a>
            <br />
            Soweit die Inhalte auf dieser Seite nicht von den Betreiber*innen erstellt wurden, werden die Urheberrechte Dritter
            beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
            Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </div>
      </div>
    </div>
  );
}
