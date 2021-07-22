import { TemplateId } from "../types/enum/TemplateId";
import * as handlebars from 'handlebars';
import mainLayout from "./layout/main";
import offerWithoutAnswersTemplate from "./offerWithoutAnswers";
import offerWithAnswersTemplate from "./offerWithAnswers";
import hotlineTemplate from "./hotline";
import offerHelpTemplate from "./offerHelp";
import askForHelpTemplate from "./askForHelp";

export default {
  [TemplateId.TemplateForOffersWithoutAnswers]: handlebars.compile(mainLayout)({ body: offerWithoutAnswersTemplate }),
  [TemplateId.TemplateForOffersWithAnswers]: handlebars.compile(mainLayout)({ body: offerWithAnswersTemplate }),
  [TemplateId.TemplateForHotlineContact]: handlebars.compile(mainLayout)({ body: hotlineTemplate }),
  [TemplateId.TemplateForOfferHelp]: handlebars.compile(mainLayout)({ body: offerHelpTemplate }),
  [TemplateId.TemplateForAskForHelp]: handlebars.compile(mainLayout)({ body: askForHelpTemplate }),
};
