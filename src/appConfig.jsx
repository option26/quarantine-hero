const baseUrl = process.env.REACT_APP_BASE_URL;
const maxAllowedRequestForHelp = Number.parseInt(process.env.REACT_APP_MAXIMUM_ALLOWED_REQUESTS_FOR_HELP, 10);
const moreHelpRequestCooldownDays = Number.parseInt(process.env.REACT_APP_MORE_HELP_REQUEST_COOLDOWN_DAYS, 10);
// eslint-disable-next-line import/prefer-default-export
export { baseUrl, maxAllowedRequestForHelp, moreHelpRequestCooldownDays };
