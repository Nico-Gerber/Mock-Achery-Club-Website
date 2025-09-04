window.About = {
  template: `
    <div class="home-container">
      <div class="full-width-image-container position-relative">
        <img src="images/clubflick.jpg" alt="clubphoto" class="full-width-image">
        <div class="overlay"></div>
        <div class="welcome-text">
          <h1>About Us</h1>
        </div>
      </div>
    </div>

    <div class="aboutcontainer">
      <div class="container text-center">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h4 class="service-title text-uppercase fw-bold">Meet The Founder</h4>
            <p class="service-text">
              George Giddleson is the proud founder and owner of the Data Guys Archery Club.
              Once an avid hunter with a remarkable talent for the bow, George’s life took 
              a dramatic turn after a tragic incident that led to the accidental extinction 
              of a rare species. Deeply affected, he chose to renounce hunting and adopted a 
              peaceful lifestyle as a vegan monk. Still carrying a deep love for archery, George 
              founded the club as a way to honor his vow of peace—transforming his passion into a 
              mindful and respectful pursuit.
            </p>
          </div>
          <div class="col">
            <img src="images/founder.jpg" alt="Portrait of George Giddleson, founder" class="founderimg img-fluid">
          </div>
        </div>
      </div>
    </div>

    <div class="aboutcontainer">
      <div class="container text-center">
        <div class="row align-items-center">
         <div class="col-md-6">
            <img src="images/ourphoto.jpg" alt="Group photo of club members" class="founderimg img-fluid">
          </div>
          <div class="col">
            <h4 class="service-title text-uppercase fw-bold">Our Philosophy</h4>
            <p class="service-text">
              At the Data Guys Archery Club, we believe that archery is for everyone.
              Our community is built on the values of inclusivity, respect, and shared passion. 
              Whether you're a seasoned archer or picking up a bow for the first time, everyone is 
              welcome—regardless of background, age, gender, or ability. We aim to create a safe, 
              supportive environment where every member can grow, learn, and thrive together.
            </p>
          </div>
        </div>
      </div>
    </div>

  
    <div class="aboutcontainer mt-5">
      <div class="container text-center">
        <h4 class="text-uppercase fw-bold mb-3">Join Our Archery Club</h4>

        <div class="row justify-content-center mb-3">
          <div class="col-md-4">
            <input v-model="firstName" type="text" class="form-control mb-2" placeholder="First Name">
            <input v-model="lastName" type="text" class="form-control mb-3" placeholder="Last Name">
            
            <div class="text-start mb-2">
              <label class="form-label fw-bold">Choose Your Bow Type:</label>
              <div v-for="(bow, index) in bowTypes" :key="index" class="form-check">
                <input class="form-check-input" type="radio" :id="bow" :value="bow" v-model="selectedBow">
                <label class="form-check-label" :for="bow">{{ bow }}</label>
              </div>
            </div>

            <button @click="submitForm" class="btn btn-primary mt-2">Submit</button>
          </div>
        </div>

       
        <div v-if="submitted" class="mt-5">
          <h4 class="fw-bold mb-4">Hi {{ firstName }} {{ lastName }}, here's information about the {{ selectedBow }}:</h4>

          <div class="row align-items-center text-start">
            <div class="col-md-6">
              <p>{{ bowDescriptions[selectedBow] }}</p>
            </div>
            <div class="col-md-6">
              <img :src="'images/' + selectedBow.toLowerCase().replace(/ /g, '') + '.png'" 
                   :alt="selectedBow + ' image'" class="img-fluid rounded shadow">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      firstName: '',
      lastName: '',
      selectedBow: '',
      submitted: false,
      bowTypes: [
        'Recurve',
        'Compound',
        'Recurve Barebow',
        'Compound Barebow',
        'Longbow'
      ],
      bowDescriptions: {
        'Recurve': 'The Recurve bow is one of the most popular types in both recreational and Olympic archery. Its unique curve at the tips provides extra power and speed without requiring much draw strength. Ideal for those who enjoy a balanced blend of tradition and performance, the recurve bow is lightweight, elegant, and highly accurate.',
        'Compound': 'The Compound bow features a system of pulleys and cables, making it incredibly efficient and powerful. It’s known for delivering high-speed arrows with minimal effort from the archer. This modern marvel is perfect for those who value precision, distance, and advanced mechanics in their shooting experience.',
        'Recurve Barebow': 'The Recurve Barebow is a stripped-down version of the standard recurve bow—used without sights, stabilizers, or other aids. It demands a high level of discipline, focus, and instinctive shooting skills. This type of bow is favored by traditionalists who enjoy raw, skill-based archery.',
        'Compound Barebow': 'A Compound Barebow offers the mechanical advantage of the compound design without any additional attachments. It challenges archers to rely purely on form, aim, and rhythm. Great for intermediate to advanced archers looking to hone their raw skills with modern tech.',
        'Longbow': 'The Longbow is a timeless classic with roots in medieval warfare and traditional hunting. Its tall, narrow frame and smooth draw make it a favorite among history enthusiasts and purists. Shooting a longbow is a deeply meditative experience that connects you to centuries of archery tradition.'
      }
    };
  },

  methods: {
    submitForm() {
      if (this.firstName && this.lastName && this.selectedBow) {
        this.submitted = true;
      } else {
        alert('Please fill in all fields and select a bow type.');
      }
    }
  }
};
