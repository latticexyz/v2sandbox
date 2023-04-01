# MUD2 SANDBOX

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flatticexyz%2Fv2sandbox&env=VITE_CHAIN_ID&envDescription=The%20VITE_CHAIN_ID%20environment%20variable%20is%20used%20to%20determine%20the%20chain%20deployment%20to%20link%20to%20the%20client%20by%20default.&project-name=mud2-project&repository-name=mud2-project&redirect-url=https%3A%2F%2Flatticexyz.notion.site%2FMUD-v2-Documentation-cd478ea455af46e7b245f7387deb9a9a&root-directory=packages%2Fclient)

## Getting started

- Press the button above to copy this branch to a new repository on your account. Alternatively just clone this repository.
- Run the following commands in the root folder of your project:
  1. Install all dependencies: `yarn`
  2. Initialize the auto-generated files: `yarn initialize`
  3. Initialize the PRIVATE_KEY environment variable with the default anvil private key: `echo "PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" > packages/contracts/.env`
  4. Run the project locally: `yarn dev`
