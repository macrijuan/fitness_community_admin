const { Router } = require("express");
const router = Router();

const postExercise = require("./post_exercise.js");
const updateExercise = require("./put_exercise.js");
const getExercise = require("./get_exercise.js");
const deleteExercise = require("./delete_exercise.js");

router.use( "/exercise", postExercise, updateExercise, getExercise, deleteExercise );

module.exports = router;