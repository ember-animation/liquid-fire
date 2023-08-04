/* eslint-env node */

const FastBoot = require('fastboot');
const { execFileSync } = require('child_process');
const { module: Qmodule, test } = require('qunit');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { URL } = require('url');

Qmodule('Fastboot', function (hooks) {
  let fastboot;

  hooks.before(async function () {
    execFileSync('pnpm', ['build']);
    fastboot = new FastBoot({
      distPath: 'dist',
      resilient: false,
    });
  });

  test('visit every link in sidebar', async function (assert) {
    assert.expect(23);

    const visitOpts = {
      request: { headers: { host: 'localhost:4200' } },
    };

    async function navigateForward(url) {
      const page = await fastboot.visit(url, visitOpts);
      if (page.statusCode >= 300 && page.statusCode < 400) {
        const location = new URL(
          page.headers.headers.location[0],
          'http://localhost:4200'
        );
        return await navigateForward(location.pathname);
      }
      assert.strictEqual(
        page.statusCode,
        200,
        `Expected status 200 for ${url}`
      );
      const html = await page.html();
      const dom = new JSDOM(html);
      const forward = dom.window.document.querySelector('.page-item.forward a');
      if (forward) {
        await navigateForward(forward.getAttribute('href'));
      }
    }
    await navigateForward('/');
  });
});
