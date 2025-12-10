class User {
  constructor(
    username,
    email,
    uid,
    photoURL = "https://i.pinimg.com/originals/7c/d3/d4/7cd3d4a24e4821ead74b90cb8a55a692.jpg"
  ) {
    this.$username = username;
    this.$email = email;
    this.$uid = uid;
    this.$photoURL = photoURL;
  }

  toObject() {
    return {
      username: this.$username,
      email: this.$email,
      uid: this.$uid,
      photoURL: this.$photoURL,
    };
  }
}
//====================================
class Task {
  constructor(taskContent, createdBy, isCompleted = false ) {
    this.$taskContent = taskContent;
    this.$isCompleted = isCompleted;
    this.$createdBy = createdBy;
  }

  toObject() {
    return {
      taskContent: this.$taskContent,
      createdBy: this.$createdBy,
      isCompleted: this.$isCompleted,
    };
  }

  toHTMLElement() {
    const li = `<li class="list-group-item ${
      this.$isCompleted ? "bg-secondary text-white" : ""
    }">
            ${this.$taskContent} <button class="btn btn-primary" ${
      this.$isCompleted ? "disabled" : ""
    }>Done</button>
            <button class="btn btn-danger">Del</button>
          </li>`;
    return li;
  }
}

//====================================
export { User, Task };
