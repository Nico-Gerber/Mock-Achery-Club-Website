const News = {
  template: ` <div class="home-container">
             <div class="full-width-image-container">
               <img src="images/clubflick.jpg" alt="clubphoto" class="full-width-image">
               <div class="overlay"></div>
               <div class="welcome-text">
                 <h1>News</h1>
               </div>
             </div>
           </div>



    <div class="container mt-4">
      <div class="row">
        <!-- Left column: Search and Category Filter (first third, inline with top article) -->
        <div class="col-md-0 mb-4">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">Filter Articles</h2>
              <div class="mb-3">
              <label for="aritclesearch">Search:</label>
                <input type="text" class="form-control" v-model="searchQuery" id="aritclesearch" placeholder="Search by date, title, or brief..." aria-label="Search articles">
              </div>
              <div>
              <label for="selectedCategory">Select Category:</label>
                <select class="form-select" v-model="selectedCategory" id="selectedCategory" aria-label="Filter by category" >
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

       
         <div class="col-md-12">
          <div class="row">
            <div class="col-12 text-center" v-for="(article, index) in paginatedArticles" :key="article.title">
              <div class="card mx-auto mb-4" style="max-width: 600px; cursor: pointer;" @click="showFullArticle(index)">
                <div class="card-body text-start">
                  <h3 class="card-title">{{ article.title }}</h3>
                  <p class="card-text"><strong>Date:</strong> {{ article.date }}</p>
                  <p class="card-text"><strong>Category:</strong> {{ article.category }}</p>
                  <p class="card-text">{{ article.brief }}</p>
                </div>
              </div>
            </div>
          </div>

        
          <nav aria-label="Article pagination">
            <ul class="pagination justify-content-center mt-4">
              <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
                <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      articles: window.articlesData || [],
      currentPage: 1,
      articlesPerPage: 5,
      searchQuery: '',
      selectedCategory: ''
    };
  },
  computed: {
    categories() {
      return [...new Set(this.articles.map(article => article.category))].sort();
    },
    filteredArticles() {
      let filtered = this.articles;
      
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(article => 
          article.date.toLowerCase().includes(query) ||
          article.title.toLowerCase().includes(query) ||
          article.brief.toLowerCase().includes(query)
        );
      }

    
      if (this.selectedCategory) {
        filtered = filtered.filter(article => 
          article.category.toLowerCase() === this.selectedCategory.toLowerCase()
        );
      }

      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredArticles.length / this.articlesPerPage);
    },
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.articlesPerPage;
      const end = start + this.articlesPerPage;
      return this.filteredArticles.slice(start, end);
    }
  },
  methods: {
    
    showFullArticle(index) {
     
      const articleIndex = (this.currentPage - 1) * this.articlesPerPage + index;
    
      this.$router.push(`/news/article/${articleIndex}`);
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    selectedCategory() {
      this.currentPage = 1; 
    }
  },
  mounted() {
    console.log('Articles loaded:', this.articles);
    console.log('Categories:', this.categories);
  }
};

window.News = News;