const express = require('express')
const router = express.Router()
const Question = require('./models/questions')
const User = require('./models/user');

// get all quiz questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find()
        return res.status(200).json(questions)
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// get one quiz question
router.get('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const question = await Question.findOne({ _id })
        if (!question) {
            return res.status(404).json({})
        } else {
            return res.status(200).json(question)
        }
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// create one quiz question
router.post('/questions', async (req, res) => {
    try {
        const { question, options, correctOption } = req.body

        const newQuestion = await Question.create({
            question, options, correctOption
        })

        return res.status(201).json(newQuestion)
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// update one quiz question
router.put('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const { question, options, correctOption } = req.body

        let questionExists = await Question.findOne({ _id })

        if (!questionExists) {
            const newQuestion = await Question.create({
                question, options, correctOption
            })
            return res.status(201).json(newQuestion)
        } else {
            questionExists.question = question
            questionExists.options = options
            questionExists.correctOption = correctOption
            await questionExists.save()
            return res.status(200).json(questionExists)
        }
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// delete one quiz question
router.delete('/questions/:id', async (req, res) => {
    try {
        const _id = req.params.id

        const question = await Question.deleteOne({ _id })

        if (question.deletedCount === 0) {
            return res.status(404).json()
        } else {
            return res.status(204).json({ question })
        }
    } catch (error) {
        return res.status(500).json({ "error": error })
    }
})

// this one is just a test
router.get('/', (req, res) => {
    res.send('H3ll0 W0RlD')
})


router.post('/submit', async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const submittedAnswers = req.body.answers;
        const userAnswers = submittedAnswers.map(answer => answer.userAnswer);

        const correctAnswers = await Question.find().select('correctAnswer');
        const correctAnswerIndices = correctAnswers.map(answer => answer.correctAnswer);

        let score = 0;
        userAnswers.forEach((userAnswer, index) => {
            if (userAnswer === correctAnswerIndices[index]) {
                score++;
            }
        });

        user.score = score;
        await user.save();

        res.json({ message: 'Submission successful', score: score });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router