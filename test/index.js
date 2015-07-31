var test = require('tap').test;
var Ymlp = require("../");

var config = {
    api_key: "",
    username: "",
    dummy_email: "dummy@dummy.com",
    dummy_group: "node-ymlp-test",
    dummy_field: "node-ymlp-test",
    dummy_filter: "node-ymlp-test"
};

var should = require('should');

describe('Pre-requisites', function() {
    it('The API key must be set in test/index.js', function() {
        config.should.have.property("api_key");
        config.api_key.should.not.be.empty();
    });

    it('The Username must be set in test/index.js', function() {
        config.should.have.property("username");
        config.username.should.not.be.empty();
    });
});

var ymlp = new Ymlp(config.api_key, config.username);

describe('Ping', function() {
    it('should send a request and get a response', function(done) {
        should.doesNotThrow(function() {
            ymlp.ping(function(err, success) {
                if(err) throw err;
                success.should.be.ok();
                done();
            });
        });
    });
});

describe('Contacts', function() {
    describe('Add', function() {
        it('should successfully add '+ config.dummy_email +' into the contact list', function(done) {
            should.doesNotThrow(function() {
                ymlp.contacts("Add", {
                    "email": config.dummy_email,
                    "groupid": 1
                }, function(err, response) {
                    if(err) throw err;

                    response.should.equal(config.dummy_email +" has been added");

                    done();
                });
            });
        });
    });

    describe('GetList', function() {
        it('should retrieve the list and includes the dummy email ('+ config.dummy_email +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.contacts("GetList", function(err, list) {
                    if(err) throw err;
                    list.should.be.an.instanceOf(Array);

                    var builtList = [];
                    for(var idx in list) {
                        builtList.push(list[idx].EMAIL);
                    }

                    builtList.should.containEql(config.dummy_email);
                    done();
                });
            });
        });
    });

    describe('GetContact', function() {
        it('should retrieve the information about the dummy email ('+ config.dummy_email +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.contacts("GetContact", {
                    "email": config.dummy_email
                },function(err, info) {
                    if(err) throw err;
                    info.should.be.an.instanceOf(Object);
                    info.should.have.property('EMAIL');
                    info.EMAIL.should.equal(config.dummy_email);
                    done();
                });
            });
        });
    });

    describe('Unsubscribe', function() {
        it('should unsubscribe the dummy email ('+ config.dummy_email +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.contacts("Unsubscribe", {
                    "email": config.dummy_email
                },function(err, resp) {
                    if(err) throw err;
                    resp.should.equal(config.dummy_email +' has been unsubscribed');
                    done();
                });
            });
        });
    });

    describe('GetUnsubscribed', function() {
        it('should retrieve the list and includes the dummy email ('+ config.dummy_email +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.contacts("GetUnsubscribed", function(err, list) {
                    if(err) throw err;
                    list.should.be.an.instanceOf(Array);

                    var builtList = [];
                    for(var idx in list) {
                        builtList.push(list[idx].EMAIL);
                    }

                    builtList.should.containEql(config.dummy_email);
                    done();
                });
            });
        });
    });

    describe('Add (Forced)', function() {
        it('should successfully force add '+ config.dummy_email +' into the contact list', function(done) {
            should.doesNotThrow(function() {
                ymlp.contacts("Add", {
                    "email": config.dummy_email,
                    "groupid": 1,
                    "OverruleUnsubscribedBounced": 1
                }, function(err, response) {
                    if(err) throw err;

                    response.should.equal(config.dummy_email +" has been added");

                    done();
                });
            });
        });
    });

    describe('Delete', function() {
        it('should delete the dummy email ('+ config.dummy_email +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.contacts("Delete", {
                    "email": config.dummy_email,
                    "groupid": 1
                },function(err, resp) {
                    if(err) throw err;
                    resp.should.equal(config.dummy_email +' has been removed');
                    done();
                });
            });
        });
    });

    describe('GetDeleted', function() {
        it('should retrieve the list and includes the dummy email ('+ config.dummy_email +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.contacts("GetDeleted", function(err, list) {
                    if(err) throw err;
                    list.should.be.an.instanceOf(Array);

                    var builtList = [];
                    for(var idx in list) {
                        builtList.push(list[idx].EMAIL);
                    }

                    builtList.should.containEql(config.dummy_email);
                    done();
                });
            });
        });
    });

    describe('GetBounced', function() {
        it('should retrieve the list of emails removed due to bounced (only testing http connectivity)', function(done) {
            should.doesNotThrow(function() {
                ymlp.contacts("GetBounced", function(err, list) {
                    if(err) throw err;
                    list.should.be.an.instanceOf(Array);
                    done();
                });
            });
        });
    });
});

