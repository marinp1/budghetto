/*
 * Footer Messages
 *
 * This contains all the text for the Footer component.
 */
import { defineMessages } from 'react-intl';

const copyrightSymbol = String.fromCharCode(169);

export default defineMessages({
  copyright: {
    id: 'budghetto.components.Footer.copyright.message',
    defaultMessage: `${copyrightSymbol} Budghetto team 2017`,
  },
});
