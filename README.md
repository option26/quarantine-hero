# QuarantineHeros
<img src="qhero_icon.png" align="right" width="60"/>
At quarantaenehelden.org we created a platform for people to support those in their community who might need a little extra help during this time of quarantine. The platform connects people who need help or cannot leave their homes, with those in their neighborhood who are able to run errands, deliver groceries, take pets on walks, and other tasks. On our website, you can register to ask for help or to provide help for others. Let's support those in our community!

A project brought to you with :heart: and bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Contributions

As a non-profit project run by volunteers we rely on the support of the open source community. We highly encourage 
contributions and we are trying to make this process as frictionless as possible. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for 
more details.

Everyone is very welcome to create issues, give feedback and contribute to the code base. If you'd like to work on an issue, please mention @tgraupne or @florianschmidt1994 in a comment and we will get in touch with you. We are constantly trying to maintain an up-to-date state of the project reflect in labels, reviews and comments.

## Getting Started

This repository contains the source code of our website, and the following guide explains how to get started and what you need to improve and use this project.

You need the following libraries to get started: `node`, `yarn`, `firebase cli`. So please install them in an appropriate way on your host system. On macOS, you'd also need the `Xcode command line tools`.

Once you've installed those dependencies, run the following inside the project folder

`yarn install`

This will install all JavaScript dependencies.

## Local web development

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode and automatically connects to our test instance of Google"s Firebase.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Testing
Tests are written and executed with [cypress](https://www.cypress.io). All tests are stored in the `/cypress` directory. 
Tests can be run locally in two ways:
- `yarn test` will run the tests immediately in a headless browser and output the results to stdout
- `yarn cypress` will open the cypress UI for interactive testing and test debugging

You need to have your development server running on `localhost:3000` as the tests *will not* start a dev server

When contributing 
please make sure that:

- All new features are covered by some kind of test
- Existing tests do not break

## Backend development

The following steps will explain how to set up your own Google Firebase project to develop and test cloud functions. Those cloud functions, together with the Firebase document store `firestore`, provide the backend of our project.

**DISCLAIMER:** The free Spark plan of Google's Firebase is sufficient for development purposes.

First, go to https://firebase.google.com/, take a look at the *Getting Started Guide* there and create your own Firebase project. At this point, we hope you already have a Google account, because you'll need one.

### Firebase Console

Once your project is created, you need to configure the following things:

- create a firestore database
- configure the access rules of your database for proper access
- create a collection called `stats` with the `document id: "external"`

Setup Authentication, the method is `Email and Password`.

Now you can add a Firebase App to your project, more precisely a `Web App`. Once created, you can edit and download the specific configuration of your app. This configuration contains API keys, backend URLs, and so on.

Please update the `firebaseConfig.jsx` file in the `src` folder of this project, to connect your local instance with your specific backend.

### Local Backend Setup

Even though the free Firebase plan is ok for development, it has its downsides. The following feature does not work with this plan: `scheduled firebase function`. 

However, since we use it in production we need to comment out the following line of code:

```JSX
// exports.sendNotificationEmails = functions.pubsub
      .schedule('every 3 minutes')
      .onRun(async (context) => {}
```

In general, local development should not use the email system, and if you'd want to use it, you'd have to create your own `sendGrid` account and API key. Hence, please also comment out:

```JSX
// sgMail.setApiKey(functions.config().sendgrid.key);
```

and 

```JSX
await sgMail.send({
  to: receiver,
  from: 'help@quarantaenehelden.org',
  replyTo: {
    email: email,
  },
  templateId: 'd-ed9746e4ff064676b7df121c81037fab',
  dynamic_template_data: {
    subject: 'QuarantäneHeld*innen - Jemand hat Dir geschrieben!',
    answer,
    email,
    request,
  },
  hideWarnings: true, // removes triple bracket warning
});
```

Or even better, replace all email-related source code with proper logging.

### Deployment

After those changes, you should be able to initialize and deploy your own Firebase function to your specific backend. Within the project folder, run:

```console
cd firebase/functions
...

npm i
...

firebase login
...

firebase init
...

firebase deploy
...
```

and follow the instructions.

With all that, you should be good to go. In case you missed something or some step was unclear, please create an issue in this repository.

# Necessary Environment variables for CI / CD
- `TOKEN`: A GitHub token used for committing code to the GH pages branch
- `FIREBASE_TOKEN`: A Firebase token for deploying the functions to firebase
- `SENTRY_AUTH_TOKEN`: A Sentry token used for creating a new release after deploying to production
