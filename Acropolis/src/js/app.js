var Cryptoart = {};


Cryptoart.NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
Cryptoart.TX_HASHES = "_Cryptoart_Hashes";
Cryptoart.TX_DIV_ID = "#pendingTransactions";
Cryptoart.EVENT_START_BLOCK = 0;
Cryptoart.ETHER_CONVERSION = {USD: 230.999999};

Cryptoart.currentPunkIndex = -1;

Cryptoart.gasPrice = 24000000001;

Cryptoart.ArtState = {
	web3Queried: false,
    web3ready: false,
    web3UsingInfura: false,
    web3NotPresent: false,
    accountQueried: false,
    accountUnlocked: false,
    account: null,
    accountHasBalance: false,
    accountBalanceInWei: 0,
    accountBalanceInEther: 0,
    transactions: [],
    isOwned: true,
    isOwner: false,
    canBuy: false,
    forSale: false,
    hasBid: false,
    ownsBid: false,
    artData: {
	    loadComplete: false,
	    artIndex: -1,
        owner: Cryptoart.NULL_ADDRESS,
        offerValue: 0,
        onlySellTo: Cryptoart.NULL_ADDRESS,
        bidder: Cryptoart.NULL_ADDRESS,
        bidValue: 0,
        hashValue: null,
    },
    events: {
	    allSorted: [],
	    transfers: [],
	    bids: [],
	    bidsWithdrawn: [],
	    bought: [],
	    offeredForSale: [],
        claimed: []
    },
    loadingDone: {
	    owner: false,
	    bid: false,
        offer: false,
        eventsClaimed: false
    }
};

Vue.component('hash-display', {
    props: ['hash'],
    template: '<span>{{valueStr}}</span>'
});

var panel1 = new Vue({
    el: '#ethereum',
    data: {
        state: Cryptoart.ArtState
    },
    computed: {
        accountShort: function() {
            if (this.state.accountUnlocked) {
                return this.state.account.substring(0,10);
            } else {
                return "none";
            }
        }
    }
});

App = {
  web3Provider: null,
  contracts: {},

  init: function() {

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('../../build/contracts/CryptoArt.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var CryptoArtArtifact = data;
      //App.contracts.CryptoArt = TruffleContract(CryptoArtArtifact);
      Cryptoart.artContract = TruffleContract(CryptoArtArtifact);
      // Set the provider for our contract
      Cryptoart.artContract.setProvider(App.web3Provider);



      // Use our contract to retrieve and mark the adopted pets
      //return App.markAdopted();
      return App.setAccount();
      return App.checkEvents();
    });

    //return App.bindEvents();
  },

  setAccount: function() {
    var accountInterval = setInterval(function() {
                web3.eth.getAccounts(function(err, accounts) {
                    // console.log(accounts);
                    if (accounts[0] !== Cryptoart.ArtState.account) {
                        console.log("Metamask account changed: "+accounts[0]);
                        Cryptoart.ArtState.account = accounts[0];
                        web3.eth.defaultAccount = accounts[0];
                        if (Cryptoart.ArtState.account === undefined) {
                            Cryptoart.ArtState.accountUnlocked = false;
                        } else {
                            //Cryptoart.refreshPendingWidthdrawals(); //Reinstate soon!

                            Cryptoart.ArtState.accountUnlocked = true;
                        }

                        if (typeof cryptoartContractLoadedCallback !== 'undefined') {
                            cryptoartContractLoadedCallback();
                        }
                    }
                    Cryptoart.ArtState.accountQueried = true;
                });
            }, 100);


  },

  bindEvents: function() {
    //$(document).on('click', '.btn-create', App.handleUpload);
    //document.getElementById('btn-create').addEventListener('click', handleUpload);

  },

  /*bindEvents: function( {
    $("#btn-upload").click(function{
      return App.handleUpload();
    })
  },*/

  handleUpload: function() {
    file = document.getElementById('fileToUpload').files[0];
    //event.preventDefault(); // check what this does...

    var hash = document.getElementById("hashDisplay").textContent;

    HelloWorld.deployed().then(function(instance) {
    return instance.balance.call();
}).then(function(balance) {
    console.log(balance);
});
  App.contracts.Adoption.deployed().then(function(instance) {
    instance.cryptoArtRelease
} // What to do,,,

    Cryptoart.artContract.deployed().then(function())
    Cryptoart.artContract.cryptoArtRelease(Cryptoart.ArtState.account, hash, {gas: 200000, gasPrice: Cryptoart.gasPrice, value: 200000000000000000}, function(error, result) {
    if(!error) {
        console.log(result);
        console.log("Success!");
    } else {
      console.log("Error: "+accounts[0]);
    }

    });

  },

  checkEvents: function() {
    //EVENT Listening


    var contractInstance;

    Cryptoart.artContract.CryptoArt.deployed().then(function(instance) {
      contractInstance = instance;

      var event = contractInstance.ArtCreation({fromBlock: 0, toBlock: 'latest'});

          event.watch(function(error, response)
          {
             //once the event has been detected, take actions as desired
              var data = 'Art Index: ' + response.args.artIndex+"<br>Hash Stored: "+web3.toUtf8(response.args.hashOfArt) +"<br>";
              document.getElementById("p1").textContent = "something changed!";
              console.log(data);
          });
        });
  }



};



