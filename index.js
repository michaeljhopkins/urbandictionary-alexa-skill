var alexa = require('alexa-app'),
    _     = require('underscore'),
    urban = require('urban'),
    ssml  = require('ssml');

var APP_NAME = 'Urban Dictionary';

var app = new alexa.app(APP_NAME);

app.intent('DefineIntent', {
  'slots': {
    'Term': 'LITERAL'
  },
  'utterances': [
    'define {SJW|Donald Trump|Netflix and Chill|Term}'
  ]
}, function(req, res) {
  var term = req.slot('Term'),
      definition = null,
      example = null;
  console.log('Defining term: ' + term);

  urban(term).on('end', function(dictionary) {
    if (dictionary.result_type == 'exact' && dictionary.list.length > 0) {
      // word was successfully defined
      var entry = dictionary.list[0];
      definition = entry.definition;
      example = entry.example;

      res.say(new ssml().say(term).break(200));
    } else {
      definition = APP_NAME + ' could not find a definition for the term: ' + term;
    }

    res.say(definition);
    if (!!example) {
      // tack on an example usage if one was found
      res.say(new ssml().break(200).say('Used in a sentence').break(200).say(example));
    }
    res.card(APP_NAME, definition);
    res.send();
  });

  // return false to delay response
  return false;
});

exports.handler = app.lambda();

exports.schema = function() {
  console.log(app.schema());
};

exports.utterances = function() {
  console.log(app.utterances());
};