export default class Training {
  constructor(id, user_id, start_time, end_time) {
    this.id = id; // Unique identifier for the training session
    this.user_id = user_id; // ID of the user who performed the training
    this.start_time = start_time; // Start time of the training session (Date object or string)
    this.end_time = end_time; // End time of the training session (Date object or string)
  }
}
