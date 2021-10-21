import { TemplateId } from '../types/enum/TemplateId';
import * as handlebars from 'handlebars';
import mainLayout from './layout/main';
import offerWithoutAnswersTemplate from './offerWithoutAnswers';
import offerWithAnswersTemplate from './offerWithAnswers';
import hotlineTemplate from './hotline';
import offerHelpTemplate from './offerHelp';
import askForHelpTemplate from './askForHelp';

const compiledMainLayout = handlebars.compile(mainLayout);

/*
 * Basic process for handlebars
 * HTML --compile--> Template
 * Here the main layout is first filled with the respective templates ( HTML --> Template --> HTML)
 * Then this results in HTML and is compiled again to a handlebars template ( HTML --> Template)
 * So the full process looks like (HTML --> Template --> HTML --> Template)
 */

export default {
  [TemplateId.TemplateForOffersWithoutAnswers]: handlebars.compile(compiledMainLayout({ body: offerWithoutAnswersTemplate })),
  [TemplateId.TemplateForOffersWithAnswers]: handlebars.compile(compiledMainLayout({ body: offerWithAnswersTemplate })),
  [TemplateId.TemplateForHotlineContact]: handlebars.compile(compiledMainLayout({ body: hotlineTemplate })),
  [TemplateId.TemplateForOfferHelp]: handlebars.compile(compiledMainLayout({ body: offerHelpTemplate })),
  [TemplateId.TemplateForAskForHelp]: handlebars.compile(compiledMainLayout({ body: askForHelpTemplate })),
};
