import {Link} from 'react-router-dom';
import React from 'react';
import '../styles/App.css';
import FilteredList from './FilteredList';
import Footer from './Footer';
import fb from '../firebase';

export default function Main() {

  function scrollTo() {
    const el = document.getElementById("anfragen");
    if (el) {
      el.scrollIntoView({behavior: 'smooth'})
    }
  }

  return (
    <div className="flex items-center flex-col">
      <div className="phone-width">
        <div className="font-main flex md:hidden text-white ">
          <img className="logo-margin" src={(require('../assets/logo.svg'))} alt="logo"/>
        </div>
        <div className="flex text-center font-teaser justify-center w-full my-8 md:my-10">
          Wir sind Menschen.<br/>
          In Zeiten der Not helfen wir uns.<br/>
          Sei ein Teil davon.<br/>
        </div>
        <div className="flex justify-around my-6 px-2 md:px-0 md:my-10 w-full">
          <Link to="/overview"
                className="flex justify-center items-center rounded text-white py-3 pl-1 pr-3 btn-main bg-secondary md:flex-1 hover:opacity-75"
                onClick={() => fb.analytics.logEvent('button_want_to_help')}>
            <img className="w-8 mr-1" src={require('../assets/hero.png')} alt=""/>ICH MÖCHTE HELFEN</Link>
          <div className="m-1 md:m-4">
          </div>
          <Link to="/signup"
                className="flex justify-center items-center rounded text-white py-3 pl-1 px-3 btn-main bg-primary md:flex-1 hover:opacity-75"
                onClick={() => fb.analytics.logEvent('button_need_help')}>
            <img className="w-8" src={require('../assets/need_help.png')} alt=""/>ICH BRAUCHE HILFE</Link>
        </div>
        <div className="p-4 bg-yellow-100 rounded border font-open-sans mb-4 md:mb-8">

          <h1 className="text-2xl mb-4">Wichtiger Hinweis!</h1>
          <p>Generell gilt es in diesen Tagen, den Kontakt zwischen Menschen so stark wie möglich zu reduzieren. Das
            heißt
            leider auch, dass überbordender Aktionismus hier potentiell Schaden anrichten kann: wenn ein infizierter
            Mensch in vielen Haushalten hilft, läuft er Gefahr die Krankheit stärker zu verbreiten als wenn er (der
            Mensch) seinem normalen Verhalten nachgeht.
          </p>

          <ol>
            <li className="mb-2 mt-4">1. Helft lokal, das heißt z.B. euren Nachbar*innen.</li>
            <li className="mb-2">2. Helft wenigen, aber das konsistent. Wenn ihr z.B. babysitten wollt, sucht euch eine Familie und
              helft nur dieser Familie.
            </li>
            <li className="mb-4">3. Trefft euch nicht mit anderen Menschen außer denen, denen ihr helfen wollt.</li>
          </ol>

          <p>
            Wenn ihr Quarantäneheld*innen seid oder sein möchtet, probiert nicht möglichst vielen anderen zu helfen,
            sondern reduziert die Kontakte auf das absolute
            Minimum und helft konsistent. Weniger ist mehr!
          </p>

        </div>
        <div className="p-4 mb-16 font-open-sans flex flex-col md:flex-row space-between md:p-0">
          <p className="mb-4 md:leading-7 md:text-justify flex-1">
            Viele Menschen befinden sich aktuell freiwillig oder notwendigerweise in <strong>häuslicher
            Quarantäne</strong>. Wenn ihr diesen Menschen
            helfen wollt, könnt
            ihr hier sehen, wobei ihr eure Mitmenschen in eurer Nachbarschaft unterstützen könnt!
          </p>
          <div className="md:m-4">
          </div>
          <p className=" md:leading-7 md:text-justify flex-1">
            Wenn ihr gerade in häuslicher Quarantäne seid und Unterstützung
            bei <strong>Einkäufen</strong>, <strong>Botengängen</strong> oder <strong>Gassigehen</strong> mit dem Hund
            benötigt könnt ihr
            das hier euren Mitmenschen mitteilen!
          </p>
        </div>

        <div className="flex justify-center w-full" onClick={scrollTo}>
          <img className="arrow-down" src={require('../assets/arrow_down.png')}/>
        </div>
      </div>
      <div className="angle-cut-background pt-16 w-full">
        <div className="p-4">
          <div className="flex justify-center items-center flex-col">
            <div className="font-teaser text-center" id="anfragen">
              Aktuelle Anfragen
            </div>
            <div className="font-open-sans leading-6 text-center mb-8 max-w-360">
              Gib deine Postleitzahl ein, um hilfesuchende Menschen in deinem Umkreis zu finden.
            </div>
          </div>
          <FilteredList/>
          <div className="flex justify-center items-center">
            <Link to="/overview" className="btn-green">
              ALLE ANFRAGEN
            </Link>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
}

