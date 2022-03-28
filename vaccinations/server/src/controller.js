"use strict";

var model = require("./model.js");

module.exports.query = query;
module.exports.save = save;
module.exports.show = show;
module.exports.update = update;
module.exports.remove = remove;

module.exports.queryRelationship = queryRelationship;
module.exports.saveRelationship = saveRelationship;
module.exports.showRelationship = showRelationship;
module.exports.updateRelationship = updateRelationship;
module.exports.removeRelationship = removeRelationship;

module.exports.getVaccinations = getVaccinations;
module.exports.getVaccination = getVaccination;
module.exports.saveVaccination = saveVaccination;
module.exports.getPerson = getPerson;

const vaccinationsFileName = "vaccinations"
const vaccinesFileName = "vaccines";

function getVaccinations(req, res) {
    model.load(vaccinationsFileName, function(vaccinations) {
        model.load(vaccinesFileName, function(vaccines) {
            console.log(req.query)

            if (req.query.filter){
                req.query.filter = JSON.parse(req.query.filter)

                if (req.query.filter.vaccine_id > 0) {
                    vaccinations = vaccinations.filter(function(vaccination) {
                        return vaccination.vaccine_id == req.query.filter.vaccine_id
                    });
                }
                vaccinations = vaccinations.filter(function(vaccination) {
                    return vaccination.personal_number.includes(req.query.filter.personal_number)
                });
            }
            for (let itVaccination of vaccinations) {
                for (let itVaccine of vaccines) {
                    if (itVaccination.vaccine_id == itVaccine._id) {
                        itVaccination.vaccine = itVaccine
                        delete itVaccination.vaccine_id
                    }
                }
            }
            let count = vaccinations.length
            vaccinations = pagination(vaccinations, req.query.page, req.query.pageSize)
    
            res.status(200).json({count: count, results: vaccinations})
        })
    })
}

function getVaccination(req, res) {
    model.load(vaccinationsFileName, function(vaccinations) {
        model.load(vaccinesFileName, function(vaccines) {
            console.log(req.params.id)

            for (let itVaccination of vaccinations) {
                if (req.params.id == itVaccination._id) {
                    for (let itVaccine of vaccines) {
                        if (itVaccination.vaccine_id == itVaccine._id) {
                            itVaccination.vaccine = itVaccine
                            delete itVaccination.vaccine_id

                            res.status(200).json(itVaccination);
                            return;
                        }
                    }
                }
            }
            res.status(404).json({});
        });
    });
}

const personal_number_regex = new RegExp("^[0-9]+$")

function saveVaccination(req, res) {
    model.load(vaccinationsFileName, function(vaccinations) {
        model.load(vaccinesFileName, function(vaccines) {
            console.log(req.body)

            let personal_number = req.body.personal_number;
            if (!personal_number || !personal_number_regex.test(personal_number)) {
                res.status(400).json("Invalid personal number!")
                return
            }
            let name = req.body.name;
            if (!name || name.length < 2) {
                res.status(400).json("Invalid name!")
                return
            }
            let healthcare_institution = req.body.healthcare_institution;
            if (!healthcare_institution || healthcare_institution.length <= 0) {
                res.status(400).json("Invalid healthcare institution!")
                return
            }
            let vaccine_id = 0;
            if (req.body.vaccine._id) {
                for (let itVaccine of vaccines) {
                    if (req.body.vaccine._id == itVaccine._id) {
                        vaccine_id = req.body.vaccine._id
                        break
                    }
                }
            }
            if (vaccine_id <= 0) {
                res.status(400).json("Invalid vaccine!")
                return
            }

            let last_id = 1
            if (vaccinations.length > 0) {
                last_id = parseInt(vaccinations[vaccinations.length - 1]._id)
            }
            let id = last_id + 1

            let vaccination = {
                _id: id,
                personal_number: personal_number,
                name: name,
                healthcare_institution: healthcare_institution,
                vaccine_id: vaccine_id
            }
            for (let itVaccination of vaccinations) {
                if (itVaccination.personal_number == personal_number) {
                    itVaccination.name = name
                }
            }
            vaccinations.push(vaccination);
            model.save(vaccinationsFileName, vaccinations);

            req.body._id = id
            res.status(200).json(req.body);
        });
    });
}

function getPerson(req, res) {
    model.load(vaccinationsFileName, function(vaccinations) {
        model.load(vaccinesFileName, function(vaccines) {
            console.log(req.params.personal_number)

            let person = {
                personal_number: "",
                name: "",
                vaccinations: []
            }
            for (let itVaccination of vaccinations) {
                if (req.params.personal_number == itVaccination.personal_number) {
                    for (let itVaccine of vaccines) {
                        if (itVaccination.vaccine_id == itVaccine._id) {
                            itVaccination.vaccine = itVaccine
                            delete itVaccination.vaccine_id

                            person.personal_number = itVaccination.personal_number
                            person.name = itVaccination.name
                            person.vaccinations.push(itVaccination)
                        }
                    }
                }
            }
            if (person.vaccinations.length > 0) {
                res.status(200).json(person);
                return;
            }
            res.status(404).json({});
        });
    });
}