var idOfDummyGroup = -1;

describe('Groups', function() {
    describe('Add', function() {
        it('should successfully add '+ config.dummy_group +' into the group list', function(done) {
            should.doesNotThrow(function() {
                ymlp.groups("Add", {
                    "groupname": config.dummy_group,
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("ID:");
                    done();
                });
            });
        });
    });

    describe('GetList', function() {
        it('should retrieve the list and includes the dummy group ('+ config.dummy_group +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.groups("GetList", function(err, list) {
                    if(err) throw err;
                    list.should.be.an.instanceOf(Array);

                    var builtList = [];
                    for(var idx in list) {
                        builtList.push(list[idx].GroupName);
                        if(list[idx].GroupName == config.dummy_group) {
                            idOfDummyGroup = list[idx].ID;
                        }
                    }

                    builtList.should.containEql(config.dummy_group);
                    done();
                });
            });
        });

        it('should have set the unique id of dummy group', function() {
            idOfDummyGroup.should.not.equal(-1);
        });
    });

    describe('Update', function() {
        it('should successfully update '+ config.dummy_group +'', function(done) {
            should.doesNotThrow(function() {
                ymlp.groups("Update", {
                    "groupid": idOfDummyGroup,
                    "groupname": config.dummy_group+'-renamed',
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("Updated ID: "+ idOfDummyGroup);
                    done();
                });
            });
        });
    });

    describe('Empty', function() {
        it('should successfully empty the group '+ config.dummy_group +'', function(done) {
            should.doesNotThrow(function() {
                ymlp.groups("Empty", {
                    "groupid": idOfDummyGroup,
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("Emptied ID:");
                    done();
                });
            });
        });
    });

    describe('Delete', function() {
        it('should successfully delete '+ config.dummy_group +'', function(done) {
            should.doesNotThrow(function() {
                ymlp.groups("Delete", {
                    "groupid": idOfDummyGroup,
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("Removed ID:");
                    done();
                });
            });
        });
    });
});

var idOfDummyField = -1;

describe('Fields', function() {
    describe('Add', function() {
        it('should successfully add '+ config.dummy_field +' into the fields list', function(done) {
            should.doesNotThrow(function() {
                ymlp.fields("Add", {
                    "fieldname": config.dummy_group,
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("ID:");
                    done();
                });
            });
        });
    });

    describe('GetList', function() {
        it('should retrieve the list and includes the dummy field ('+ config.dummy_field +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.fields("GetList", function(err, list) {
                    if(err) throw err;
                    list.should.be.an.instanceOf(Array);

                    var builtList = [];
                    for(var idx in list) {
                        builtList.push(list[idx].FieldName);
                        if(list[idx].FieldName == config.dummy_field) {
                            idOfDummyField = list[idx].ID;
                        }
                    }

                    builtList.should.containEql(config.dummy_field);
                    done();
                });
            });
        });

        it('should have set the unique id of dummy field', function() {
            idOfDummyField.should.not.equal(-1);
        });
    });

    describe('Update', function() {
        it('should successfully update '+ config.dummy_field +'', function(done) {
            should.doesNotThrow(function() {
                ymlp.fields("Update", {
                    "fieldid": idOfDummyField,
                    "fieldname": config.dummy_field+'-renamed',
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("Updated ID: "+ idOfDummyField);
                    done();
                });
            });
        });
    });

    describe('Delete', function() {
        it('should successfully delete '+ config.dummy_field +'', function(done) {
            should.doesNotThrow(function() {
                ymlp.fields("Delete", {
                    "fieldid": idOfDummyField,
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("Removed ID:");
                    done();
                });
            });
        });
    });
});

