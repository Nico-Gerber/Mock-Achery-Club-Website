const Signup = {
  template: `
    <section class="container text-left">
      <div class="col col-sm-12">
        <div v-if="submitStatus.message" :class="'alert alert-' + submitStatus.type">
          {{ submitStatus.message }}
        </div>

        <form class="register" name="Signupform" id="signupform" @submit.prevent="handleSubmit">
            <h2>Register</h2>
          <div class="form-group">
            <label for="archerid">Archer ID (4-digit PIN)</label>
            <input ref="archerIdInput" type="number" class="form-control" id="archerid" v-model="form.archerId" name="archerId" pattern="[0-9]{4}" placeholder="Enter 4-digit Archer ID" required>
            <small id="archerid-help" class="form-text text-muted">Enter a 4-digit numeric PIN.</small>
            <span v-if="errors.archerId" id="archerid-error" class="text-danger">{{ errors.archerId }}</span>
          </div>

          <div class="form-group">
            <label for="firstname">First Name</label>
            <input ref="firstNameInput" type="text" class="form-control" id="firstname" v-model="form.firstName" name="firstName" placeholder="First Name" required>
            <span v-if="errors.firstName" id="firstname-error" class="text-danger">{{ errors.firstName }}</span>
          </div>

          <div class="form-group">
            <label for="lastname">Last Name</label>
            <input ref="lastNameInput" type="text" class="form-control" id="lastname" v-model="form.lastName" name="lastName" placeholder="Last Name" required>
            <span v-if="errors.lastName" id="lastname-error" class="text-danger">{{ errors.lastName }}</span>
          </div>

          <div class="form-group">
            <label for="yearborn">Year Born</label>
            <input ref="yearBornInput" type="number" class="form-control" id="yearborn" v-model.number="form.yearBorn" name="yearBorn" placeholder="Year Born" min="1900" max="2025" required>
            <span v-if="errors.yearBorn" id="yearborn-error" class="text-danger">{{ errors.yearBorn }}</span>
          </div>

          <div class="form-group">
            <label for="gender">Gender</label>
            <select ref="genderInput" class="form-control" id="gender" v-model="form.gender" name="gender" required>
              <option value="" disabled selected>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <span v-if="errors.gender" id="gender-error" class="text-danger">{{ errors.gender }}</span>
          </div>

          <div class="form-group">
            <label for="bowtype">Bow Type</label>
            <select ref="BowInput" class="form-control" id="bowtype" name="bowtype" v-model="form.bowtype" required>
              <option value="" disabled selected>Select a Bow</option>
              <option value="Recurve">Recurve</option>
              <option value="Compound">Compound</option>
              <option value="Barebow">Barebow</option>
              <option value="Compound Barebow">Compound Barebow</option>
              <option value="Long Bow">Long Bow</option>
            </select>
            <span v-if="errors.bowtype" id="bowtype-error" class="text-danger">{{ errors.bowtype }}</span>
          </div>

          <br>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Register' }}
          </button>
        </form>
      </div>
    </section>
  `,

  data() {
    return {
      form: {
        archerId: '',
        firstName: '',
        lastName: '',
        yearBorn: null,
        gender: '',
        bowtype: ''
      },
      isSubmitting: false,
      submitStatus: {
        type: '',
        message: ''
      },
      errors: {
        archerId: '',
        firstName: '',
        lastName: '',
        yearBorn: '',
        gender: '',
        bowtype: ''
      }
    };
  },

  methods: {
    validateForm() {
      this.errors = {
        archerId: '',
        firstName: '',
        lastName: '',
        yearBorn: '',
        gender: '',
        bowtype: ''
      };
      let isValid = true;

      if (!/^\d{4}$/.test(this.form.archerId)) {
        this.errors.archerId = 'Archer ID must be exactly 4 digits';
        this.submitStatus = {
          type: 'danger',
          message: 'Archer ID must be exactly 4 digits'
        };
        this.$refs.archerIdInput.focus();
        isValid = false;
      }

      if (!/^[A-Za-z]+$/.test(this.form.firstName)) {
        this.errors.firstName = 'First name must contain only letters';
        this.submitStatus = {
          type: 'danger',
          message: 'First name must contain only letters'
        };
        if (isValid) this.$refs.firstNameInput.focus();
        isValid = false;
      }

      if (!/^[A-Za-z]+$/.test(this.form.lastName)) {
        this.errors.lastName = 'Last name must contain only letters';
        this.submitStatus = {
          type: 'danger',
          message: 'Last name must contain only letters'
        };
        if (isValid) this.$refs.lastNameInput.focus();
        isValid = false;
      }

      if (this.form.yearBorn < 1900 || this.form.yearBorn > 2025) {
        this.errors.yearBorn = 'Please enter a valid year of birth';
        this.submitStatus = {
          type: 'danger',
          message: 'Please enter a valid year of birth'
        };
        if (isValid) this.$refs.yearBornInput.focus();
        isValid = false;
      }

      if (!this.form.gender) {
        this.errors.gender = 'Please select a gender';
        this.submitStatus = {
          type: 'danger',
          message: 'Please select a gender'
        };
        if (isValid) this.$refs.genderInput.focus();
        isValid = false;
      }

      if (!this.form.bowtype) {
        this.errors.bowtype = 'Please select a bow type';
        this.submitStatus = {
          type: 'danger',
          message: 'Please select a bow type'
        };
        if (isValid) this.$refs.BowInput.focus();
        isValid = false;
      }

      return isValid;
    },

    handleSubmit() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;
      this.submitStatus = { type: '', message: '' };

      fetch('api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          archerId: this.form.archerId,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          yearBorn: this.form.yearBorn,
          gender: this.form.gender,
          bowtype: this.form.bowtype,
        })
      })
      .then(response => response.text())
      .then(data => {
        this.submitStatus = {
          type: 'success',
          message: data
        };
        this.resetForm();
      })
      .catch(error => {
        this.submitStatus = {
          type: 'danger',
          message: 'An error occurred: ' + error.message
        };
      })
      .finally(() => {
        this.isSubmitting = false;
      });
    },

    resetForm() {
      this.form = {
        archerId: '',
        firstName: '',
        lastName: '',
        yearBorn: null,
        gender: '',
        bowtype: ''
      };
      this.errors = {
        archerId: '',
        firstName: '',
        lastName: '',
        yearBorn: '',
        gender: '',
        bowtype: ''
      };
    }
  }
};

window.Signup = Signup;