/*
  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
*/

// Previewing artwork before upload
function hashImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            fileResult=reader.result;
            //var hash = crypto.subtle.digest("SHA-256", fileResult);
            hash = 'randomStringToActAsHash' + Date.now().toString();
            document.getElementById('hashDisplay').textContent=hash;
        }

        reader.readAsBinaryString(input.files[0]);
    }
}


// Previewing artwork before upload
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('blah').src=e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}


$("#fileToUpload").change(function(){
    readURL(this);
    hashImage(this);
});

//Load artIndex
Cryptoart.loadArtData = function(index) {
	console.log("In show art actions.");
	Cryptoart.currentartIndex = index;
	Cryptoart.ArtState.artData.artIndex = index;
	// var index = Cryptoart.currentArtIndex;
	var address = Cryptoart.ArtState.account;
	console.log("Local address='" + address + "'");
	Cryptoart.artContract.call().artIndexToAddress(index, function(error, result){
		if(!error) {
			console.log("Owner: '" + result + "'");
            Cryptoart.ArtState.artData.owner = result;
			if (address == result) {
				console.log(" - Is owner!");
				Cryptoart.ArtState.isOwner = true;
			} else {
                Cryptoart.ArtState.isOwner = false;
				console.log(" - Is not owner.");
			}

            Cryptoart.ArtState.loadingDone.owner = true;
		} else {
			console.log(error);
		}
	});


    Cryptoart.artContract.artOfferedForSale(index, function (error, result) {
        if (!error) {
            Cryptoart.ArtState.forSale = result[0];
            if (result[0]) {
                Cryptoart.ArtState.artData.offerValue = result[3];
                Cryptoart.ArtState.artData.onlySellTo = result[4];
                console.log("Art for sale for " + Cryptoart.ArtState.artData.offerValue + " to " + Cryptoart.ArtState.artData.onlySellTo);
            }
            if (Cryptoart.NULL_ADDRESS == result[4] || result[4] == address) {
                Cryptoart.ArtState.canBuy = true;
            } else {
                Cryptoart.ArtState.canBuy = false;
            }
            console.log(result);

            Cryptoart.ArtState.loadingDone.offer = true;
        } else {
            console.log(error);
        }
    });

    Cryptoart.artContract.artBids(index, function(error, result){
        if(!error) {
            Cryptoart.ArtState.hasBid = result[0];
            Cryptoart.ArtState.ownsBid = result[2] == address;
            if (Cryptoart.ArtState.hasBid) {
                Cryptoart.ArtState.artData.bidder = result[2];
                Cryptoart.ArtState.artData.bidValue = result[3];
            }
            console.log(result);
            Cryptoart.ArtState.loadingDone.bid = true;
        } else {
            console.log(error);
        }
    });

    if (!Cryptoart.ArtState.web3UsingInfura) {
        // Transfer events don't filter properly because punkIndex isn't indexed in the event, so just get em all :/

        /*var transferEvents = Cryptoart.artContract.ArtTransfer({punkIndex: Cryptoart.currentArtIndex},
            {fromBlock: Cryptoart.EVENT_START_BLOCK, toBlock: 'latest'},
            function (error, log) {
                // console.log("Transfer event for punk index: " + log.args.punkIndex);
                if (log.args.artIndex == Cryptoart.currentArtIndex) {
                    console.log("Found transfer event for this artwork.")
                    Cryptoart.ArtState.events.transfers.push(log);
                    Cryptoart.addToAllEvents(log);
                }
            });

        var bidEvent = Cryptoart.punkContract.ArtBidEntered({punkIndex: Cryptoart.currentPunkIndex},
            {fromBlock: Cryptoart.EVENT_START_BLOCK, toBlock: 'latest'});
        var allBidEvents = bidEvent.get(function (error, logs) {
            for (var i = 0; i < logs.length; i++) {
                var log = logs[i];
                if (log.args.artIndex == Cryptoart.currentArtIndex) {
                    console.log("Loaded bid event for this art: " + log.args.value);
                    Cryptoart.ArtState.events.bids.push(log);
                    Cryptoart.addToAllEvents(log);
                }
            }

            // Now that we have bid events, can load punk bought events and correct values
            var soldEvents = Cryptoart.artContract.ArtBought({punkIndex: Cryptoart.currentartIndex},
                {fromBlock: Cryptoart.EVENT_START_BLOCK, toBlock: 'latest'},
                function (error, log) {
                    // console.log("Transfer event for punk index: " + log.args.punkIndex);
                    if (log.args.artIndex == Cryptoart.currentArtIndex) {
                        console.log("Found bought for artwork " + log.args.artIndex);
                        if (log.args.value.isZero()) {
                            console.log("  Incorrect value, need to correct.");
                            var thisBlockNum = log.blockNumber;
                            for (var i = Cryptoart.ArtState.events.bids.length - 1; i >= 0; i--) {
                                var bid = Cryptoart.ArtState.events.bids[i];
                                if (bid.blockNumber < thisBlockNum) {
                                    console.log("  Found bid for event.");
                                    log.args.value = bid.args.value;
                                    log.args.toAddress = bid.args.fromAddress;
                                    break;
                                }
                            }
                        }
                        Cryptoart.ArtState.events.bought.push(log);
                        Cryptoart.addToAllEvents(log);
                    }
                });

        });
        var bidEvents = Cryptoart.artContract.ArtBidEntered().watch(
            function (error, log) {
                if (log.args.punkIndex == Cryptoart.currentArtIndex) {
                    console.log("Found new bid event for this artwork.");
                    Cryptoart.ArtState.events.bids.push(log);
                    Cryptoart.addToAllEvents(log);
                }
            });

        var bidWidthdrawnEvents = Cryptoart.artContract.ArtBidWithdrawn({artIndex: Cryptoart.currentArtIndex},
            {fromBlock: Cryptoart.EVENT_START_BLOCK, toBlock: 'latest'},
            function (error, log) {
                if (log.args.artIndex == Cryptoart.currentArtIndex) {
                    console.log("Found bid withdrawn event for this artwork.")
                    Cryptoart.ArtState.events.bidsWithdrawn.push(log);
                    Cryptoart.addToAllEvents(log);
                }
            });

        var offeredForSaleEvents = Cryptoart.artContract.ArtOffered({punkIndex: Cryptoart.currentArtIndex},
            {fromBlock: Cryptoart.EVENT_START_BLOCK, toBlock: 'latest'},
            function (error, log) {
                if (log.args.artIndex == Cryptoart.currentArtIndex) {
                    console.log("Found artwork offer event for this artwork.");
                    Cryptoart.ArtState.events.offeredForSale.push(log);
                    Cryptoart.addToAllEvents(log);
                }
            });
            */


        var claimEvents = Cryptoart.artContract.ArtCreation({artIndex: Cryptoart.currentArtIndex},
            {fromBlock: Cryptoart.EVENT_START_BLOCK, toBlock: 'latest'},
            function (error, log) {
                if (log.args.artIndex == Cryptoart.currentArtIndex) {
                    console.log("Found ArtCreation event for this artwork.");
                    Cryptoart.ArtState.events.claimed.push(log);
                    Cryptoart.addToAllEvents(log);
                    Cryptoart.ArtState.artData.hashValue = result[1];
                }
                else {
                  console.log(error);
                }

                Cryptoart.ArtState.loadingDone.eventsAssigned = true;
            });

    } else {
        console.log("Not loading cart events because current web3 doesn't support it.")
        Cryptoart.ArtState.loadingDone.eventsClaimed = true;
    }
};




$(function() {
  $(window).load(function() {
    App.init();
  });
});
