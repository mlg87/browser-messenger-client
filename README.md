# browser-messenger client
move over slack. there's a new messenging service in town. find the live version at [messenger.masoncod.es](https://messenger.masoncod.es)

this is front-end support for [browser-messenger server](https://github.com/mlg87/browser-messenger-server)

## running locally
app is bootsrapped with `create-react-app`, so running locally is very straightforward. after cloning the repo and installing dependencies, add an `.env` file at the root. the only variable required is `REACT_APP_API_URL`. if running the [browser-messenger-server](https://github.com/mlg87/browser-messenger-server) locally as well, this should be `http://localhost:5000`

* start the app: `yarn start` from root
* test the app: `yarn test` from root

## general project notes
* `mobx` is used for state management. this is the first time ive used `mobx` in a couple of years, so design patterns might be a bit off
* the static bundle is served by `netlify`
* i don't get to use `react-router` at work and even though this is a small app, i wanted to give it a go and really like how the library has evolved
* test coverage can definitely be expanded (e.g. there are only smokescreen tests for `Login` and `Register`). while i believe that we should only test what the user experiences in the wild, i do think that it made sense to test the `socket` in the `ChatBox.test.tsx` file (which could also be expanded)
* contrary to the appearance of this app, i do know how to make things pretty :lipstick: