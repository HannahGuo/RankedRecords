# Ranked Records

Welcome to Ranked Records 2.0!

If you're reading this, the current version is still in beta as I bug test and work out a few quirks before official launch. Feel free to play around with it, and to report any bugs either using the [feedback form](https://docs.google.com/forms/d/e/1FAIpQLSfuvloB2JpKfFJ1BMfxofnguX7seRUcm8TCa1O59jnErDJmzA/viewform) or by opening an issue on this repo.

## Development Notes
Mainly things for myself later, but this repo is cloneable and runnable if you want to play around with it.

### Run Instructions
1. cd into client folder and run `npm install` then `npm start`
   - This will start the react app on localhost:3000
2. cd into server folder and run `npm install` then `node server.ts`
   - This will start the server on localhost:3001

### Environment Configurations
The following variables need to be set:
- SECRET
- PORT
- LOGIN_URL
- REACT_APP_CURRENT_URL