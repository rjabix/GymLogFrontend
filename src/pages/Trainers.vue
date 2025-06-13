<template>
  <div class="tlo">
  <div class="trainers-container">
    <h2 class="trainers-title" data-aos="fade-down" >Nasi Trenerzy</h2>

    <div class="trainers-list" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
      <div v-for="trainer in trainers" :key="trainer.id" class="trainer-card">
        <div class="trainer-info">
          <h3 class="trainer-name">{{ trainer.name }}</h3>
          <p class="trainer-contact">adres e-mail: {{ trainer.email }}</p>
          <p class="trainer-contact">telefon: {{ trainer.phone }}</p>
        </div>
        <div class="trainer-image-container">
          <img :src="getTrainerImageUrl(trainer.imageUrl)" alt="Zdjęcie trenera" class="trainer-image" v-if="trainer.imageUrl">
          <div class="trainer-image-placeholder" v-else></div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>

// Importuj funkcję do generowania mockowych danych trenerów
import {generateMockupTrainers} from "@/models/trainer.js";

export default {
  name: 'TrainersList',
  data() {
    return {
      trainers: []
    };
  },
  created() {
    this.trainers = generateMockupTrainers();
  },
  methods: {
    getTrainerImageUrl(imageName) {
      try {
        return require(`@/assets/images/${imageName}`);
      } catch (e) {
        console.warn(`Obrazek ${imageName} nie znaleziony w assets, próbuję z public.`);
        return `/images/${imageName}`;
      }
    }
  }
};
</script>

<style scoped>
/*
  Style CSS dla tego komponentu.
  'scoped' oznacza, że te style będą miały wpływ tylko na elementy w tym komponencie.
*/

.tlo {
  font-family: sans-serif;
  background-color: #fdffe6;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.trainers-container {
  width: 90%;
  max-width: 800px;
  margin-top: 25px; /* Zwiększony margines na górze, skoro nie ma navbara */
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
}

.trainers-title {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  font-size: 2em;
  font-weight: bold;
}

.trainers-list {
  display: grid; /* Używamy siatki CSS */
  grid-template-columns: 1fr 1fr; /* Dwie równe kolumny */
  gap: 20px; /* Odstęp między kartami */
}

.trainer-card {
  background: none;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  flex-direction: column; /* Zmieniamy na kolumnę wewnątrz karty */
  align-items: center; /* Wyśrodkowanie elementów w karcie */
  text-align: center; /* Wyśrodkowanie tekstu */
  border: 5px solid #f36e7a;
  transition: transform 0.2s ease;
}

.trainer-card:hover {
  transform: translateY(-3px);
}

.trainer-info {
  flex-grow: 1;
  margin-bottom: 15px; /* Dodatkowy odstęp między info a obrazkiem */
}

.trainer-name {
  color: #444;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.5em;
}

.trainer-contact {
  color: #555;
  margin-bottom: 5px;
  font-size: 0.95em;
}

.trainer-image-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 0; /* Usuwamy margin-left, bo elementy są wyśrodkowane */
  flex-shrink: 0;
  background-color: #e0b0b0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.trainer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.trainer-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
  font-size: 0.8em;
  text-align: center;
  border: 2px dashed #bbb;
  border-radius: 50%;
}


/* Media queries for responsiveness */
@media (max-width: 768px) {
  .trainers-container {
    padding: 15px;
    margin-top: 25px; /* Mniejszy margines na górze dla mobilnych */
  }

  .trainers-list {
    grid-template-columns: 1fr; /* Na małych ekranach z powrotem na jedną kolumnę */
  }

  .trainer-card {
    /* Na mobilnych, jeśli chcemy by były w kolumnie, ale nie chcemy resetować wyśrodkowania, zostawiamy flex-direction: column; */
    /* Jeśli chcemy wrócić do wyrównania do lewej, zmieniamy align-items: flex-start; */
    align-items: flex-start; /* Dla spójności z poprzednimi wersjami na mobile */
    text-align: left; /* Wyrównaj tekst do lewej */
  }

  .trainer-image-container {
    margin-top: 15px;
    /* margin-left: 0; jest już ustawiony globalnie dla mobile */
  }

  .trainers-title {
    font-size: 1.5em;
  }
}

/* Nowy media query dla średnich ekranów, jeśli 768px to za dużo na 1 kolumnę */
@media (min-width: 769px) and (max-width: 992px) {
  .trainers-list {
    grid-template-columns: 1fr; /* Na tabletach też jedna kolumna, jeśli dwie są za ciasne */
  }
}
</style>
