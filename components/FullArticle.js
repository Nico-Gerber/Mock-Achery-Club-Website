const FullArticle = {
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h1 class="card-title">{{ article.title }}</h1>
              <p class="card-text"><strong>Date:</strong> {{ article.date }}</p>
              <p class="card-text"><strong>Category:</strong> {{ article.category }}</p>
              <p class="card-text">{{ article.brief }}</p>
              <hr>
              <div class="card-text">{{ article.content }}</div>
              
              <hr>
              <h3>Comments</h3>

              <div v-if="comments.length === 0" class="mb-3">No comments yet.</div>

              <div v-for="c in comments" :key="c.CommentID" class="mb-2 p-2 border rounded">
                <strong>{{ c.Fname }} {{ c.Lname }}:</strong>
                <p v-if="edit !== c.CommentID">{{ c.CommentText }}</p>
                <div v-else class="mt-2">
                  <textarea v-model="editCommentText" class="form-control" placeholder="Edit your comment..."></textarea>
                  <button @click="confirmEdit(c.CommentID)" class="btn btn-primary mt-2 me-2">Submit</button>
                  <button @click="canceleditComment(c.CommentID)" class="btn btn-secondary mt-2">Cancel</button>
                </div>
                <small class="text-muted">{{ new Date(c.CommentDate).toLocaleString() }}</small>
                <div v-if="user && user.ArcherID === c.ArcherID" class="mt-2">
                  <button @click="editComment(c.CommentID)" class="btn btn-outline-secondary btn-sm me-2">Edit</button>
                  <button @click="deleteComment(c.CommentID)" class="btn btn-outline-danger btn-sm">Delete</button>
                </div>
              </div>

              <div v-if="user" class="mt-3">
                <textarea v-model="newComment" class="form-control" placeholder="Write a comment..."></textarea>
                <button @click="postComment" class="btn btn-primary mt-2">Post Comment</button>
              </div>

              <div v-else class="mt-3">
                <p><em>You must <router-link to="/login">log in</router-link> to post comments.</em></p>
              </div>

              <button class="btn btn-primary mt-3" @click="$router.push('/news')">Back to News</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      article: {},
      user: null,
      userArcherId: null,
      comments: [],
      newComment: '',
      edit: null,
      editCommentText: ''
    };
  },
  created() {
    const index = parseInt(this.$route.params.id);
    this.article = window.articlesData[index] || { title: 'Article Not Found', content: 'Content unavailable' };

    const savedUser = localStorage.getItem('user');
    this.user = savedUser ? JSON.parse(savedUser) : null;
    this.userArcherId = this.user ? this.user.ArcherID : null;

    this.loadComments();
  },
  methods: {
    async loadComments() {
      const res = await fetch(`api/comments.php?articleId=${this.article.id}`);
      if (res.ok) {
        this.comments = await res.json();
      } else {
        this.comments = [];
      }
    },
    async postComment() {
      if (!this.newComment.trim()) return;
      if (!this.user) {
        alert('You must be logged in to comment');
        return;
      }

      const payload = {
        articleId: this.article.id,
        archerId: this.user.ArcherID,
        commentText: this.newComment
      };

      const res = await fetch('api/comments.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        this.newComment = '';
        this.loadComments();
      }
    },
    async deleteComment(commentId) {
      const res = await fetch(`api/deletecomments.php?commentId=${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });

      if (res.ok) {
        this.loadComments();
      }
    },
    editComment(commentId) {
      this.edit = commentId;
    },
    canceleditComment(commentId) {
      this.edit = null;

    },
    async confirmEdit(commentId) {

        const payload = {
      commentId: commentId, 
      editCommentText: this.editCommentText
      };


      const res = await fetch(`api/editcomment.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        this.loadComments();
        this.edit = null;
      }
    }
  }
};

window.FullArticle = FullArticle;