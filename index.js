const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
	{ id: 1, name: 'course1' },
	{ id: 2, name: 'course2' },
	{ id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
	res.send(courses);
});

// :id is a route parameter
app.get('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));
	// return 404 if not found
	if (!course) {
		res.status(404).send('The course with the given ID was not found');
	}

	res.send(course);
});

// : is a route parameter
app.get('/api/courses/:year/:month', (req, res) => {
	res.send(req.params);
});

app.post('/api/courses', (req, res) => {
	const { error } = validateCourse(req.body);
	if (error) {
		res.status(400).send(error.details[0].message);
		return;
	}

	const course = {
		id: courses.length + 1,
		name: req.body.name
	};

	courses.push(course);
	res.send(course);
});

// update logic
app.put('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));

	if (!course) {
		res.status(404).send('The course with the given ID was not found');
		return;
	}

	const { error } = validateCourse(req.body);
	if (error) {
		res.status(400).send(error.details[0].message);
		return;
	}

	// update course
	course.name = req.body.name;
	res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
	const course = courses.find(c => c.id === parseInt(req.params.id));

	if (!course) {
		res.status(404).send('The course with the given ID was not found');
		return;
	}

	const index = courses.indexOf(req.params.id);
	courses.splice(index, 1);

	res.send(courses);

});

function validateCourse(course)
{
	const schema = {
		name: Joi.string().min(3).required()
	};

	return Joi.validate(course, schema);
}

// can't rely on this port because on a server, this number is dynamic
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));