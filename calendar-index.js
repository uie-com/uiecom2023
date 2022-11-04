var express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let events = {
    1: {
        id: '1',
        title: 'Win Info Session',
    },
    2: {
        id: '2',
        title: 'TUXS Talk',
    },
};

app.get('/events', (req, res) => {
    return res.send(Object.values(events));
});

app.get('/events/:eventsId', (req, res) => {
    return res.send(events[req.params.eventsId]);
});

app.post('/events', (req, res) => {
    const id = uuid();
    const event = {
        id,
        title: req.body.title
    };

    event[id] = events

    return res.send(event);
});

app.put('/', (req, res) => {
    return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
    return res.send('Received a DELETE HTTP method');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
