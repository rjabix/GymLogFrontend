// src/Exercise.js
export default class Exercise {
  constructor(id, name, description) {
    this.id = id; // ID szablonu ćwiczenia
    this.name = name;
    this.description = description;
  }
}

export function generateMockupExercises() {
  return [
    new Exercise(101, 'Biceps Curl', 'An exercise targeting the biceps muscles.'),
    new Exercise(102, 'Bench Press', 'A compound exercise for chest, shoulders, and triceps.'),
    new Exercise(103, 'Deadlift', 'A compound exercise for the back, glutes, and legs.'),
    new Exercise(104, 'Squat', 'A fundamental leg exercise.'),
    new Exercise(105, 'Overhead Press', 'Shoulder strength exercise.'),
  ];
}