var idOfDummyFilter = -1;

describe('Filters', function() {
    describe('Add', function() {
        it('should successfully add a filter', function(done) {
            should.doesNotThrow(function() {
                ymlp.filters("Add", {
                    "filtername": config.dummy_filter,
                    "field": "Date",
                    "operand": "Before",
                    "value": "2015-07-01"
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("ID:");
                    done();
                });
            });
        });
    });

    describe('GetList', function() {
        it('should retrieve the list and includes the dummy filter ('+ config.dummy_filter +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.filters("GetList", function(err, list) {
                    if(err) throw err;
                    list.should.be.an.instanceOf(Array);

                    var builtList = [];
                    for(var idx in list) {
                        builtList.push(list[idx].FilterName);
                        if(list[idx].FilterName == config.dummy_filter) {
                            idOfDummyFilter = list[idx].ID;
                        }
                    }

                    builtList.should.containEql(config.dummy_filter);
                    done();
                });
            });
        });

        it('should have set the unique id of dummy filter', function() {
            idOfDummyFilter.should.not.equal(-1);
        });
    });

    describe('Delete', function() {
        it('should successfully delete '+ config.dummy_filter +'', function(done) {
            should.doesNotThrow(function() {
                ymlp.filters("Delete", {
                    "filterid": idOfDummyFilter,
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("Removed ID:");
                    done();
                });
            });
        });
    });
});

var idOfDummyFrom = "";

describe('Newsletters', function() {
    describe('AddFrom', function() {
        it('should successfully add an authorized expeditor ('+ config.dummy_email +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.newsletter("AddFrom", {
                    "fromemail": config.dummy_email,
                    "fromname": "Dummy Test"
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("ID:");
                    done();
                });
            });
        });
    });

    describe('GetFroms', function() {
        it('should retrieve the list of the authorized expeditors and include the dummy one ('+ config.dummy_email +')', function(done) {
            should.doesNotThrow(function() {
                ymlp.newsletter("GetFroms", function(err, list) {
                    if(err) throw err;
                    list.should.be.an.instanceOf(Array);

                    var builtList = [];
                    for(var idx in list) {
                        builtList.push(list[idx].FromEmail);
                        if(list[idx].FromEmail == config.dummy_email) {
                            idOfDummyFrom = list[idx].FromID;
                        }
                    }

                    builtList.should.containEql(config.dummy_email);
                    done();
                });
            });
        });

        it('should have set the unique id of dummy expeditor', function() {
            idOfDummyFrom.should.not.be.empty();
        });
    });

    describe('DeleteFrom', function() {
        it('should successfully delete '+ config.dummy_email +' expeditor', function(done) {
            should.doesNotThrow(function() {
                ymlp.newsletter("DeleteFrom", {
                    "fromid": idOfDummyFrom
                }, function(err, response) {
                    if(err) throw err;
                    response.should.startWith("Removed ID:");
                    done();
                });
            });
        });
    });

    describe('Send', function() {
        this.timeout(5000); // Increases timeout (long call).

        it('should successfully send an email (or at least, add it to the queue)', function(done) {
            should.doesNotThrow(function() {
                ymlp.newsletter("Send", {
                    "Subject": "Test Message (node-ymlp module)",
                    "Text": "This is a test message from node-ymlp test module.",
                    "TestMessage": "1"
                }, function(err, response) {
                    if(err) throw err;
                    response.should.equal("Message queued for delivery");
                    done();
                });
            });
        });
    });
});

describe('Archives', function() {
    describe('GetList', function() {
        it('should retrieve the list of archives', function(done) {
            should.doesNotThrow(function() {
                ymlp.archive("GetList", function(err, list) {
                    if(err) throw err;
                    list.should.be.an.instanceOf(Array);
                    done();
                });
            });
        });
    });
});
