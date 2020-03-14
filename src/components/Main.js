import { HashRouter as Router, Link } from 'react-router-dom';
import React from 'react';
import '../styles/App.css';
import FilteredList from './FilteredList';

export default function Main () {

  return (
    <div className="flex items-center flex-col">
      <div className="phone-width">
        <div className="font-main flex text-white">
          <img src={(require('../assets/logo_main.png'))}/>
        </div>
        <div className="flex text-center font-teaser justify-center w-full md:my-10">
          Wir sind Menschen.<br/>
          In Zeiten der Not helfen wir uns.<br/>
          Sei ein Teil davon.<br/>
        </div>
        <div className="flex justify-around my-6 px-2 md:px-0 md:my-10 w-full">
          <Link to="/overview" className="flex justify-center items-center rounded text-white py-3 pl-1 pr-3 btn-main bg-secondary md:flex-1"><img className="w-8 mr-1"  src={require('../assets/hero.png')} />ICH MÖCHTE HELFEN</Link>
          <div className="m-1 md:m-4">
          </div>
          <Link to="/signup" className="flex justify-center items-center rounded text-white py-3 pl-1 px-3 btn-main bg-primary md:flex-1"><img className="w-8"  src={require('../assets/need_help.png')} />ICH BRAUCHE HILFE</Link>
        </div>
        <p className="p-4 mb-16 font-open-sans flex flex-col md:flex-row space-between md:p-0">
          <p className="mb-4 lg:leading-7 md:text-justify flex-1">
            Viele Menschen befinden sich aktuell freiwillig oder notwendigerweise in <strong>häuslicher Quarantäne</strong>. Wenn ihr diesen Menschen
            helfen wollt, könnt
            ihr hier sehen, wobei ihr eure Mitmenschen in eurer Nachbarschaft unterstützen könnt!
          </p>
          <div className="m-4">
          </div>
          <p className=" lg:leading-7 md:text-justify flex-1">
            Wenn ihr gerade in häuslicher Quarantäne seid und Unterstützung
            bei <strong>Einkäufen</strong>, <strong>Botengängen</strong> oder <strong>Gassigehen</strong> mit dem Hund benötigt könnt ihr
            das hier euren Mitmenschen mitteilen!
          </p>

        </p>
        <div className="flex justify-center w-full">
          <div className="arrow-down">
          </div>
        </div>
      </div>
      <div className="angle-cut-background pt-16 w-full">
        <div className="p-4">
          <div className="flex justify-center items-center flex-col">
            <div className="font-teaser text-center">
              Aktuelle Anfragen
            </div>
            <div className="font-open-sans leading-6 text-center mb-8 max-w-360">
              Gib deine Postleitzahl ein, um hilfesuchende Menschen in deinem Umkreis zu finden.
            </div>
          </div>
          <FilteredList />
          <div className="flex justify-center items-center">
            <button className="btn-green">
              ALLE ANFRAGEN
            </button>
          </div>
        </div>
        <div className="flex justify-center text-sm text-gray-700 mb-4 mt-8">
          <Link to="/faq">FAQ's</Link>
          <div className="px-1">|</div>
          <Link to="/impressum">Impressum</Link>
          <div className="px-1">|</div>
          <Link to="/dsgvo">Datenschutz</Link>
        </div>
      </div>
    </div>
  );
}

