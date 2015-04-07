# Angular Quick Start Seed - [AngularJS](http://angularjs.org/)

## Installation

Windows Prerequisite
--------------------

### Install NodeJS (NPM comes within NodeJS) (this is global installation)
   1. Go to http://nodejs.org/
   2. Download and Install / Or Install directly / You will see both the options on the above website home page.
   3. Go to command prompt, and run the following command
   4. node --version
   5. above command will output the version of the nodeJS installed.
	* e.g. v0.10.32
   6. npm --version
   5. above command will output the version of the NPM installed.
	* e.g. 1.4.28

### Install GIT (this is global installation)
   1. Go to http://git-scm.com/download/win
   2. Download and Install.
	* Set the path for it in environment variable, if same is not done.
   3. Go to command prompt/Git Bash, and run the following command
   4. git --version
   5. above command will output the version of the git installed.
	* e.g. git version 1.9.4.msysgit.2

### Install Grunt-CLI (this is global installation)
   1. Go to http://gruntjs.com/getting-started
   2. npm install -g grunt-cli
	* Set the path for it in environment variable, if same is not done.
   3. Go to command prompt/Git Bash, and run the following command
   4. grunt --version
   5. above command will output the version of the grunt-cli installed.
	* e.g. git version 1.9.4.msysgit.2

### Install Karma (this is global installation)
   1. Open command prompt
   2. npm install -g karma-cli
   3. npm install -g karma
   4. Go to command prompt/Git Bash, and run the following command.
   5. karma --version.
   6. above command will output the version of the grunt-cli installed.

Working with the application
--------------------
### Clone the repository
   1. Go to command prompt/Git Bash, and CD to the working directory
   2. ```git clone``` https://codecloud.web.att.com/scm/onlinetoolkit/angular-quickstart-seed.git
	* Above will download the folder structure to the directory angular-quickstart-seed
   3. ```CD angular-quickstart-seed```
   4. Run ```git checkout develop```
   5. Run ```npm install```
	* Above will download the node dependencies into the folder ```node_modules```
   5. Run ```node ./node_modules/protractor/bin/webdriver-manager update```
   6. Open a CMD prompt run 'ng-server.bat'
   7. Open another CMD prompt -- Run the ```build``` Command - this will run the following grunt tasks
		In case Chrome error, set the CHROME_BIN variable to the chrome.exe with the complete path where chrome is installed.
	* grunt default
        * Run Karma
        * Execute Unit test cases
        * Run Protractor
        * Start Selenimum Server
        * Execute end to end test cases
        * Build the distributables
	* grunt copy:Int
	* grunt copy:Ext
	* grunt clean:lib
   8. If ```build.cmd``` succeed,  Above will create a dist folder which will have distributable of your project.
   
## Project philosophy

### Angular Quick Start seed Application

We are aiming at providing a set of files and folders needed for an angular application to start with. The goal is to provide complete infrastructure for the automation of the **Unit testing** and **End to End testing**.