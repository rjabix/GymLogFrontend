<template>
  <div class="container">
    <div v-if="user" :style="{ margin: 'auto' }" data-aos="fade-right">
      <h2>Twój profil</h2>
      <p><strong>Imię:</strong> {{ user.name }} {{ user.surname }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Wzrost (cm):</strong> {{ user.height }}</p>
      <p><strong>Waga (kg):</strong> {{ user.weight }}</p>
      <p><strong>BMI:</strong> {{ bmi }} ({{ bmiCategory }})</p>
      <RouterLink to="/edit-profile" class="text-blue-500 hover:underline">
        Edytuj profil
      </RouterLink>
      <RouterLink v-if="user.role === 'admin'" to="/admin" class="text-blue-500 hover:underline">
        Panel administracyjny
      </RouterLink>
    </div>

    <div :style="{ width: '100%', margin: 'auto' }" data-aos="fade-left">
      <h2>Statystyki</h2>
      <div
        :style="{
          background: '#22272d',
          color: '#adbac7',
          borderRadius: '3px',
          padding: '1rem',
          overflow: 'hidden',
        }"
      >
        <div id="ex-ghDay" class="margin-bottom--md"></div>
        <a
          class="button button--sm button--secondary margin-top--sm"
          href="#"
          @click.prevent="cal.previous()"
        >
          ← Previous
        </a>
        <a
          class="button button--sm button--secondary margin-top--sm margin-left--xs"
          href="#"
          @click.prevent="cal.next()"
        >
          Next →
        </a>
        <div :style="{ float: 'right', fontSize: '12px' }">
          <span :style="{ color: '#768390' }">Less</span>
          <div
            id="ex-ghDay-legend"
            :style="{ display: 'inline-block', margin: '0 4px' }"
          ></div>
          <span :style="{ color: '#768390', fontSize: '12px' }">More</span>
        </div>
      </div>

      <!-- Additional Chart -->
      <div
        :style="{
          background: '#fbe9e7',
          color: '#5d4037',
          borderRadius: '3px',
          padding: '1rem',
          marginTop: '2rem',
        }"
      >
        <canvas id="additionalChart" style="height: 400px;"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
import { useRankingsStore } from '@/store/rankings.js';
import router from '@/router/index.js';
import { ref, onMounted, nextTick } from 'vue';
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import LegendLite from 'cal-heatmap/plugins/LegendLite';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import * as dayjs from 'dayjs';
import localeDate from 'dayjs/plugin/localeData';
import { Chart } from 'chart.js';
import {useExercisesStore} from "@/store/exercises.js";

dayjs.extend(localeDate);

const authStore = useAuthStore();
const rankingsStore = useRankingsStore();
const user = authStore.user;

if (user == null) {
  console.warn('UserData is null -- redirecting to login.');
  router.push('/login');
}

const bmi = user ? (user.weight / ((user.height / 100) ** 2)).toFixed(2) : null;

const bmiCategory = user
  ? bmi < 18.5
    ? 'Niedowaga'
    : bmi < 24.9
      ? 'Prawidłowa waga'
      : bmi < 29.9
        ? 'Nadwaga'
        : 'Otyłość'
  : null;

let cal;
let chartInstance = null;
const nextMonthDate = new Date().setMonth(new Date().getMonth() + 5);
const startMonthDate = new Date().setMonth(new Date().getMonth() - 5);

onMounted(async () => {
  // Wait for the DOM to be fully rendered
  await nextTick();

  // Fetch gym time data and initialize the charts
  try {
    const data = await rankingsStore.fetchGymTime();
    const data2 = await rankingsStore.fetchRankingForAllExercises();
    if (data && data.length > 0) {
      initializeCalendarHeatmap(data);
      initializeAdditionalChart(data2);
    } else {
      console.warn('No data available to initialize the charts.');
    }
  } catch (error) {
    console.error('Error fetching gym time data:', error);
  }



});

const initializeCalendarHeatmap = (data) => {
  console.log('Initializing calendar heatmap with data:', data);
  cal = new CalHeatmap();
  cal.paint(
    {
      data: {
        source: data,
        type: 'json',
        x: 'date',
        y: (d) => +d['value'],
        groupY: 'max',
      },
      date: {
        start: startMonthDate,
        max: nextMonthDate,
        locale: 'pl',
        highlight: [new Date()],
      },
      range: 12,
      scale: {
        color: {
          type: 'threshold',
          range: ['#14432a', '#166b34', '#37a446', '#4dd05a'],
          domain: [1, 2, 3],
        },
      },
      domain: {
        type: 'month',
        gutter: 12,
        label: {text: 'MMM', textAlign: 'start', position: 'top'},
      },
      subDomain: {type: 'ghDay', radius: 2, width: 14, height: 14, gutter: 4},
      itemSelector: '#ex-ghDay',
    },
    [
      [
        Tooltip,
        {
          text: function (date, value, dayjsDate) {
            return (
              (value ? value : '0') +
              ' godzin spędzono w dniu ' +
              dayjsDate.format('dddd, MMMM D, YYYY')
            );
          },
        },
      ],
      [
        LegendLite,
        {
          includeBlank: true,
          itemSelector: '#ex-ghDay-legend',
          radius: 2,
          width: 11,
          height: 11,
          gutter: 4,
        },
      ],
      [
        CalendarLabel,
        {
          width: 30,
          textAlign: 'start',
          padding: [25, 0, 0, 0],
        },
      ],
    ]
  );
};

const initializeAdditionalChart = (rankingsData) => {
  console.log('Initializing additional chart with rankings data:', rankingsData);

  const ctx = document.getElementById('additionalChart').getContext('2d');

  // Destroy the previous chart instance if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Prepare datasets for each exercise
  const datasets = rankingsData.map((ranking) => ({
    label: useExercisesStore().exercises.find(ex => ex.id === ranking.exerciseId)?.name || 'Unknown Exercise',
    data: ranking.ranking.data,
    borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
    borderWidth: 2,
    tension: 0.3,
  }));

  // Create a new chart instance
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: rankingsData[0]?.ranking.labels || [], // Use labels from the first dataset
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Week',
          },
        },
        y: {
          title: {
            display: true,
            text: 'One Rep Max',
          },
          beginAtZero: true,
        },
      },
    },
  });
};
</script>

<style scoped>
h2 {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  gap: 1rem; /* Optional: Add spacing between the columns */
  padding: 1.5rem;
  background-color: #fdffe6;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-family: sans-serif;
}

.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.button--sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.button--secondary {
  background-color: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.button--secondary:hover {
  background-color: #e5e7eb;
  border-color: #cbd5e1;
}

.margin-top--sm {
  margin-top: 0.5rem;
}

.margin-left--xs {
  margin-left: 0.25rem;
}
</style>
