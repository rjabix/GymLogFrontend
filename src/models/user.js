export default class User{
  constructor(id, name, surname, email, role, weight, height, birth_date, profile_picture, gender, is_active) {
    this.id = id;
    this.name = name;
    this.surname = surname
    this.email = email;
    this.role = role; // e.g., 'admin', 'user'
    this.weight = weight;
    this.height = height;
    this.birth_date = birth_date; // Date object or string
    this.profile_picture = profile_picture; // URL or path to the profile picture
    this.gender = gender;
    this.is_active = is_active; // Boolean to indicate if the user is active
  }

  // Method to check if the user is an admin
  isAdmin() {
    return this.role === 'admin';
  }

  isTrainer() {
    return this.role === 'trainer';
  }

  // Method to check if the user is a regular user
  isRegularUser() {
    return this.role === 'user';
  }
}
