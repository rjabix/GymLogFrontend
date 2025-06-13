export default class PerformedExercise {
  constructor(id, exerciseId, userId, sets, reps, weight, date, trainingId) {
    this.id = id;
    this.trainingId = trainingId;
    this.exerciseId = exerciseId;
    this.userId = userId;
    this.sets = sets;
    this.reps = reps;
    this.weight = weight;
    this.date = date;
  }

  static fromJSON(json) {
    return new PerformedExercise(
      json.id,
      json.exerciseId,
      json.user_id,
      json.sets,
      json.reps,
      json.weight,
      json.date
    );
  }
}
