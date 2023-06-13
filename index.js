const express = require('express');
const cors = require('cors');
const corsConfigs = require('./config/corsConfig');
const app = express();
const port = 3001;
const Joi = require('joi');

app.use(express.json());
app.use(cors(corsConfigs));

let data = [];

const feedbackSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    mood: Joi.number().valid(0, 1, 2).required(),
    feedback: Joi.string().required()
});

function validateRequestBody(req, res, next) {
    const { error } = feedbackSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
}

// Get all feedbacks
app.get('/feedbacks', (req, res) => {
    res.json(data);
});

// Create a new feedback
app.post('/feedbacks', validateRequestBody, (req, res) => {
    const item = req.body;
    data.push(item);
    res.status(201).json(item);
});

app.listen(port, () => {
    console.log('Server is listening on port 3001');
});
