
class Message {
    constructor(uid, name, message) {
        this.uid = uid;
        this.name = name;
        this.message = message;
        this.time = new Date().getTime();
    }
}

class ChatMessages {

    constructor() {
        this.messages = [];
        this.users = {};
    }

    get last10() {
        this.messages = this.messages.splice(0, 10);
        return this.messages;
    }

    get usersArr() {
        return Object.values(this.users);
    }

    sendMessage(uid, name, message) {
        this.messages.unshift(new Message(uid, name, message));
    }

    addUser(user) {
        this.users[user.id] = user;
    }

    deleteUser(user) {
        delete this.users[user.id];
    }

}

module.exports = ChatMessages;