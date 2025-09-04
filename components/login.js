
window.Login = {
  template: `
    <div class="container mt-4">
      <div v-if="!loggedIn">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="archerID"> Archer ID</label>
            <input v-model="form.archerId" type="number" id="archerID" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="yearBorn">Year Born</label>
            <input v-model="form.yearBorn" type="number" id="yearBorn" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary mt-2">Login</button>
          <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        </form>
      </div>

      <div v-else>
        <h2>Welcome, {{ user.Fname }}!</h2>
        <p><strong>Bow Type:</strong> {{ user.DefaultBow || 'Not assigned' }}</p>

        <div>
          <button v-if="viewLevel !== 'rounds'" class="btn btn-link" @click="backToRounds">← Back to Rounds</button>
          <button v-if="viewLevel === 'ends'" class="btn btn-link" @click="backToRanges">← Back to Ranges</button>
        </div>

        <table v-if="viewLevel === 'rounds'" class="table table-hover mt-3">
          <thead><tr><th>Round Name</th><th>Date</th><th>Score</th></tr></thead>
          <tbody>
            <tr v-for="r in rounds" :key="r.RoundShotID" style="cursor:pointer" @click="loadRanges(r.RoundShotID)">
              <td>{{ r.RoundName }}</td>
              <td>{{ r.Time.split(' ')[0] }}</td>
              <td>{{ r.RoundScore }}</td>
            </tr>
          </tbody>
        </table>

        <table v-if="viewLevel === 'ranges'" class="table table-hover mt-3">
          <caption>This table shows user rounds</caption>
          <thead>
            <tr>
              <th scope="col">Distance (m)</th>
              <th scope="col">Target Face</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in ranges" :key="r.RangeShotID" style="cursor:pointer" @click="loadEnds(r.RangeShotID)">
              <td>{{ r.RangeDistance }}m</td>
              <td>{{ r.RangeDesc }}</td>
              <td><strong>{{ r.RangeTotal }}</strong></td>
            </tr>
          </tbody>
        </table>

        <table v-if="viewLevel === 'ends'" class="table table-hover mt-3">
          <thead><tr><th>EndShot ID</th><th>Arrows (6 per end)</th></tr></thead>
          <tbody>
            <tr v-for="e in ends" :key="e.EndShotID">
              <td>{{ e.EndShotID }}</td>
              <td>{{ e.Arrow1 }}, {{ e.Arrow2 }}, {{ e.Arrow3 }}, {{ e.Arrow4 }}, {{ e.Arrow5 }}, {{ e.Arrow6 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  data() {
    return {
      form: { archerId: '', yearBorn: '' },
      loggedIn: false,
      user: null,
      rounds: [],
      ranges: [],
      ends: [],
      viewLevel: 'rounds',
      selectedRoundId: null,
      selectedRangeId: null,
      error: ''
    };
  },
  methods: {
    handleLogin() {
      this.error = ''; 
      fetch('api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form)
      })
        .then(res => {
          if (!res.ok) {
            this.error = 'Invalid login.';
            return;
          }
          return res.json();
        })
        .then(data => {
          if (this.error) return;
          this.user = data; 
          localStorage.setItem('user', JSON.stringify(this.user));
          this.loggedIn = true;
          this.viewLevel = 'rounds';
          this.loadRounds();
          this.$emit('login-success');
          this.$router.push('/login');
        })
        .catch(err => {
          console.error(err);
          this.error = 'Error logging in.';
        });
    },

    loadRounds() {
      this.error = ''; 
      fetch(`api/get_user_rounds.php?archerId=${this.user.ArcherID}`)
        .then(res => {
          if (!res.ok) {
            this.error = 'Failed to load rounds.';
            return;
          }
          return res.json();
        })
        .then(data => {
          if (this.error) return;
          this.rounds = Array.isArray(data) ? data : [];
          this.viewLevel = 'rounds'; 
        })
        .catch(err => {
          console.error(err);
          this.error = 'Error loading rounds.';
        });
    },

    loadRanges(roundShotId) {
      this.error = ''; 
      fetch(`api/get_round_ranges.php?roundShotId=${roundShotId}`)
        .then(res => {
          if (!res.ok) {
            this.error = 'Failed to load ranges.';
            return;
          }
          return res.json();
        })
        .then(data => {
          if (this.error) return;
          this.ranges = Array.isArray(data) ? data : [];
          this.viewLevel = 'ranges';
          this.selectedRoundId = roundShotId;
          this.selectedRangeId = null;
        })
        .catch(err => {
          console.error(err);
          this.error = 'Error loading ranges.';
        });
    },

    loadEnds(rangeShotId) {
      this.error = ''; 
      fetch(`api/get_range_endshots.php?rangeShotId=${rangeShotId}`)
        .then(res => {
          if (!res.ok) {
            this.error = 'Failed to load ends.';
            return;
          }
          return res.json();
        })
        .then(data => {
          if (this.error) return;
          this.ends = Array.isArray(data) ? data : [];
          this.viewLevel = 'ends';
          this.selectedRangeId = rangeShotId;
        })
        .catch(err => {
          console.error(err);
          this.error = 'Error loading ends.';
        });
    },

    backToRounds() {
      this.viewLevel = 'rounds';
      this.selectedRoundId = null;
      this.selectedRangeId = null;
      this.error = ''; 
    },

    backToRanges() {
      this.viewLevel = 'ranges';
      this.selectedRangeId = null;
      this.error = ''; 
    }
  },

  mounted() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.loggedIn = true;
      this.viewLevel = 'rounds';
      this.loadRounds();
    }
  }
};