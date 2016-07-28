


# The Primo New UI Custimization Workfolw Development Enviornment


##Structure

- <b>gulp directory</b> : holds the various build scripts for the enviornment and the configuration file (config.js) in which the target proxy server is defined

- <b>node_modules directory</b> : holds the various 3rd party modules that are required to run the system , Those modules are defined in the:
`./package.json` file

- <b>packages directory</b> : once your development package is ready you will be able to build it using the `gulp create-package` command that will create the zipped package file you define in this folder

- <b>primo-explore directory</b> : consists of 2 direcories :
   1. <b> custom </b> : - where you will place your custimization packages
   2. <b> tmp </b> : just a place to hold some of your temporary files

##Oveview

The development package allows you to configure :

- css

- images

- html

- javascript


- For each configuration type there is a specified folder in the custom package folder (that can be dowloaded from your Primo Back Office)
- In each folder you will find a specific README.md file with recepies/examples.

 ##Installation


 -  Download and install nodejs version 4.2.x

 > https://nodejs.org/en/download/


 -  Run the command (from command line) `npm install npm@3.3.12 -g`

 -  Restart the computer

 -  Run `npm install -g gulp` from the command line

 -  Open a new command line window

 -  cd to the project base directory (<your-drive-letter>:\**\**\primo-explore-devenv)

 -  Run `npm install`. This should install all node modules needed for gulp

 -  Edit the proxy server under /gulp/config.js: `var PROXY_SERVER = http://your-server:your-port`
 -  Note that for SSL enviornments (https) define the server as: `var PROXY_SERVER = https://your-server:443`
 -  In the command line run : `gulp run` - This will start your local server
 -  Open a browser and type in the following url:

        localhost:8003/primo-explore/?vid=<your view code>
 -  Now you can perform searches on your browser and recieve results from your actual defined proxy server
 -  Go to your custom package folder and start your customizations
 -  You can get immediate feedback on your changes by refreshing the browser

