# infobot
Manage multiple Discord applications (bots) to change nickname/status to display information obtained by definable API endpoints.

Currently, bot informatio needs to be added manually by sqlite.  A /command driven interface for adding bots is in the works.

To install:
- Rename config.json.example to config.json and edit as needed. API keys will be required for any APIs that require it (livecoinwatch, coinmarketcap, etc). Enter a webhook URL to use for bot notifications. Only errors and major problems are reported. The console contains the bulk of the logging.
- Create an application/bot on Discord and create an entry in the SQLite database.

Directories:
- apis/ - Holds individual .js files for each API used. Each API must have:
  - timer: how many seconds to refresh the API fetch
  - getUpdate: a method that returns an object with username and status elements (used by the handler to update the username and status on discord)
  - alternatively, the following can be set:
    - status: false - to skip during loading
    - group_fetch: true - only if an API endpoint is fetching data for multiple bots (see coingecko.js and minerstat.js for examples)
    - groupUpdate -  a method that is called when group_fetch is true; generally updates a module object that getUpdate can use
- bots/ - Holds individual .js files for each bot type. Each bot definition must have:
  - name - for logging purposes, mainly
  - status - set to false to skip loading
  - Bot - Sequelize model definition


Requires:
  - discord.js - 14.7.1
  - sequelize - 6.28.0
  - sqlite3 - 5.1.4
