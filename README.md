# Trootorials

B2C App for students to learn latest technologies.

## Installation

#### Download

Simply clone or download the zip of the project,

#### Using with [Node.js](http://nodejs.org) via [npm](https://www.npmjs.org/):

Command Line:

```shell
npm install
```

#### Using with [Bower](http://bower.io):

Command Line:

```shell
bower install
```

#### Using .env file
```shell
cp sample.env .env
```

.env file will be having all the configurable items needed at user's side. A sample env file is available by the name sample.env

## Usage

- For Development
```shell
 gulp dev
```
- If you don't provide any environment variable, then by default it starts with development.
- This should start your app at http://localhost:5000/.

## Build

#### Make sure you change the .env file according to your suitable platform

```shell
gulp
```

#### This will create a dist/ folder which will contain your required minified and obfuscated files
