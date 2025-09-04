const datapage = {
  template: `
    <div class="container mt-4">
      <h2>Archery Scores</h2>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div class="mb-3 row">
        <div class="col-md-4">
        <label for="namesearch"> Name: </label>
          <input type="text" class="form-control" placeholder="Search by name" id="namesearch" v-model="filters.search">
        </div>
        <div class="col-md-3">
        <label for="roundselect"> Round: </label>
          <select class="form-control" v-model="filters.round"  id="roundselect" @change="fetchScores">
            <option value="">All Rounds</option>
            <option v-for="round in uniqueRounds" :key="round" :value="round">{{ round }}</option>
          </select>
        </div>
        <div class="col-md-3">
      <label for="ageselect"> Age: </label>
      <select class="form-control" v-model="filters.age" id="ageselect" @change="fetchScores">
            <option value="">All Ages</option>
            <option v-for="age in uniqueAge" :key="age" :value="age">{{ age }}</option>
          </select>
        </div>
        <div class="col-md-3">

        <label for="bowtype"> Bow Type: </label>
          <select class="form-control" v-model="filters.bow"  id="bowtype" @change="fetchScores">
            <option value="">All Bow Types</option>
            <option v-for="bow in uniqueBows" :key="bow" :value="bow">{{ bow }}</option>
          </select>
        </div>
        <div class="col-md-3">
        <label for="score"> Sort By Score: </label>
          <select class="form-control" v-model="filters.sort" id="score" @change="updateSort">
            <option value="asc">Sort by Score: Low to High</option>
            <option value="desc">Sort by Score: High to Low</option>
          </select>
        </div>
        <div class="col-md-12">
          <label for="scoreSlider" class="form-label">Min Score: <span>{{ filters.minScore }}</span></label>
          <input type="range" class="form-range" id="scoreSlider" min="400" max="1440" v-model.number="filters.minScore" @input="fetchScores">
        </div>
      </div>
      <table class="table table-striped table-hover">
      <caption>This table shows member's rounds</caption>
        <thead>
          <tr>
            <th scope="col">Member</th>
            <th scope="col">Date</th>
            <th scope="col"> Score <span v-if="filters.sort === 'asc'">↑</span> <span v-if="filters.sort === 'desc'">↓</span> </th>
            <th scope="col">Round Type</th>
            <th scope="col">Bow Type</th>
            <th scope="col">Age Bracket</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(score, index) in paginatedArticles" :key="index">
            <td>{{ score.member }}</td>
            <td>{{ score.date }}</td>
            <td>{{ score.score }}</td>
            <td>{{ score.round_type }}</td>
            <td>{{ score.DefaultBow }}</td>
            <td>{{ score.age_bracket }}</td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Scores pagination">
        <ul class="pagination justify-content-center mt-4">
          <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  data() {
    return {
      scores: [],
      currentPage: 1,
      scoresPerPage: 20,
      filters: {
        search: '',
        round: '',
        age: '',
        bow: '',
        minScore: 400,
        sort: 'desc' 
      },
      error: null
    };
  },
  computed: {
    uniqueRounds() {
      return [...new Set(this.scores.map(s => s.round_type))];
    },
    uniqueBows() {
      return [...new Set(this.scores.map(s => s.DefaultBow))];
    },
    uniqueAge() {
      return [...new Set(this.scores.map(s => s.age_bracket))];
    },
    filteredScores() {
      let filtered = this.scores;

      if (this.filters.search) {
        const query = this.filters.search.toLowerCase();
        filtered = filtered.filter(score =>
          score.member.toLowerCase().includes(query)
        );
      }

      if (this.filters.round) {
        filtered = filtered.filter(score =>
          score.round_type.toLowerCase() === this.filters.round.toLowerCase()
        );
      }

      if (this.filters.age) {
        filtered = filtered.filter(score =>
          score.age_bracket.toLowerCase() === this.filters.age.toLowerCase()
        );
      }

      if (this.filters.bow) {
        filtered = filtered.filter(score =>
          score.DefaultBow.toLowerCase() === this.filters.bow.toLowerCase()
        );
      }

      if (this.filters.minScore) {
        filtered = filtered.filter(score =>
          Number(score.score) >= Number(this.filters.minScore)
        );
      }

     
      return filtered.sort((a, b) => {
        return this.filters.sort === 'asc'
          ? Number(a.score) - Number(b.score)
          : Number(b.score) - Number(a.score);


      });
    },
    totalPages() {
      return Math.ceil(this.filteredScores.length / this.scoresPerPage);
    },
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.scoresPerPage;
      const end = start + this.scoresPerPage;
      return this.filteredScores.slice(start, end);
    }
  },
 methods: {
  fetchScores() {
    this.error = null;
    fetch('api/get_scores.php')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch scores');
        return res.json();
      })
      .then(data => {
        this.scores = Array.isArray(data) ? data : [];
        this.currentPage = 1;
      })
     
  },
  updateSort() {
    this.currentPage = 1; 
  },
  changePage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
},
  mounted() {
    this.fetchScores();
  },
  watch: {
    'filters.search'() {
      this.currentPage = 1;
    },
    'filters.round'() {
      this.currentPage = 1;
      this.fetchScores();
    },
    'filters.age'() {
      this.currentPage = 1;
      this.fetchScores();
    },
    'filters.bow'() {
      this.currentPage = 1;
      this.fetchScores();
    },
    'filters.minScore'() {
      this.currentPage = 1;
      this.fetchScores();
    },
    'filters.sort'() {
      this.currentPage = 1;
    }
  }
};

window.datapage = datapage;