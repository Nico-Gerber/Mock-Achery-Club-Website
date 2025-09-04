const routes = [
  { path: '/', component: window.Home },
  { path: '/about', component: window.About },
  { path: '/news', component: window.News },
  { path: '/news/article/:id', component: window.FullArticle },
  { path: '/login', component: window.Login },
  { path: '/signup', component: window.Signup },
  { path: '/datapage', component: window.datapage }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

const App = {
  template: `
    <div>
      <nav class="nav-custom" role="navigation" aria-label="Main navigation">
        <router-link class="nav-link" to="/">Home</router-link>
        <router-link class="nav-link" to="/about">About</router-link>
        <router-link class="nav-link" to="/news">News</router-link>
        <router-link v-if="!isLoggedIn" class="nav-link" to="/login">Login</router-link>
        <router-link v-else class="nav-link" to="/login">Profile</router-link>
        <router-link v-if="!isLoggedIn" class="nav-link" to="/signup">Sign Up</router-link>
        <router-link class="nav-link" to="/datapage">Data</router-link>
        <a v-if="isLoggedIn" href="/" class="nav-link text-danger" to="/" @click.prevent="logout">Logout</a>
      </nav>

      <router-view @login-success="checkLoginStatus" @logout-success="checkLoginStatus"></router-view>
    </div>
  `,
  data() {
    return {
      isLoggedIn: false
    };
  },
  methods: {
    checkLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem('user');
    },
    logout() {
      localStorage.removeItem('user');
      this.isLoggedIn = false; 
      this.checkLoginStatus(); 
      this.$router.push('/'); 
    }
  },
  mounted() {
    this.checkLoginStatus();
    window.addEventListener('storage', this.checkLoginStatus);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.checkLoginStatus);
  }
};

const app = Vue.createApp(App);
app.use(router);
app.mount('#app');