const helpers = {
  formatDate: (time) => {
    const date = new Date(time);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  },
};

module.exports = helpers;
