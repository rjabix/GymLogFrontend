// src/Exercise.js
export default class Exercise {
  constructor(id, name, description, isCountedInRankings = false) {
    this.id = id; // ID szablonu ćwiczenia
    this.name = name;
    this.description = description;
    this.IsCountedInRankings = isCountedInRankings || false; // Domyślnie ustawione na true, można zmienić w bazie danych
  }
}

export function generateMockupExercises() {
  return [
    new Exercise(101, 'Biceps Curl', 'An exercise targeting the biceps muscles.', true),
    new Exercise(102, 'Bench Press', 'A compound exercise for chest, shoulders, and triceps.', true),
    new Exercise(103, 'Deadlift', 'A compound exercise for the back, glutes, and legs.', true),
    new Exercise(104, 'Squat', 'A fundamental leg exercise.', true),
    new Exercise(105, 'Overhead Press', 'Shoulder strength exercise.'),
  ];
}
