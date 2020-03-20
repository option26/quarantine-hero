import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import FilteredList from '../components/FilteredList';
import Footer from '../components/Footer';
import fb from '../firebase';

export default function Main () {

  function scrollTo () {
    const el = document.getElementById('anfragen');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const [stats, setStats] = useState({
    regionSubscribed: 0,
    offerHelp: 0,
    askForHelp: 0,
  });

  useEffect(() => {
    const getStats = async () => {
      setStats((await fb.store.collection('stats').doc('external').get()).data());
    };
    getStats();
  }, []);

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
        <div className="w-full flex justify-center  mt-4 md:mt-12">
          <div className="bg-primary -mb-8 rounded-full bg-red-500 w-48 text-center text-xs text-white font-bold py-2 font-open-sans">
            WICHTIGER HINWEIS
          </div>
        </div>
        <div className="m-4 md:m-0 md:mt-4 font-open-sans md:mb-4 pl-0 md:pr-4 flex flex-col justify-center md:flex-row bg-kaki py-4 md:pt-10">
          <div className="flex flex-1 px-3 justify-between items-center flex-row md:flex-col mt-4 md:mt-0 md:text-center">
            <img className="pr-5 pl-2 md:pl-0 md:pr-0 md:mb-4 w-30 h-10 md:h-16" src={require('../assets/lokal.svg')} alt=""/>
            <div className="flex-grow">
              <div className="font-bold">Lokal</div>
              <p>
                Helft in eurer Nachbarschaft, zum Beispiel euren Haus-Mitbewohner*innen.
              </p></div>
          </div>
          <div className="flex flex-1 px-3 justify-between items-center flex-row md:flex-col mt-4 md:mt-0  md:text-center">
            <img className="pr-5 pl-2 md:pl-0 md:pr-0 md:mb-4 w-30 h-10 md:h-16" src={require('../assets/konsistent.svg')} alt=""/>
            <div className="flex-grow">
              <div className="font-bold">Konsistent</div>
              <p>
                Helft wenigen, aber das konsistent. Sucht euch zum Beispiel eine Familie und helft nur dieser.
              </p></div>
          </div>
          <div className="flex flex-1 px-3 justify-between items-center flex-row md:flex-col mt-4 md:mt-0 md:text-center">
            <img className="pr-5 pl-2 md:pl-0 md:pr-0 md:mb-4 w-30 h-10 md:h-16" src={require('../assets/distanziert.svg')} alt=""/>
            <div className="flex-grow">
              <div className="font-bold">Distanziert</div>
              <p>
                Trefft euch nicht mit anderen Menschen außer denen, denen ihr helfen wollt und habt <span
                className="font-bold">KEINEN</span> Kontakt mit
                Personen in Quarantäne!
              </p></div>
          </div>
        </div>

      <div className="mt-4 md:ml-0 md:mr-0 ml-4 mr-4 mb-8 md:mb-16 p-4 flex md:flex-row justify-start items-center bg-kaki ">
          <img className="w-30 h-10 " src={require('../assets/aushang.svg')} alt=""/>
          <p>Nicht jeder Mensch hat Internet. <br className="sm:hidden"/>
            Drucke <a href='/assets/aushang.pdf' className="text-secondary hover:underline" download="/assets/aushang.pdf">diesen Aushang</a></p>
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

        <div className="p-4 font-open-sans flex flex-col md:flex-row space-between md:p-0 mb-4 md:mb-8">
          <p className="mb-4 md:leading-7 md:text-justify flex-1">
            Viele Menschen befinden sich aktuell freiwillig oder notwendigerweise in <strong>häuslicher
            Quarantäne</strong>. Wenn ihr diesen Menschen
            helfen wollt, könnt
            ihr hier sehen, wobei ihr eure Mitmenschen in eurer Nachbarschaft unterstützen könnt!
          </p>
          <div className="md:m-4">
          </div>
          <p className="md:leading-7 md:text-justify flex-1">
            Wenn ihr gerade in häuslicher Quarantäne seid und Unterstützung
            bei <strong>Einkäufen</strong>, <strong>Botengängen</strong> oder <strong>Gassigehen</strong> mit dem Hund
            benötigt könnt ihr
            das hier euren Mitmenschen mitteilen!
          </p>
        </div>
        <div className="flex justify-center w-full" onClick={scrollTo}>
          <img alt="arrow-down" className="arrow-down" src={require('../assets/arrow_down.png')}/>
        </div>
      </div>
      <div className="angle-cut-background pt-16 w-full">
        <div className="p-4">
          <div className="flex justify-center items-center flex-col">
            <div className="font-teaser text-center" id="anfragen">
              Aktuelle Anfragen
            </div>
            <div className="flex my-6">
              <div className="mx-4 md:mx-8 w-24 text-center">
                <div className="font-bold text-xs font-open-sans">ANFRAGEN</div>
                <div className="font-open-sans text-3xl font-light">{stats.askForHelp}</div>
              </div>
              <div className="mx-4 md:mx-8 w-24 text-center">
                <div className="font-bold text-xs font-open-sans">HELDEN</div>
                <div className="font-open-sans text-3xl font-light">{stats.regionSubscribed}</div>
              </div>
              <div className="mx-4 md:mx-8 w-24 text-center">
                <div className="font-bold text-xs font-open-sans">NACHRICHTEN</div>
                <div className="font-open-sans text-3xl font-light">{stats.offerHelp}</div>
              </div>
            </div>
            <div className="font-open-sans leading-6 text-center mb-8 max-w-360">
              Gib deine Postleitzahl ein, um hilfesuchende Menschen in deinem Umkreis zu finden.
            </div>
          </div>
          <FilteredList pageSize={20}/>
        </div>
        <Footer/>
      </div>
    </div>
  );
}

