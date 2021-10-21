export default `<table class="module preheader preheader-hide" role="module"
       data-type="preheader"
       style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"
       width="100%" cellspacing="0" cellpadding="0" border="0">
    <tbody>
    <tr>
        <td role="module-content">
            <p>Vielen Dank für Deine Hilfsbereitschaft. Kontaktiere Hilfesuchende*n jetzt telefonisch!</p>
        </td>
    </tr>
    </tbody>
</table>
<table class="module" role="module" data-type="text"
       style="table-layout: fixed;"
       data-muid="ea3c9c41-c74d-429c-92c4-eb90a6b4268d"
       data-mc-module-version="2019-10-22" width="100%"
       cellspacing="0" cellpadding="0" border="0">
    <tbody>
    <tr>
        <td style="padding:18px 0px 18px 0px; text-align:inherit; line-height:40px;"
            role="module-content" valign="top" height="100%"
            bgcolor="">
            <div><h1 style="text-align: inherit">Jetzt Hilfesuchende*n telefonisch kontaktieren</h1>
                <div></div>
            </div>
        </td>
    </tr>
    </tbody>
</table>
<table class="module" role="module" data-type="code"
       style="table-layout: fixed;"
       data-muid="2e55d202-a03f-4b39-b18a-6bcf2d718d4e"
       width="100%" cellspacing="0" cellpadding="0" border="0">
    <tbody>
    <tr>
        <td role="module-content" valign="top" height="100%">
            <div style="font-family: inherit; text-align: inherit; line-height: 1.5">Vielen Dank, dass Du Dich bereit erklärst zu helfen! Das <a href="{{{askForHelpLink}}}">Hilfegesuch</a> auf das Du geantwortet hast wurde über unsere Hotline aufgegeben, da die betroffene Person nur telefonisch erreichbar ist. Daher bitten wir Dich, telefonisch Kontakt aufzubauen. Die Kontaktinformationen findest Du in dieser E-Mail.</div>
            <div style="font-family: inherit; text-align: inherit"><br></div>
            <div style="font-family: inherit; text-align: inherit; line-height: 1.5">Telefonnummer: <em>{{{phoneNr}}}</em></div>
            <div style="font-family: inherit"><br></div>
            {{#if comment}}
                <div style="font-family: inherit; line-height: 1.5"><strong>Anmerkungen</strong></div>
                <div style="font-family: inherit; line-height: 1.5"><em>"{{{comment}}}"</em></div>
                <div style="font-family: inherit"><br></div>
            {{/if}}
        </td>
    </tr>
    </tbody>
</table>
`;
