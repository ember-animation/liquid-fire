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

You can use [Giftwrap](http://github.com/ef4/ember-giftwrap) to
produce builds of liquid-fire for use in non-ember-cli apps. The
`example/prebuilt-example.html` illustrates how to use the output of
giftwrap.

Remember that your build will only be compatible with the precise
Ember version you used to build it.

Releasing
---------

The `release.js` tool automates the process of publishing a full
liquid-fire release to Github, the
[liquid-fire docs website](http://ef4.github.com/liquid-fire), and
npm. Run `release.js --help`.
