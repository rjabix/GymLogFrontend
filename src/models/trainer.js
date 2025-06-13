// src/Trainer.js
export default class Trainer {
  constructor(id, name, email, phone, imageUrl) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.imageUrl = imageUrl; // Zostawiamy, bo może być przydatne w przyszłości
  }
}

export function generateMockupTrainers() {
  return [
    new Trainer(1, 'Wojtek Dziewulowski', 'wojtazzz@gmail.com', '123-456-789', 'trainer_wojtek.png'),
    new Trainer(2, 'Jakub Kowalski', 'jak.kon@gmail.com', '987-654-321', 'trainer_jakub.png'),
    new Trainer(3, 'Janek Kochagąski', 'jan.kochas@gmail.com', '555-111-222', 'trainer_janek.png'),
    new Trainer(4, 'Adam Mickiewiczówny', 'adm.mic@gmail.com', '333-888-999', 'trainer_adam.png'),
    new Trainer(5, 'Mateusz Waligórski', 'waligora@gmail.com', '777-444-666', 'trainer_mateusz.png'),
  ];
}
