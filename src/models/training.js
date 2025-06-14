import {
  generateMockupPerformedExercises,
  generateMockupPerformedExercisesForOnePerson
} from "@/models/performed_exercise.js";

export default class Training {
  constructor(id, user_id, start_time, end_time, exercises = []) {
    this.id = id; // Unique identifier for the training session
    this.user_id = user_id; // ID of the user who performed the training
    this.start_time = start_time; // Start time of the training session (Date object or string)
    this.end_time = end_time; // End time of the training session (Date object or string)
    this.exercises = exercises; // Array to hold exercises associated with the training session
  }
}

export function generateMockupTrainingsForOnePerson() {
  const performedExercises = generateMockupPerformedExercisesForOnePerson();
  const trainingsMap = new Map();
  let baseDate = new Date('2025-06-01'); // Starting date for the mockup trainings

  performedExercises.forEach((exercise) => {
    if (!trainingsMap.has(exercise.trainingId)) {
      const trainingDate = new Date(baseDate); // Create a new date instance to avoid modifying `baseDate`

      // Generate random hours (6 AM to 8 PM) and minutes (0 to 59)
      const randomHour = Math.floor(Math.random() * (20 - 6 + 1)) + 6;
      const randomMinute = Math.floor(Math.random() * 60);

      // Set start and end times
      const startTime = new Date(trainingDate.setHours(randomHour, randomMinute, 0));
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

      trainingsMap.set(exercise.trainingId, {
        id: exercise.trainingId,
        user_id: exercise.userId,
        start_time: startTime,
        end_time: endTime,
        exercises: [],
      });
      baseDate.setDate(baseDate.getDate() + 1); // Increment the date for the next training
    }
    trainingsMap.get(exercise.trainingId).exercises.push(exercise);
  });

  return Array.from(trainingsMap.values()).map(
    (training) =>
      new Training(
        training.id,
        training.user_id,
        training.start_time,
        training.end_time,
        training.exercises
      )
  );
}
