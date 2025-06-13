<template>
  <div class="container">
    <div v-if="user" :style="{margin: 'auto'}" data-aos="fade-right">
      <h2>Twój profil</h2>
      <p><strong>Imię:</strong> {{ user.name }} {{ user.surname }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Wzrost (cm):</strong> {{ user.height }}</p>
      <p><strong>Waga (kg):</strong> {{ user.weight }}</p>
      <p><strong>BMI:</strong> {{ bmi }} ({{ bmiCategory }})</p>
      <RouterLink to="/edit-profile" class="text-blue-500 hover:underline">
        Edytuj profil
      </RouterLink>
    </div>

    <div :style="{width: '100%', margin: 'auto'}" data-aos="fade-left">
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
    </div>
  </div>
</template>

<script setup>
import {useAuthStore} from '@/store/auth';
import router from '@/router/index.js';
import {onMounted} from 'vue';
import CalHeatmap from 'cal-heatmap';
import 'cal-heatmap/cal-heatmap.css';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import LegendLite from 'cal-heatmap/plugins/LegendLite';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import * as dayjs from "dayjs";
import { useTrainingsStore } from "@/store/trainings.js";

const authStore = useAuthStore();
const trainingsStore = useTrainingsStore();
/** @type {User | null} */
const user = authStore.user;
const trainings = trainingsStore.trainings;

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

const nextMonthDate = new Date().setMonth(new Date().getMonth()+5);
const startMonthDate = new Date().setMonth(new Date().getMonth()-5);

onMounted(() => {
  cal = new CalHeatmap();
  cal.paint(
    {
      data: {
        source: trainings,
        x: 'date',
        y: d => +d['temp_max'],
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
          domain: [10, 20, 30],
        },
      },
      domain: {
        type: 'month',
        gutter: 12,
        label: { text: 'MMM', textAlign: 'start', position: 'top' },
      },
      subDomain: { type: 'ghDay', radius: 2, width: 14, height: 14, gutter: 4, label: 'D' },
      itemSelector: '#ex-ghDay',
    },
    [
      [
        Tooltip,
        {
          text: function (date, value, dayjsDate) {
            return (
              (value ? value : 'No') +
              ' contributions on ' +
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
          text: () => dayjs.weekdaysShort().map((d, i) => (i % 2 === 0 ? '' : d)),
          padding: [25, 0, 0, 0],
        },
      ],
    ]
  );
});
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
