# Guild War Tracker

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
![Dependencies](https://img.shields.io/david/rezwanhaleem/guild-war-tracker)
![GitHub repo size](https://img.shields.io/github/repo-size/rezwanhaleem/guild-war-tracker)
![GitHub package.json version](https://img.shields.io/github/package-json/v/rezwanhaleem/guild-war-tracker)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/rezwanhaleem/guild-war-tracker)
![GitHub issues](https://img.shields.io/github/issues/rezwanhaleem/guild-war-tracker)

![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/rezwanhaleem/guild-war-tracker)

# Demo

[Guild War Tracker](https://guild-war-tracker.herokuapp.com/) <- Demo hosted on [Heroku](https://www.heroku.com/)

Please give the link above a few seconds to load the page. It is running on a free tier of Heroku.

![Demo Image](https://i.imgur.com/2RbK3ND.png)

## Description

A personalized web app that updates player status on [Google Sheets](https://www.google.com/sheets/about/). This app relies on [React JS](https://reactjs.org/) as the front end and [Express JS](https://expressjs.com/) as the backend. It also utilizes [Google Sheets API](https://developers.google.com/sheets/api/) with the help of [google-spreadsheet](https://www.npmjs.com/package/google-spreadsheet) npm package.

# Usage

Due to this being a personal web app, signing into Google only authorizes edits on a private Google Sheet.
However, the app is able to modify a [public Google Sheet](https://docs.google.com/spreadsheets/d/1o6IVqf_DOEb-Y8JiiQIlXAWl9tPuKknbLAKP5HUZH4w/) allowing the app to be function with logging in.

### Step 1 - Load Data

Press the "Load Data" button to retrieve the player info from the public Google Sheet.

![Step 1](https://i.imgur.com/Qo2Lssw.png)

### Step 2 - Choose the day of the week to which changes will be made

Press either Monday, Wednesday or Friday to make changes to the corresponding columns in the public Google Sheet

![Step 2](https://i.imgur.com/DyXHMjc.png)

### Step 3 (Optional) - Auto Scroll Option

This option allows you to quickly make changes as it switches to the next player automatically when the status of a player is entered( Details in Step 4).

![Step 3](https://i.imgur.com/P1WPOGD.png)

### Step 4 - Make changes

After pressing the "Continue" button, you will be shown a page where you can enter status for each player one after the other. At the top their is a slidable progress bar with 3 cards below it denoting the possible player status selections.

You can click, or press 1,2 or 3 on the keyboard to choose. This also works with the keys F, N and B.

Clicking the left or right arrow on the sides of the Card Carousel allows you to switch players as well.

This can also be acheived by press the left and right arrow buttons on your keyboard.

![Step 4](https://i.imgur.com/5KaX8YO.png)

### Step 5 - Choose the days to upload

Once all the players have been enter, clicking the right arrow takes you to the upload page (This happens automatically if the Auto Scrool option is on).

Now you can choose which day changes you want to upload to the Google Sheets.

![Step 5](https://i.imgur.com/NBYZdMj.png)

### Step 6 (Final Step) - upload

Finally, you can upload your changes by clicking the "Upload" button. 

After successful upload, the page will allow you to open the Google Sheet in another tab to confirm changes done.

![Step 6](https://i.imgur.com/YvizxEF.png)


# Contributions

As this is a personal web app, contribution are welcome from any members of the Guild.

## Prerequisites

[Node >= v12.18.1](https://nodejs.org/en/)

[npm >= v6.14.5](https://www.npmjs.com/)

## Installation

After cloning/downloading the repo, enter the project directory and run

`yarn install` 

or

`npm install`


### Testing only Front end

To only test the React server run:

`yarn up`

or

`npm up`

### Testing Everything

Before running the backend, environment variables need to be set. 
Create a file named `.env` in the root directory and fill it with:

```
GOOGLE_CLIENT_ID=<---Google Service Account Client ID--->
GOOGLE_CLIENT_EMAIL=<---Google Service Account Email--->
GOOGLE_PRIVATE_KEY_ID=<---Google Service Account Key ID--->
GOOGLE_PRIVATE_KEY=<---Google Service Account Private Key--->
GOOGLE_CLIENT_CERT=<---Google Service Account Cert--->
GOOGLE_OAUTH_CLIENT_ID=<---Google OAuth Client ID--->
GOOGLE_OAUTH_CLIENT_SECRET=<---Google OAuth Client Secret--->
GOOGLE_OAUTH_REDIRECT_URL=http://localhost:3000/
GOOGLE_AUTHORIZED_ACCOUNTS=<---Email addresses that allow connection to your private Google Sheet--->
GOOGLE_OPEN_SPREADSHEET_ID=<---Spreadsheet ID of public Google Sheet--->
GOOGLE_SPREADSHEET_ID=<---Spreadsheet ID of private Google Sheet--->

```
All the environment variables above related to your Google Service Account can be found from the `credentials.json` file when you create the Service Account.

Spreadsheet ID can found from the link of the Google Sheet:

```
    docs.google. com/spreadsheets/d/<---Spreadsheet ID--->/edit
```


Now to finally start & test both the backend (Express JS) and the front end React server run:

`yarn dev`

or

`npm dev`


# License

This library is licensed under MIT. Full license text is available in [LICENSE](https://github.com/rezwanhaleem/guild-war-tracker/blob/develop/LICENSE.txt).