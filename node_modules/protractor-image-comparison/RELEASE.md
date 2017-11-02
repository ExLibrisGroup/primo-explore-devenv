protractor-image-comparison release TODO list
==========

Before releasing the following steps needs to be executed:

- [] run tests local on node 4.7.2:
  - [] switch to node 4.7.2 `nvm use 4`
  - [] run against SauceLabs `npm t -- -e saucelabs`
  - [] run against Android ADB Emulator `npm t -- -e android.adb`
  - [] run against Android ChromeDriver Emulator `npm t -- -e android.chromedriver`
  - [] run against Perfecto `pm t -- -e perfecto`
  - [] run unit tests `npm run unit-test`
- [] run tests local on node > 7:
  - [] switch to node >7 `nvm use node`
  - [] run against SauceLabs `npm t -- -e saucelabs`
  - [] run against Android ADB Emulator `npm t -- -e android.adb`
  - [] run against Android ChromeDriver Emulator `npm t -- -e android.chromedriver`
  - [] run against Perfecto `npm t -- -e perfecto`
  - [] run unit tests `npm run unit-test`
- [] run the docs with `npm run docs`, check them and commit + push them
- [] upgrade `package.json` based on SEM-VER
- [] generate a new `CHANGELOG.md` with `npm run changelog`
- [] commit + push `CHANGELOG.md` and `package.json` with `git add . && git commit -m"chore(release): new release" && git push`
- [] add the right tag `git tag -a v#.#.# -m "chore(release): #.#.#" && git push --tags`
- [] publish a new release `npm publish`
