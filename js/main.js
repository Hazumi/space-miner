$(document).ready(function() {

  $(function () { /* enable bootstrap tooltips */
    $('[data-toggle="tooltip"]').tooltip();
  });

  var $quid = $('#quid');
  var $shipPower = $('#shipPower');
  var $maxPower = $('#maxPower');
  var $shipCargo = $('#shipCargo');
  var $restorePower = $('#restorePower');
  var $hyperdrive = $('#hyperdrive');

  var $powerProgress = $('#powerProgress');

  var $upgradeMaxPower = $('#upgradeMaxPower');

  var $carbonaceous = $('#carbonaceous');
  var $silicaceous = $('#silicaceous');
  var $vesta = $('#vesta');
  var $iridium = $('#iridium');
  var $sellCarbonaceous = $('#sellCarbonaceous');
  var $sellSilicaceous = $('#sellSilicaceous');
  var $sellVesta = $('#sellVesta');
  var $sellIridium = $('#sellIridium');

  var $glulevisBelt1 = $('#glulevisBelt1');
  var $glulevisBelt2 = $('#glulevisBelt2');
  var $glulevisDwarfPlanet = $('#glulevisDwarfPlanet');
  var $asharaObjects = $('#asharaObjects');
  var $navigationSystem = $('#navigationSystem');

  var $hyperdriveProgress = $('#hyperdriveProgress');

  var mining = false;
  var miningGlulevisBelt1 = false;
  var miningGlulevisBelt2 = false;
  var miningGlulevisDwarfPlanet = false;
  var miningAsharaObjects = false;
  var planetAsharaUnlocked = false;

  var ship = {
    'quid': 500,
    'max power': 100,
    'power': 100,
    'cargo': {
      'carbonaceous': 0,
      'silicaceous': 0,
      'vesta': 0,
      'iridium': 0
    },
    'miningTechnique': 0,
    'hyperdrive': 0,
    'hyperdriveCurrent': 100,
    'currentLocation': 'glulevis'
  };

  var quid = ship.quid;
  var power = ship.power;
  var maxPower = ship['max power'];
  var hyperdrive = ship.hyperdrive;
  var hyperdriveCurrent = ship.hyperdriveCurrent;
  var carbonaceous = ship.cargo.carbonaceous;
  var silicaceous = ship.cargo.silicaceous;
  var vesta = ship.cargo.vesta;
  var iridium = ship.cargo.iridium;

  var buy = $('#buy');
  var upgrade = $('#upgrade');
  var maintenance = $('#maintenance');
  var sell = $('#sell');
  function toggleShowHeader(header) {
    if ( header.siblings().is(':visible') ){
      header.removeClass('hidden');
    } else {
      header.addClass('hidden');
    }
  }
  function toggleShowHeaderAll() {
    toggleShowHeader(buy);
    toggleShowHeader(upgrade);
    toggleShowHeader(maintenance);
    toggleShowHeader(sell);
  }

  function randomNum(range) {
    return Math.floor(Math.random() * range);
  }
  function mineCarbonaceous() {
    var random = randomNum(2);
    if (random == 0) {
      carbonaceous += 1;
    }
  }
  function mineSilicaceous() {
    var random = randomNum(25);
    if (random == 0) {
      silicaceous += 1;
    }
  }
  function mineVesta() {
    var random = randomNum(50);
    if (random == 0) {
      vesta += 1;
    }
  }
  function mineIridium() {
    var random = randomNum(40);
    if (random == 0) {
      iridium += 1;
    }
  }
  function displayStats() {
    $quid.html(quid);
    if (power > 5) {
      $powerProgress.css('color', '#fff');
    } else {
      $powerProgress.css('color', '#f00');
    }
    if (power <= 35) {
      $powerProgress.html(power);
    } else {
      $powerProgress.html(power + " / " + maxPower);
    }
    $powerProgress.css('width', (power * 100) / maxPower + "%");
    $powerProgress.css('font-weight', 'bold');
    $powerProgress.attr('aria-valuenow', power);
    $powerProgress.attr('aria-valuemax', maxPower);

    $hyperdriveProgress.html(hyperdriveCurrent + "%");
    $hyperdriveProgress.css('width', hyperdriveCurrent + "%");
    $hyperdriveProgress.css('font-weight', 'bold');
    $hyperdriveProgress.attr('aria-valuenow', hyperdriveCurrent);

    if (carbonaceous) {
      $carbonaceous.html("Carbonaceous: " + carbonaceous + "<br>");
      $sellCarbonaceous.removeClass('hidden');
    } else {
      $carbonaceous.html("");
      $sellCarbonaceous.addClass('hidden');
    }
    if (silicaceous) {
      $silicaceous.html("Silicaceous: " + silicaceous + "<br>");
      $sellSilicaceous.removeClass('hidden');
    } else {
      $silicaceous.html("");
      $sellSilicaceous.addClass('hidden');
    }
    if (vesta) {
      $vesta.html("Vesta: " + vesta + "<br>");
      $sellVesta.removeClass('hidden');
    } else {
      $vesta.html("");
      $sellVesta.addClass('hidden');
    }
    if (iridium) {
      $iridium.html("Iridium: " + iridium + "<br>");
      $sellIridium.removeClass('hidden');
    } else {
      $iridium.html("");
      $sellIridium.addClass('hidden');
    }
    toggleShowHeader(sell);
  };

  function stopMiningGlulevisBelt1() {
    miningGlulevisBelt1 = false;
    $glulevisBelt1.html("Start Mining");
    $glulevisBelt1.removeClass('btn-danger');
    $glulevisBelt1.addClass('btn-default');
  }
  function stopMiningGlulevisBelt2() {
    miningGlulevisBelt2 = false;
    $glulevisBelt2.html("Start Mining");
    $glulevisBelt2.removeClass('btn-danger');
    $glulevisBelt2.addClass('btn-default');
  }
  function stopMiningGlulevisDwardPlanet() {
    miningGlulevisDwarfPlanet = false;
    $glulevisDwarfPlanet.html("Start Mining");
    $glulevisDwarfPlanet.removeClass('btn-danger');
    $glulevisDwarfPlanet.addClass('btn-default');
  }
  function stopMiningAsharaObjects() {
    miningAsharaObjects = false;
    $asharaObjects.html("Start Mining");
    $asharaObjects.removeClass('btn-danger');
    $asharaObjects.addClass('btn-default');
  }
  function stopMiningAll() {
    mining = false;
    stopMiningGlulevisBelt1();
    stopMiningGlulevisBelt2();
    stopMiningGlulevisDwardPlanet();
    stopMiningAsharaObjects();
  }
  function removeResources() {
    carbonaceous = 0;
    silicaceous = 0;
    vesta = 0;
    iridium = 0;
  }

  displayStats();

  // MAIN LOOP
  window.setInterval(function() {
    if (mining && power <= 0) {
      removeResources();
      stopMiningAll();
    } else if (mining && power) {
      if (miningGlulevisBelt1) {
        mineCarbonaceous();
        mineSilicaceous();
      } else if (miningGlulevisBelt2) {
        mineCarbonaceous();
        mineVesta();
      } else if (miningGlulevisDwarfPlanet) {
        mineCarbonaceous();
        mineSilicaceous();
        mineVesta();
      } else if (miningAsharaObjects) {
        mineCarbonaceous();
        mineSilicaceous();
        mineIridium();
      }
      power -= 1;
    }
    if (hyperdriveCurrent !== 100) {
      hyperdriveCurrent += 1;
    }
    displayStats();
  }, 1000);

  // PANELS
  (function() { /* hyperdrive */
    var $hyperdriveGlulevis = $("#hyperdriveGlulevis");
    var $hyperdriveAshara = $("#hyperdriveAshara");
    var $glulevis = $('#glulevis');
    var $ashara = $('#ashara');

    var location = ship.currentLocation;
    $hyperdriveAshara.on('click', function() {
      if (hyperdriveCurrent == 100 && location !== 'ashara') {
        location = 'ashara';
        hyperdriveCurrent = 0;
        $ashara.removeClass('hidden');
        $glulevis.addClass('hidden');
        if (mining) stopMiningAll();
        if (!planetAsharaUnlocked) {
          planetAsharaUnlocked = true;
        }
        displayStats();
      }
    });
    $hyperdriveGlulevis.on('click', function() {
      if (hyperdriveCurrent == 100 && location !== 'glulevis') {
        location = 'glulevis';
        hyperdriveCurrent = 0;
        $glulevis.removeClass('hidden');
        $ashara.addClass('hidden');
        if (mining) stopMiningAll();
        displayStats();
      }
    });
  })();

  // MINING
  $glulevisBelt1.on('click', function() {
     if (ship.miningTechnique && !mining) {
      mining = true;
      miningGlulevisBelt1 = true;
      $(this).html("Stop Mining");
      $(this).removeClass('btn-default');
      $(this).addClass('btn-danger');
    } else if (miningGlulevisBelt1) {
      mining = false;
      stopMiningGlulevisBelt1();
      }
  });
  $glulevisBelt2.on('click', function() {
     if (ship.miningTechnique && !mining) {
      mining = true;
      miningGlulevisBelt2 = true;
      $(this).html("Stop Mining");
      $(this).removeClass('btn-default');
      $(this).addClass('btn-danger');
    } else if (miningGlulevisBelt2) {
      mining = false;
      stopMiningGlulevisBelt2();
      }
  });
  $glulevisDwarfPlanet.on('click', function() {
     if (!mining) {
      mining = true;
      miningGlulevisDwarfPlanet = true;
      $(this).html("Stop Mining");
      $(this).removeClass('btn-default');
      $(this).addClass('btn-danger');
    } else if (miningGlulevisDwarfPlanet) {
      mining = false;
      stopMiningGlulevisDwardPlanet();
      }
  });
  $asharaObjects.on('click', function() {
    if (!mining) {
      mining = true;
      miningAsharaObjects = true;
      $(this).html("Stop Mining");
      $(this).removeClass('btn-default');
      $(this).addClass('btn-danger');
    } else if (miningAsharaObjects) {
      mining = false;
      stopMiningAsharaObjects();
    }
  });

  // BUTTONS
  (function() { /* mining laser */
    var $miningLaserButton = $('#miningLaserButton');
    $miningLaserButton.on('click', function() {
      if (quid >= 2) {
        quid -= 2;
        ship.miningTechnique = 1;
        displayStats();
        $upgradeMaxPower.removeClass('hidden');
        $hyperdrive.removeClass('hidden');
        $restorePower.removeClass('hidden');
        $(this).remove();
        toggleShowHeaderAll();
      }
    });
  })();
  (function() { /* navigation system */
    var $hyperdriveMenu = $('#hyperdriveMenu');
    $navigationSystem.on('click', function() {
      if (quid >= 15) {
        quid -= 15;
        $hyperdriveMenu.removeClass('hidden');
        $(this).remove();
        toggleShowHeader(buy);
      }
    });
  })();
  (function() { /* hyperdrive */
    var $glulevisDwarfPlanetHeader = $("#glulevisDwarfPlanetHeader");
    $hyperdrive.on('click', function() {
      if (quid >= 10) {
        quid -= 10;
        hyperdrive = 1;
        displayStats();
        $glulevisDwarfPlanetHeader.removeClass('hidden');
        $glulevisDwarfPlanet.removeClass('hidden');
        $navigationSystem.removeClass('hidden');
        $(this).remove();
      }
    });
  })();
  (function() { /* restore power */
    $restorePower.on('click', function() {
      if (quid >= 2 && power != maxPower) {
        quid -= 2;
        power = maxPower;
        displayStats();
      }
    });
  })();
  (function() { /* upgrade - max power */
    $upgradeMaxPower.on('click', function() {
      if (quid >= 2 && maxPower <= 200 ) {
        quid -= 2;
        maxPower += 5;
        displayStats();
      } if (maxPower == 200) {
        $(this).addClass('hidden');
        toggleShowHeader(upgrade);
      }
    });
  })();
  $sellCarbonaceous.on('click', function() {
    if (carbonaceous >= 25) {
      quid += Math.floor(carbonaceous / 25);
      carbonaceous = carbonaceous % 25;
      displayStats();
      if (!carbonaceous)
        $(this).addClass('hidden');
    }
  });
  $sellSilicaceous.on('click', function() {
    if (silicaceous) {
      quid += silicaceous;
      silicaceous = 0;
      displayStats();
      $(this).addClass('hidden');
    }
  });
  $sellVesta.on('click', function() {
    if (vesta) {
      quid += vesta * 2;
      vesta = 0;
      displayStats();
      $(this).addClass('hidden');
    }
  });
  $sellIridium.on('click', function() {
    if (iridium) {
      quid += iridium * 3;
      iridium = 0;
      displayStats();
      $(this).addClass('hidden');
    }
  });
});

/* TO DO

remove bold on bars created by js
- show hyperdrive on purchase
buy
  magnetic rack
upgrade
  mining speed

  header remove/show function
    on button click
    new planet
*/
