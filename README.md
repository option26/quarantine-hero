# QuarantaeneHelden
<img src="qhero_icon.png" align="right" width="60"/>
At quarantaenehelden.org we created a platform for people to support those in their community who might need a little extra help during this time of quarantine. The platform connects people who need help or cannot leave their homes, with those in their neighborhood who are able to run errands, deliver groceries, take pets on walks, and other tasks. On our website, you can register to ask for help or to provide help for others. Let's support those in our community!

A project brought to you with :heart: and bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Getting Started

This repository contains the source code of our website, and the following guide explains how to get started and what you need to improve and use this project. Our firebase functions are hosted here: https://github.com/florianschmidt1994/quarantaenehelden-firebase-functions

You need the following libraries to get started: `node`, `yarn`, `firebase cli`. So please install them in an appropriate way on your host system. On macOS, you'd also need the `Xcode command line tools`.

Once you've installed those dependencies, run the following inside the project folder

```yarn install```

This will install all JavaScript dependencies.

## Local web development

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Backend development

The following steps will explain how to set up your own google firebase project to develop and test cloud functions. Those cloud functions, together with the firebase document store `firestore`, provide the backend of our project.

DISCLAIMER: The free Spark plan of google's firebase is sufficient for development purposes.

First, go to https://firebase.google.com/, take a look at the *Geeting Started Guide* there and create your own firebase project. At this point, we hope you already have a google account, because you'll need one.

### Firebase Console

Once your project is created, you need to configure the following things:

- create a firestore database
- configure the access rules of your database for proper access
- create a collection called `stats` with the `document id: "external"`

Setup Authentication, the method is `Email and Password`.

Now you can add a firebase App to your project, more precisely a `Web App`. Once created, you can edit and download the specific configuration of your app. This configuration contains API keys, backend URLs, and so on.

Please update the `firebaseConfig.jsx` file in the `src` folder of this project, to connect your local instance with your specific backend.

### Local Backend Setup

Even though the free firebase plan is ok for development, it has its downsides. The following feature does not work with this plan: `scheduled firebase function`. 

However, since we use it in production we need to comment out the following line of code:

```
// exports.sendNotificationEmails = functions.pubsub
      .schedule('every 3 minutes')
      .onRun(async (context) => {}
```

In general, local development should not use the email system, and if you'd want to use it, you'd have to create your own `sendGrid` account and API key. Hence, please also comment out:

```// sgMail.setApiKey(functions.config().sendgrid.key);```

and 

```
await sgMail.send({
  to: receiver,
  from: 'help@quarantaenehelden.org',
  replyTo: {
    email: email,
  },
  templateId: 'd-ed9746e4ff064676b7df121c81037fab',
  dynamic_template_data: {
    subject: 'QuarantäneHelden - Jemand hat dir geschrieben!',
    answer,
    email,
    request,
  },
  hideWarnings: true, // removes triple bracket warning
});
```

Or even better, replace all email-related source code with proper logging.

### Deployment

After those changes, you should be able to initialize and deploy your own firebase function to your specific backend. Within the project folder, run:

```
firebase init
...

firebase deploy
...
`

and follow the instructions.

With all that, you should be good to go. In case you missed something or some step was unclear, please create an issue in this repository.