function query(req, res) {
    model.load(req.params.entity, function(entities) {
        
        if(req.query.sort) {
            entities = sort(entities, req.query.sort, req.query.sortDirection);
        }
        if(req.query.filter){
            req.query.filter = JSON.parse(req.query.filter);
        }
        console.log(req.query);
        for(var key in req.query.filter) {            
            entities = entities.filter(function(obj) {
                if(obj[key] !== undefined) {
                    return obj[key].toString().toLowerCase().indexOf(req.query.filter[key].toLowerCase()) > -1;
                }
                return false;
            });
        }
        var count = entities.length;
        entities = pagination(entities, req.query.page, req.query.pageSize);

        res.status(200).json({count: count, results: entities});
    });
}

function save(req, res) {
    // console.log(req);
    model.load(req.params.entity, function(entities) {
        var lastId = 1
        if(entities.length > 0){
            lastId = parseInt(entities[entities.length - 1]._id);
        }
        req.body._id = lastId + 1;
        entities.push(req.body);
        model.save(req.params.entity, entities);
        res.status(200).json(req.body);
    });
}

function show(req, res) {
    model.load(req.params.entity, function(entities) {
        for(var i = 0, n = entities.length; i < n; i++) {
            var elem = entities[i];
            if(req.params.id === elem._id.toString()) {
                res.status(200).json(elem);
                return;
            }
        }
        res.status(404).json({});
    });
}

function update(req, res) {
    model.load(req.params.entity, function(entities) {
        for(var i = 0, n = entities.length; i < n; i++) {
            var elem = entities[i];
            if(req.params.id === elem._id.toString()) {
                entities[i] = req.body;
                model.save(req.params.entity, entities);
                res.status(200).json(elem);
                return;
            }
        }
        res.status(404).json({});
    });
}

function remove(req, res) {
    model.load(req.params.entity, function(entities) {
        for(var i = 0, n = entities.length; i < n; i++) {
            var elem = entities[i];
            if(req.params.id === elem._id.toString()) {
                entities.splice(i, 1);
                model.save(req.params.entity, entities);
                res.status(200).json(elem);
                return;
            }
        }
        res.status(404).json({});
    });
}

function sort(array, field, sortDirection) {
    if(sortDirection && sortDirection === 'desc') {
        return array.sort(function(a, b) { return (a[field] > b[field]) ? -1 : ((b[field] > a[field]) ? 1 : 0); });
    } else {
        return array.sort(function(a, b) { return (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0); });
    }
}

function pagination(array, pageNumber, pageSize) {
    pageNumber = pageNumber || 1
    pageSize = pageSize || 50;

    var endIndex = pageSize * pageNumber,
        startIndex = endIndex - pageSize;
    if(endIndex > array.length) {
        return array.slice(startIndex);
    }
    return array.slice(startIndex, endIndex);
}



function queryRelationship(req, res) {
    model.load(req.params.related, function(entities) {
        console.log(req.query);
        if(req.query.sort) {
            entities = sort(entities, req.query.sort, req.query.sortDirection);
        }
        if(!req.query.filter) {
            req.query.filter = {};
        }
        req.query.filter[req.params.entity] = req.params.entityId;
        for(var key in req.query.filter) {
            entities = entities.filter(function(obj) {
                if(obj[key] !== undefined) {
                    return obj[key].toString().toLowerCase().indexOf(req.query.filter[key].toLowerCase()) > -1;
                }
                return false;
            });
        }
        var count = entities.length;
        entities = pagination(entities, req.query.page, req.query.pageSize);

        res.status(200).json({count: count, results: entities});
    });
}

function saveRelationship(req, res) {
    model.load(req.params.related, function(entities) {
        var lastId = 1
        if(entities.length > 0){
            lastId = parseInt(entities[entities.length - 1]._id);
        }
        req.body._id = lastId + 1;
        req.body[entity] = req.params.entityId;
        entities.push(req.body);
        model.save(req.params.related, entities);
        res.status(200).json(req.body);
    });
}

function showRelationship(req, res) {
    model.load(req.params.related, function(entities) {
        for(var i = 0, n = entities.length; i < n; i++) {
            var elem = entities[i];
            if(req.params.relatedId === elem._id.toString() && req.params.entityId == elem[req.params.entity]) {
                res.status(200).json(elem);
                return;
            }
        }
        res.status(404).json({});
    });
}

function updateRelationship(req, res) {
    model.load(req.params.related, function(entities) {
        for(var i = 0, n = entities.length; i < n; i++) {
            var elem = entities[i];
            if(req.params.relatedId === elem._id.toString() && req.params.entityId == elem[req.params.entity]) {
                entities[i] = req.body;
                model.save(req.params.related, entities);
                res.status(200).json(elem);
                return;
            }
        }
        res.status(404).json({});
    });
}

function removeRelationship(req, res) {
    model.load(req.params.related, function(entities) {
        for(var i = 0, n = entities.length; i < n; i++) {
            var elem = entities[i];
            if(req.params.relatedId === elem._id.toString() && req.params.entityId == elem[req.params.entity]) {
                entities.splice(i, 1);
                model.save(req.params.related, entities);
                res.status(200).json(elem);
                return;
            }
        }
        res.status(404).json({});
    });
}