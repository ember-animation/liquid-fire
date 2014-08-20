Packaging and Releasing
=======================

If you're using ember-cli, you probably don't need anything in this
directory, even if you want to work with the latest unreleased master
branch. You can run directly against master like this:

    git clone https://github.com/ef4/liquid-fire
    cd liquid-fire
    npm install
    bower install
    sudo npm link
    cd YOUR_APP
    npm link liquid-fire

Building for non-ember-cli apps
-------------------------------

If you want something not in the
[prebuilt releases](https://github.com/ef4/liquid-fire/releases), you
can build your own by installing the Broccoli cli tool:

    sudo npm install -g broccoli-cli

And doing a Broccoli build in this directory:

    broccoli build ./dist


Releasing
---------

The `release.js` tool automates the process of publishing a full
liquid-fire release to Github, the
[liquid-fire docs website](http://ef4.github.com/liquid-fire), and
npm. Run `release.js --help`.
