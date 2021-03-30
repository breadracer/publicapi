module.exports = {
  'Index page test' : function (client) {
    client
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .assert.title('University Search')
      .assert.visible('input[name=name]')
      .assert.visible('input[name=country]')
      .assert.visible('input[type=submit]')
      .assert.containsText('body', 'Search for your university!')
      .end()

  },

  'Go back to index test' : function (client) {
    client
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .click('input[type=submit]')
      .pause(1000)
      .assert.visible('a')
      .assert.containsText('a', 'Search for your university!')
      .click('a')
      .pause(1000)
      .assert.urlEquals('http://localhost:3000/')
      .end()

  },

  'Search test 1' : function (client) {
    client
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .setValue('input[name=name]', 'california')
      .waitForElementVisible('input[type=submit]', 1000)
      .click('input[type=submit]')
      .pause(1000)
      .assert.containsText('body', 'California Baptist University')
      .assert.containsText('body', 'http://www.calbaptist.edu/')
      .end()
  },

  'Search test 2' : function (client) {
    client
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .setValue('input[name=country]', 'turkey')
      .waitForElementVisible('input[type=submit]', 1000)
      .click('input[type=submit]')
      .pause(1000)
      .assert.containsText('body', 'Adnan Menderes University')
      .assert.containsText('body', 'http://www.adu.edu.tr/')
      .end()
  },

  'Search test 3' : function (client) {
    client
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .setValue('input[name=name]', 'jibberish')
      .waitForElementVisible('input[type=submit]', 1000)
      .click('input[type=submit]')
      .pause(1000)
      .assert.containsText('body', 'No result found.')
      .end()
  },

}