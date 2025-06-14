// src/PerformedExercise.js
export default class PerformedExercise {
  constructor(id, exerciseId, userId, userName, sets, reps, weight, date, trainingId, isVerified) {
    this.id = id; // Unikalne ID wykonanego ćwiczenia
    this.trainingId = trainingId; // ID sesji treningowej
    this.exerciseId = exerciseId; // ID szablonu ćwiczenia (z Exercise.js)
    this.userId = userId;
    this.userName = userName; // Zmieniono z UserName na userName dla spójności
    this.sets = sets;
    this.reps = reps;
    this.weight = weight;
    this.date = date;
    this.isVerified = isVerified || null; // Zmienione z false na null, aby pasowało do "evaluation" w Vue
  }
}

export function generateMockupPerformedExercises() {
  return [
    new PerformedExercise(1, 101, 1, 'Jan Kowalski', 3, 12, 50, '2025-06-13', 201),
    new PerformedExercise(2, 102, 1, 'Jan Kowalski', 4, 10, 60, '2025-06-13', 201), // Ten sam trening co wyżej
    new PerformedExercise(3, 103, 2, 'Anna Nowak', 5, 8, 70, '2025-06-12', 202),
    new PerformedExercise(4, 101, 2, 'Anna Nowak', 3, 10, 45, '2025-06-09', 203),
    new PerformedExercise(5, 102, 2, 'Anna Nowak', 4, 8, 55, '2025-06-09', 203),
    new PerformedExercise(6, 103, 3, 'Piotr Zieliński', 5, 12, 65, '2025-06-11', 204),
    new PerformedExercise(7, 101, 1, 'Jan Kowalski', 3, 12, 52, '2025-06-10', 205),
    new PerformedExercise(8, 102, 1, 'Jan Kowalski', 4, 10, 62, '2025-06-10', 205),
    new PerformedExercise(9, 103, 1, 'Jan Kowalski', 5, 8, 72, '2025-06-08', 206),
  ];
}

export function generateMockupPerformedExercisesForOnePerson() {
  return [
    new PerformedExercise(1, 101, 1, 'Jan Kowalski', 3, 12, 50, '', 201),
    new PerformedExercise(2, 102, 1, 'Jan Kowalski', 4, 10, 60, '', 201), // Ten sam trening co wyżej
    new PerformedExercise(100, 103, 1, 'Jan Kowalski', 4, 15, 60, '', 201),
    new PerformedExercise(121, 104, 1, 'Jan Kowalski', 4, 10, 60, '', 201),
    new PerformedExercise(123, 105, 1, 'Jan Kowalski', 4, 10, 60, '', 201),
    new PerformedExercise(7, 101, 1, 'Jan Kowalski', 3, 12, 52, '', 205),
    new PerformedExercise(8, 102, 1, 'Jan Kowalski', 4, 10, 62, '', 205),
    new PerformedExercise(9, 103, 1, 'Jan Kowalski', 5, 8, 72, '', 206),
    new PerformedExercise(10, 104, 1, 'Jan Kowalski', 4, 10, 65, '', 207),
    new PerformedExercise(11, 105, 1, 'Jan Kowalski', 5, 8, 75, '', 208),
    new PerformedExercise(12, 102, 1, 'Jan Kowalski', 6, 6, 80, '', 209),
  ];
}
