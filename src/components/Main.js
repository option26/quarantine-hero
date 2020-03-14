import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import FilteredList from './FilteredList';

export default function Main () {

  return (
    <div className="flex items-center flex-col">
      <div className="phone-width">
        <div className="font-main flex text-white">
          <img src={(require('../assets/logo_main.png'))}/>
        </div>
        <div className="flex text-center font-teaser justify-center w-full">
          Wir sind Menschen.<br/>
          In Zeiten der Not helfen wir uns.<br/>
          Sei ein Teil davon.<br/>
        </div>
        <div className="flex justify-around my-6">
          <Link to="/overview" className="flex justify-center items-center rounded text-white py-3 pl-1 pr-3 btn-main bg-secondary"><img className="w-8 mr-1"  src={require('../assets/hero.png')} />ICH MÖCHTE HELFEN</Link>
          <Link to="/signup" className="flex justify-center items-center rounded text-white py-3 pl-1 px-3 btn-main bg-primary"><img className="w-8"  src={require('../assets/need_help.png')} />ICH BRAUCHE HILFE</Link>
        </div>
        <p className="p-4 mb-16 font-open-sans leading-6">
          Viele Menschen befinden sich aktuell freiwillig oder notwendigerweise in <strong>häuslicher Quarantäne</strong>. Wenn ihr diesen Menschen
          helfen wollt, könnt
          ihr hier sehen, wobei ihr eure Mitmenschen in eurer Nachbarschaft unterstützen könnt!<br/>
          <br/>
          Wenn ihr gerade in häuslicher Quarantäne seid und Unterstützung
          bei <strong>Einkäufen</strong>, <strong>Botengängen</strong> oder <strong>Gassigehen</strong> mit dem Hund benötigt könnt ihr
          das hier euren Mitmenschen mitteilen!
        </p>
        <div className="flex justify-center w-full">
          <div className="arrow-down">
          </div>
        </div>
      </div>

      <div className="angle-cut-background pt-24 w-full flex items-center flex-col">
        <div className="phone-width p-4">
          <FilteredList />
        </div>
      </div>
    </div>
  );
}

