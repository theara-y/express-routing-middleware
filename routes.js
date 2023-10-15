const express = require('express');
const router = express.Router();

let items = require('./fakeDb');
const NotFoundError = require('./error');

router.get('/', (req, res) => {
    return res.json(items);
});

router.get('/:name', (req, res, next) => {
    for(let item of items) {
        if(item.name == req.params.name)
            return res.json(item);
    }
    return next(new NotFoundError('Item not found.', 404));
});

router.post('/', (req, res) => {
    let form = req.body;
    items.push(form);
    return res.json({'added': form});
});

router.patch('/:name', (req, res, next) => {
    let {name, price} = req.body;
    for(let item of items) {
        if(item.name == req.params.name) {
            item.name = name;
            item.price = price;
            return res.json({'updated': item})
        }
    }
    return next(new NotFoundError('Item not found.', 404))
});

router.delete('/:name', (req, res, next) => {
    for(let i = 0; i < items.length; i++) {
        let item = items[i];
        if(item.name == req.params.name) {
            items = items.slice(0, i).concat(items.slice(i + 1));
            return res.json({'message': 'Deleted'})
        }
    }
    return next(new NotFoundError('Item not found.', 404))
});


module.exports = router;