const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.urlencoded({
  extended: true
}));
var params = {
  result: ""
}
app.post('/calcPostage', (req, res) => {

  var selectType;
  switch (req.body.parcel) {
    case 'Letters (Stamped)':
      selectType = 'stamped';
      break;
    case 'Letters (Metered)':
      selectType = 'metered';
      break;
    case 'Large Envelopes (Flats)':
      selectType = 'flats';
      break;
    case 'First-Class Package Service—Retail':
      selectType = 'fistClass';
      break;
  }

  var parcelVal = [{
      stamped: {
        1: .55,
        2: .75,
        3: .95,
        3.5: 1.15
      }
    },
    {
      metered: {
        1: .51,
        2: .71,
        3: .91,
        3.5: 1.11
      }
    },
    {
      flats: {
        1: 1,
        2: 1.2,
        3: 1.4,
        4: 1.6,
        5: 1.8,
        6: 2,
        7: 2.2,
        8: 2.4,
        9: 2.6,
        10: 2.8,
        11: 3,
        12: 3.2,
        13: 3.4
      }
    },
    {
      fistClass: {
        1: 4,
        2: 4,
        3: 4,
        4: 4,
        5: 4.8,
        6: 4.8,
        7: 4.8,
        8: 4.8,
        9: 5.5,
        10: 5.5,
        11: 5.5,
        12: 5.5,
        13: 6.25
      }
    }
  ];
  var calc = 0;

  var type = parcelVal.find(p => p[selectType]);
  loopParent:
  for (var i in type) {
    var itemNames = Object.getOwnPropertyNames(type[i]);
    var itemValues = Object.values(type[i]);
    for (var j in itemNames) {
      if (parseFloat(itemNames[j]) >= req.body.weight) {

        calc = itemValues[j];
        break loopParent;
      }
      else{
        calc = itemValues[j];
      }
    }
  }

  params = {
    result: calc
  }
  res.render('pages/index', params);
  res.end();
});
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index', params));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));