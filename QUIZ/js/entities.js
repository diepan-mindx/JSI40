// save list with 5 users have top score
class Leaderboard {
  constructor(type, level, id, listUser = []) {
    this.$type = type;
    this.$level = level;
    this.$id = id;

    // ensure array + sort desc + keep top 5
    this.$listUser = Array.isArray(listUser)
      ? listUser.sort((a, b) => b.score - a.score).slice(0, 5)
      : [];
  }

  // =================================================
  // convert to plain object (for Firebase)
  toObject() {
    return {
      type: this.$type,
      level: this.$level,
      id: this.$id,
      users: this.$listUser.map((u) => ({
        name: u.name,
        score: u.score,
      })),
      updatedAt: Date.now(),
    };
  }

  // =================================================
  // convert to HTML string
  toHTMLElement() {
    if (this.$listUser.length === 0) {
      return `
        <div id="leader-board">
          <div class="title">LEADERBOARD</div>
          <div class="no-data">
            No data to show, make a new record now!
          </div>
        </div>
      `;
    }

    const cards = this.$listUser
      .map((user, index) => {
        return `
          <div class="card">
            <span class="ranking">${index + 1}</span>
            <span class="username">${user.name}</span>
            <span class="score">${user.score}</span>
          </div>
        `;
      })
      .join("");

    return `
      <div id="leader-board">
        <div class="title">LEADERBOARD</div>
        ${cards}
      </div>
    `;
  }
}

//-----------------------------------------------------------------
class Question {
  constructor(id, question, ans1, ans2, ans3, ans4, rightAns, categories = []) {
    this.$id = id;
    this.$question = question;
    this.$answers = [ans1, ans2, ans3, ans4];
    this.$rightAns = rightAns; // index: 0 - 3
    this.$categories = categories; // ["easy", "history"]
  }

  // =================================================
  // convert to plain object (for Firebase, without id)
  toObject() {
    return {
      question: this.$question,
      answers: this.$answers,
      rightAns: this.$rightAns,
      categories: this.$categories,
    };
  }

  // =================================================
  // convert to HTML
  toHTMLElement() {
    const answersHTML = this.$answers
      .map((answer, index) => {
        const isCorrect = index === this.$rightAns;
        return `
          <button 
            class="answer"
            type="button"
            data-index="${index}"
            data-correct="${isCorrect}"
          >
            ${answer}
          </button>
        `;
      })
      .join("");

    return `
      <form id="question-form" data-id="${this.$id}">
        <div class="title">${this.$question}</div>
        <div class="answer-list">
          ${answersHTML}
        </div>
      </form>
    `;
  }
}

export { Leaderboard, Question };
