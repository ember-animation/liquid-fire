import Ember from 'ember';

export default function () {
  if (Ember.testing) {
    this.setDefault({ duration: 10 });
  }
  // BEGIN-SNIPPET transition-demo
  this.transition(
    this.fromRoute('helpers-documentation.liquid-outlet.index'),
    this.toRoute('helpers-documentation.liquid-outlet.other'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
  // END-SNIPPET

  // BEGIN-SNIPPET bind-demo-transition
  this.transition(this.childOf('#liquid-bind-demo'), this.use('toUp'));
  // END-SNIPPET

  let duration = Ember.testing ? 0 : 1000;
  // BEGIN-SNIPPET liquid-box-demo-transition
  this.transition(
    this.hasClass('vehicles'),

    // this makes our rule apply when the liquid-if transitions to the
    // true state.
    this.toValue(true),
    this.use('crossFade', { duration }),

    // which means we can also apply a reverse rule for transitions to
    // the false state.
    this.reverse('toLeft', { duration })
  );
  // END-SNIPPET

  this.transition(
    this.childOf('#interrupted-fade-demo'),
    this.use('fade', { duration: Ember.testing ? 100 : 1500 })
  );

  // BEGIN-SNIPPET explode-demo-1
  this.transition(
    this.childOf('#explode-demo-1'),
    this.use(
      'explode',
      {
        pickOld: 'h3', // Find an "h3" in the old template. This
        // can be any CSS selector.

        use: ['toUp', { duration }], // And animate it upward. This can
        // be any arbitrary transition, and
        // its optional parameters.
      },
      {
        pickNew: 'h3', // Find an "h3" in the new template

        use: ['toDown', { duration }], // And animate it downward.
      },
      {
        // For everything else that didn't match the above, use a
        // fade. I'm giving the fade half as much duration because fade
        // includes both fading out and fading in steps, each of which
        // spends `duration` milliseconds.
        use: ['fade', { duration: duration / 2 }],
      }
    )
  );
  // END-SNIPPET

  // BEGIN-SNIPPET explode-demo-2
  this.transition(
    this.childOf('#explode-demo-2'),
    this.use('explode', {
      matchBy: 'data-photo-id', // matchBy will look for the same
      // HTML attribute value in both
      // the old and new elements, and
      // for each matching pair, it
      // runs the given transition.

      // fly-to is a built in transition that animate the element
      // moving from the position of oldElement to the position of
      // newElement.
      use: ['fly-to', { duration, easing: 'spring' }],
    })
  );
  // END-SNIPPET

  // BEGIN-SNIPPET toLeft-demo
  this.transition(
    this.hasClass('toLeft-demo'),
    this.use('toLeft', { duration })
  );
  // END-SNIPPET

  // BEGIN-SNIPPET crossFade-demo
  this.transition(
    this.hasClass('crossFade-demo'),
    this.use('crossFade', { duration: duration * 2 })
  );
  // END-SNIPPET

  // BEGIN-SNIPPET fade-demo
  this.transition(this.hasClass('fade-demo'), this.use('fade', { duration }));
  // END-SNIPPET

  // BEGIN-SNIPPET scrollThen-demo
  this.transition(
    this.hasClass('scrollThen-demo'),
    this.use('scrollThen', 'toLeft', { duration })
  );
  // END-SNIPPET

  // BEGIN-SNIPPET scale-demo
  this.transition(this.hasClass('scale-demo'), this.use('scale', { duration }));
  // END-SNIPPET

  // BEGIN-SNIPPET wait-demo
  this.transition(
    this.hasClass('wait-demo'),
    this.use('wait', 1000, { then: 'fade' })
  );
  // END-SNIPPET

  this.transition(
    this.childOf('#inline-serial-scenario'),
    this.use('fade', { duration: 1000 })
  );

  this.transition(
    this.childOf('#inline-scenario'),
    this.toValue(true),
    this.use('toLeft', { duration: 1000 }),
    this.reverse('toRight', { duration: 1000 })
  );

  this.transition(
    this.fromRoute('scenarios.nested-outlets.middle'),
    this.toRoute('scenarios.nested-outlets.middle2'),
    this.use('fade', { duration: Ember.testing ? 100 : 1000 }),
    this.reverse('fade', { duration: Ember.testing ? 10 : 1000 })
  );

  this.transition(
    this.fromRoute('scenarios.nested-outlets.middle.index'),
    this.toRoute('scenarios.nested-outlets.middle.inner'),
    this.use('fade', { duration: Ember.testing ? 10 : 1000 }),
    this.reverse('fade', { duration: Ember.testing ? 10 : 1000 })
  );

  this.transition(
    this.childOf('#versions-test'),
    this.use('fade', { duration: 500 })
  );

  this.transition(
    this.hasClass('hero-scenario'),
    this.fromValue(true),
    this.use(
      'explode',
      {
        pickOld: '.bluebox',
        pickNew: '.redbox',
        use: ['flyTo', { duration: 1500 }],
      },
      {
        pickOld: '.blue-abs-box',
        pickNew: '.red-abs-box',
        use: ['flyTo', { duration: 1500 }],
      },
      {
        use: ['toLeft', { duration: 1500 }],
      }
    ),
    this.reverse(
      'explode',
      {
        pickOld: '.redbox',
        pickNew: '.bluebox',
        use: ['flyTo', { duration: 1500 }],
      },
      {
        pickOld: '.red-abs-box',
        pickNew: '.blue-abs-box',
        use: ['flyTo', { duration: 1500 }],
      },
      {
        use: ['toRight', { duration: 1500 }],
      }
    )
  );

  this.transition(
    this.hasClass('hero-sort'),
    this.use('explode', {
      matchBy: 'data-model-id',
      use: ['flyTo', { duration: 500, easing: [250, 15] }],
    })
  );

  this.transition(
    this.hasClass('nested-explode-transition-scenario'),
    this.use('explode', {
      pick: '.child',
      use: ['toLeft', { duration: 500 }],
    })
  );

  this.transition(
    this.includingInitialRender(),
    this.outletName('test'),
    this.use('toLeft')
  );

  this.transition(
    this.withinRoute(/^scenarios.model-dependent-rule\./),
    this.fromModel(function (fromModel, toModel) {
      return (
        fromModel && toModel && parseInt(fromModel.id) < parseInt(toModel.id)
      );
    }),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  this.transition(
    this.fromRoute('scenarios.interrupted-move.index'),
    this.toRoute('scenarios.interrupted-move.two'),
    this.use('toLeft', { duration: 1500 }),
    this.reverse('toRight', { duration: 1500 })
  );
  this.transition(
    this.fromRoute('scenarios.interrupted-move.two'),
    this.toRoute('scenarios.interrupted-move.three'),
    this.use('toLeft', { duration: 1500 }),
    this.reverse('toRight', { duration: 1500 })
  );
  this.transition(
    this.fromRoute('scenarios.interrupted-move.index'),
    this.toRoute('scenarios.interrupted-move.three'),
    this.use('toLeft', { duration: 1500 }),
    this.reverse('toRight', { duration: 1500 })
  );
}
