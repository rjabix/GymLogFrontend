<template>
  <div class="terminal">
    <div class="output">
      <div v-for="(line, index) in outputLines" :key="index" class="line">
        {{ line }}
      </div>
    </div>
    <div class="input-area">
      <span class="prompt">$</span>
      <input
        v-model="currentCommand"
        @keyup.enter="executeCommand"
        class="input"
        placeholder="Type a command..."
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from "axios";
import backend_url from "@/router/backend_url.js";

export default {
  name: 'Terminal',
  setup() {
    const outputLines = ref([]);
    const currentCommand = ref('');

    const executeCommand = () => {
      if (currentCommand.value.trim() === '') return;

      // Add the command to the output
      outputLines.value.push(`$ ${currentCommand.value}`);

      // Process the command and add the result to the output
      const result = processCommand(currentCommand.value);
      if (result) outputLines.value.push(result);

      // Clear the input field
      currentCommand.value = '';
    };

    const processCommand = (command) => {
      const args = command;

      if (command.startsWith('prosze dodaj nowe wyciskanko')) {
        axios.post(backend_url + '/admin/add-exercise', {
          name: args[3],
          description: ""
        }, { withCredentials: true })
          .then(response => {
            outputLines.value.push(`Exercise added: ${response.data}`);
          })
          .catch(error => {
            outputLines.value.push(`Error adding exercise: ${error.message}`);
          });
        return;
      }

      if (command.startsWith('prosze nie chcemy cie w naszym skladzie')) {
        axios.delete(backend_url + 'admin/users/' + args[3], { withCredentials: true })
          .then(response => {
            outputLines.value.push(`User with ID ${args[3]} removed.`);
          })
          .catch(error => {
            outputLines.value.push(`Error removing user: ${error.message}`);
          });
        return;
      }

      if (command.startsWith('dodaj mistrzunia')) {
        axios.post(backend_url + '/admin/approve_trainer/' + args[2], { withCredentials: true })
          .then(response => {
            outputLines.value.push(`Trainer request approved for user with ID: ${args[2]}`);
          })
          .catch(error => {
            outputLines.value.push(`Error adding champion: ${error.message}`);
          });
        return;
      }

      if (command.startsWith('we we mistrzunia')) {
        axios.post(backend_url + '/admin/reject_trainer/' + args[3], { withCredentials: true })
          .then(response => {
            outputLines.value.push(`Trainer request rejected for user with ID: ${args[3]}`);
          })
          .catch(error => {
            outputLines.value.push(`Error adding champion: ${error.message}`);
          });
        return;
      }

      if (command.startsWith('this is GymLog')) {
        axios.delete(backend_url + '/admin/delete-trainer/' + args[3], { withCredentials: true })
          .then(response => {
            outputLines.value.push(`Trainer removed for user with ID: ${args[3]}`);
          })
          .catch(error => {
            outputLines.value.push(`Error adding champion: ${error.message}`);
          });
        return;
      }

      if (command.startsWith('idz do tej swojej kolezanki')) {
        axios.post(backend_url + '/admin/unassign-trainer?clientid=' + args[5], { withCredentials: true })
          .then(response => {
            outputLines.value.push(`Trainer unassigned: ${response.data}`);
          })
          .catch(error => {
            outputLines.value.push(`Error adding champion: ${error.message}`);
          });
        return;
      }

      if (command.startsWith('prosze wylistuj trenerow')) {
        axios.get(backend_url + '/admin/all-trainers', { withCredentials: true })
          .then(response => {
            outputLines.value.push(response.data);
          })
          .catch(error => {
            outputLines.value.push(`Error fetching trainers: ${error.message}`);
          });
        return;
      }

      if (command.startsWith('prosze wylistuj uzytkownikow')) {
        axios.get(backend_url + '/admin/all-users', { withCredentials: true })
          .then(response => {
            outputLines.value.push(response.data);
          })
          .catch(error => {
            outputLines.value.push(`Error fetching users: ${error.message}`);
          });
        return;
      }

      if (command.startsWith('i need a hero')) {
        return 'Available commands: prosze wylistuj <uzytkownikow | trenerow>, prosze dodaj nowe wyciskanko <id>, prosze nie chcemy cie w naszym skladzie <userId>, dodaj mistrzunia <userId>, we we mistrzunia <userId>, this is GymLog <userId>, shipuje was uwu <userId> <trainer_userId>, idz do tej swojej kolezanki <userId>, i need a hero, prosze clining clining';
      }

      if (command.startsWith('prosze clining clining')) {
        outputLines.value = [];
        return '';
      }

      return `Unknown command: ${command}`;
    };

    return {
      outputLines,
      currentCommand,
      executeCommand,
    };
  },
};
</script>

<style scoped>
.terminal {
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Courier New', Courier, monospace;
  padding: 10px;
  border-radius: 5px;
  min-width: 100%;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.output {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

.line {
  white-space: pre-wrap;
}

.input-area {
  display: flex;
  align-items: center;
}

.prompt {
  color: #00ff00;
  margin-right: 5px;
}

.input {
  background: none;
  border: none;
  color: #d4d4d4;
  outline: none;
  flex-grow: 1;
  font-family: 'Courier New', Courier, monospace;
}
</style>
