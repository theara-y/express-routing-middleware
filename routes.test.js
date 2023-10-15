process.env.NODE_ENV = 'test';

const testClient = require('supertest');
const app = require('./app');
const items = require('./fakeDb')

describe('Test items endpoint', () => {
    beforeEach(() => {
        let item = {
            'name': 'Doritos',
            'price': 1.99
        };
        items.push(item);
    });

    afterEach(() => {
        items.length = 0;
    });

    test('GET /items', async () => {
        const res = await testClient(app)
            .get('/items');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([
            {
                'name': 'Doritos',
                'price': 1.99
            }
        ]);
    });

    test('GET /items/:name', async () => {
        const res = await testClient(app)
            .get('/items/Doritos');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            {
                'name': 'Doritos',
                'price': 1.99
            }
        );
    })

    test('GET /items/:name 404', async () => {
        const res = await testClient(app)
            .get('/items/Nachos')

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({'message': 'Item not found.'});
    })

    test('POST /items/', async () => {
        let res = await testClient(app)
            .post('/items')
            .send(
                {
                    'name': 'Milk',
                    'price': 4.99 
                }
            );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            'added': {
                'name': 'Milk',
                'price': 4.99 
            }
        });
        res = await testClient(app).get('/items')
        expect(res.body.length).toBe(2);
    })

    test('PATCH /items/:name', async () => {
        let res = await testClient(app)
            .patch('/items/Doritos')
            .send(
                {
                    'name': 'Pringles',
                    'price': .99 
                }
            );

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            'updated': {
                'name': 'Pringles',
                'price': .99 
            }
        });

        res = await testClient(app).get('/items/Doritos');
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({'message': 'Item not found.'});
        res = await testClient(app).get('/items/Pringles');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            'name': 'Pringles',
            'price': .99 
        });
    })

    test('PATCH /items/:name 404', async () => {
        const res = await testClient(app)
            .patch('/items/Nachos')
            .send(
                {
                    'name': 'Pringles',
                    'price': .99 
                }
            );

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({'message': 'Item not found.'});
    })

    test('DELETE /items/:name', async () => {
        let res = await testClient(app)
            .delete('/items/Doritos');

        expect(items.length).toBe(1);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({'message': 'Deleted'});
        res = await testClient(app).get('/items')
        expect(res.body.length).toBe(0);
    })
});